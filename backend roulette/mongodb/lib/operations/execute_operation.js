"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeOperation = void 0;
const read_preference_1 = require("../read_preference");
const error_1 = require("../error");
const operation_1 = require("./operation");
const utils_1 = require("../utils");
const common_1 = require("../sdam/common");
const MMAPv1_RETRY_WRITES_ERROR_CODE = error_1.MONGODB_ERROR_CODES.IllegalOperation;
const MMAPv1_RETRY_WRITES_ERROR_MESSAGE = 'This MongoDB deployment does not support retryable writes. Please add retryWrites=false to your connection string.';
function executeOperation(topology, operation, callback) {
    if (!(operation instanceof operation_1.AbstractOperation)) {
        throw new error_1.MongoDriverError('This method requires a valid operation instance');
    }
    return utils_1.maybePromise(callback, cb => {
        if (topology.shouldCheckForSessionSupport()) {
            return topology.selectServer(read_preference_1.ReadPreference.primaryPreferred, err => {
                if (err)
                    return cb(err);
                executeOperation(topology, operation, cb);
            });
        }
        // The driver sessions spec mandates that we implicitly create sessions for operations
        // that are not explicitly provided with a session.
        let session = operation.session;
        let owner;
        if (topology.hasSessionSupport()) {
            if (session == null) {
                owner = Symbol();
                session = topology.startSession({ owner, explicit: false });
            }
            else if (session.hasEnded) {
                return cb(new error_1.MongoDriverError('Use of expired sessions is not permitted'));
            }
            else if (session.snapshotEnabled && !topology.capabilities.supportsSnapshotReads) {
                return cb(new error_1.MongoDriverError('Snapshot reads require MongoDB 5.0 or later'));
            }
        }
        else if (session) {
            // If the user passed an explicit session and we are still, after server selection,
            // trying to run against a topology that doesn't support sessions we error out.
            return cb(new error_1.MongoDriverError('Current topology does not support sessions'));
        }
        try {
            executeWithServerSelection(topology, session, operation, (err, result) => {
                if (session && session.owner && session.owner === owner) {
                    return session.endSession(err2 => cb(err2 || err, result));
                }
                cb(err, result);
            });
        }
        catch (e) {
            if (session && session.owner && session.owner === owner) {
                session.endSession();
            }
            throw e;
        }
    });
}
exports.executeOperation = executeOperation;
function supportsRetryableReads(server) {
    return utils_1.maxWireVersion(server) >= 6;
}
function executeWithServerSelection(topology, session, operation, callback) {
    const readPreference = operation.readPreference || read_preference_1.ReadPreference.primary;
    const inTransaction = session && session.inTransaction();
    if (inTransaction && !readPreference.equals(read_preference_1.ReadPreference.primary)) {
        callback(new error_1.MongoDriverError(`Read preference in a transaction must be primary, not: ${readPreference.mode}`));
        return;
    }
    const serverSelectionOptions = { session };
    function callbackWithRetry(err, result) {
        if (err == null) {
            return callback(undefined, result);
        }
        const hasReadAspect = operation.hasAspect(operation_1.Aspect.READ_OPERATION);
        const hasWriteAspect = operation.hasAspect(operation_1.Aspect.WRITE_OPERATION);
        const itShouldRetryWrite = shouldRetryWrite(err);
        if ((hasReadAspect && !error_1.isRetryableError(err)) || (hasWriteAspect && !itShouldRetryWrite)) {
            return callback(err);
        }
        if (hasWriteAspect &&
            itShouldRetryWrite &&
            err.code === MMAPv1_RETRY_WRITES_ERROR_CODE &&
            err.errmsg.match(/Transaction numbers/)) {
            callback(new error_1.MongoServerError({
                message: MMAPv1_RETRY_WRITES_ERROR_MESSAGE,
                errmsg: MMAPv1_RETRY_WRITES_ERROR_MESSAGE,
                originalError: err
            }));
            return;
        }
        // select a new server, and attempt to retry the operation
        topology.selectServer(readPreference, serverSelectionOptions, (err, server) => {
            if (err ||
                (operation.hasAspect(operation_1.Aspect.READ_OPERATION) && !supportsRetryableReads(server)) ||
                (operation.hasAspect(operation_1.Aspect.WRITE_OPERATION) && !supportsRetryableWrites(server))) {
                callback(err);
                return;
            }
            operation.execute(server, session, callback);
        });
    }
    if (readPreference &&
        !readPreference.equals(read_preference_1.ReadPreference.primary) &&
        session &&
        session.inTransaction()) {
        callback(new error_1.MongoDriverError(`Read preference in a transaction must be primary, not: ${readPreference.mode}`));
        return;
    }
    // select a server, and execute the operation against it
    topology.selectServer(readPreference, serverSelectionOptions, (err, server) => {
        if (err) {
            callback(err);
            return;
        }
        if (session && operation.hasAspect(operation_1.Aspect.RETRYABLE)) {
            const willRetryRead = topology.s.options.retryReads !== false &&
                !inTransaction &&
                supportsRetryableReads(server) &&
                operation.canRetryRead;
            const willRetryWrite = topology.s.options.retryWrites === true &&
                !inTransaction &&
                supportsRetryableWrites(server) &&
                operation.canRetryWrite;
            const hasReadAspect = operation.hasAspect(operation_1.Aspect.READ_OPERATION);
            const hasWriteAspect = operation.hasAspect(operation_1.Aspect.WRITE_OPERATION);
            if ((hasReadAspect && willRetryRead) || (hasWriteAspect && willRetryWrite)) {
                if (hasWriteAspect && willRetryWrite) {
                    operation.options.willRetryWrite = true;
                    session.incrementTransactionNumber();
                }
                operation.execute(server, session, callbackWithRetry);
                return;
            }
        }
        operation.execute(server, session, callback);
    });
}
function shouldRetryWrite(err) {
    return err instanceof error_1.MongoError && err.hasErrorLabel('RetryableWriteError');
}
function supportsRetryableWrites(server) {
    return (server.description.maxWireVersion >= 6 &&
        server.description.logicalSessionTimeoutMinutes &&
        server.description.type !== common_1.ServerType.Standalone);
}
//# sourceMappingURL=execute_operation.js.map