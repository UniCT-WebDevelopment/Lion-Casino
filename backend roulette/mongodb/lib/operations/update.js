"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeUpdateStatement = exports.ReplaceOneOperation = exports.UpdateManyOperation = exports.UpdateOneOperation = exports.UpdateOperation = void 0;
const operation_1 = require("./operation");
const utils_1 = require("../utils");
const command_1 = require("./command");
const error_1 = require("../error");
/** @internal */
class UpdateOperation extends command_1.CommandOperation {
    constructor(ns, statements, options) {
        super(undefined, options);
        this.options = options;
        this.ns = ns;
        this.statements = statements;
    }
    get canRetryWrite() {
        if (super.canRetryWrite === false) {
            return false;
        }
        return this.statements.every(op => op.multi == null || op.multi === false);
    }
    execute(server, session, callback) {
        var _a;
        const options = (_a = this.options) !== null && _a !== void 0 ? _a : {};
        const ordered = typeof options.ordered === 'boolean' ? options.ordered : true;
        const command = {
            update: this.ns.collection,
            updates: this.statements,
            ordered
        };
        if (typeof options.bypassDocumentValidation === 'boolean') {
            command.bypassDocumentValidation = options.bypassDocumentValidation;
        }
        if (options.let) {
            command.let = options.let;
        }
        const statementWithCollation = this.statements.find(statement => !!statement.collation);
        if (utils_1.collationNotSupported(server, options) ||
            (statementWithCollation && utils_1.collationNotSupported(server, statementWithCollation))) {
            callback(new error_1.MongoDriverError(`server ${server.name} does not support collation`));
            return;
        }
        const unacknowledgedWrite = this.writeConcern && this.writeConcern.w === 0;
        if (unacknowledgedWrite || utils_1.maxWireVersion(server) < 5) {
            if (this.statements.find((o) => o.hint)) {
                callback(new error_1.MongoDriverError(`servers < 3.4 do not support hint on update`));
                return;
            }
        }
        if (this.explain && utils_1.maxWireVersion(server) < 3) {
            callback(new error_1.MongoDriverError(`server ${server.name} does not support explain on update`));
            return;
        }
        if (this.statements.some(statement => !!statement.arrayFilters) && utils_1.maxWireVersion(server) < 6) {
            callback(new error_1.MongoDriverError('arrayFilters are only supported on MongoDB 3.6+'));
            return;
        }
        super.executeCommand(server, session, command, callback);
    }
}
exports.UpdateOperation = UpdateOperation;
/** @internal */
class UpdateOneOperation extends UpdateOperation {
    constructor(collection, filter, update, options) {
        super(collection.s.namespace, [makeUpdateStatement(filter, update, { ...options, multi: false })], options);
        if (!utils_1.hasAtomicOperators(update)) {
            throw new error_1.MongoDriverError('Update document requires atomic operators');
        }
    }
    execute(server, session, callback) {
        super.execute(server, session, (err, res) => {
            var _a, _b;
            if (err || !res)
                return callback(err);
            if (typeof this.explain !== 'undefined')
                return callback(undefined, res);
            if (res.code)
                return callback(new error_1.MongoServerError(res));
            if (res.writeErrors)
                return callback(new error_1.MongoServerError(res.writeErrors[0]));
            callback(undefined, {
                acknowledged: (_b = ((_a = this.writeConcern) === null || _a === void 0 ? void 0 : _a.w) !== 0) !== null && _b !== void 0 ? _b : true,
                modifiedCount: res.nModified != null ? res.nModified : res.n,
                upsertedId: Array.isArray(res.upserted) && res.upserted.length > 0 ? res.upserted[0]._id : null,
                upsertedCount: Array.isArray(res.upserted) && res.upserted.length ? res.upserted.length : 0,
                matchedCount: Array.isArray(res.upserted) && res.upserted.length > 0 ? 0 : res.n
            });
        });
    }
}
exports.UpdateOneOperation = UpdateOneOperation;
/** @internal */
class UpdateManyOperation extends UpdateOperation {
    constructor(collection, filter, update, options) {
        super(collection.s.namespace, [makeUpdateStatement(filter, update, { ...options, multi: true })], options);
        if (!utils_1.hasAtomicOperators(update)) {
            throw new error_1.MongoDriverError('Update document requires atomic operators');
        }
    }
    execute(server, session, callback) {
        super.execute(server, session, (err, res) => {
            var _a, _b;
            if (err || !res)
                return callback(err);
            if (typeof this.explain !== 'undefined')
                return callback(undefined, res);
            if (res.code)
                return callback(new error_1.MongoServerError(res));
            if (res.writeErrors)
                return callback(new error_1.MongoServerError(res.writeErrors[0]));
            callback(undefined, {
                acknowledged: (_b = ((_a = this.writeConcern) === null || _a === void 0 ? void 0 : _a.w) !== 0) !== null && _b !== void 0 ? _b : true,
                modifiedCount: res.nModified != null ? res.nModified : res.n,
                upsertedId: Array.isArray(res.upserted) && res.upserted.length > 0 ? res.upserted[0]._id : null,
                upsertedCount: Array.isArray(res.upserted) && res.upserted.length ? res.upserted.length : 0,
                matchedCount: Array.isArray(res.upserted) && res.upserted.length > 0 ? 0 : res.n
            });
        });
    }
}
exports.UpdateManyOperation = UpdateManyOperation;
/** @internal */
class ReplaceOneOperation extends UpdateOperation {
    constructor(collection, filter, replacement, options) {
        super(collection.s.namespace, [makeUpdateStatement(filter, replacement, { ...options, multi: false })], options);
        if (utils_1.hasAtomicOperators(replacement)) {
            throw new error_1.MongoDriverError('Replacement document must not contain atomic operators');
        }
    }
    execute(server, session, callback) {
        super.execute(server, session, (err, res) => {
            var _a, _b;
            if (err || !res)
                return callback(err);
            if (typeof this.explain !== 'undefined')
                return callback(undefined, res);
            if (res.code)
                return callback(new error_1.MongoServerError(res));
            if (res.writeErrors)
                return callback(new error_1.MongoServerError(res.writeErrors[0]));
            callback(undefined, {
                acknowledged: (_b = ((_a = this.writeConcern) === null || _a === void 0 ? void 0 : _a.w) !== 0) !== null && _b !== void 0 ? _b : true,
                modifiedCount: res.nModified != null ? res.nModified : res.n,
                upsertedId: Array.isArray(res.upserted) && res.upserted.length > 0 ? res.upserted[0]._id : null,
                upsertedCount: Array.isArray(res.upserted) && res.upserted.length ? res.upserted.length : 0,
                matchedCount: Array.isArray(res.upserted) && res.upserted.length > 0 ? 0 : res.n
            });
        });
    }
}
exports.ReplaceOneOperation = ReplaceOneOperation;
function makeUpdateStatement(filter, update, options) {
    if (filter == null || typeof filter !== 'object') {
        throw new error_1.MongoDriverError('selector must be a valid JavaScript object');
    }
    if (update == null || typeof update !== 'object') {
        throw new error_1.MongoDriverError('document must be a valid JavaScript object');
    }
    const op = { q: filter, u: update };
    if (typeof options.upsert === 'boolean') {
        op.upsert = options.upsert;
    }
    if (options.multi) {
        op.multi = options.multi;
    }
    if (options.hint) {
        op.hint = options.hint;
    }
    if (options.arrayFilters) {
        op.arrayFilters = options.arrayFilters;
    }
    if (options.collation) {
        op.collation = options.collation;
    }
    return op;
}
exports.makeUpdateStatement = makeUpdateStatement;
operation_1.defineAspects(UpdateOperation, [operation_1.Aspect.RETRYABLE, operation_1.Aspect.WRITE_OPERATION, operation_1.Aspect.SKIP_COLLATION]);
operation_1.defineAspects(UpdateOneOperation, [
    operation_1.Aspect.RETRYABLE,
    operation_1.Aspect.WRITE_OPERATION,
    operation_1.Aspect.EXPLAINABLE,
    operation_1.Aspect.SKIP_COLLATION
]);
operation_1.defineAspects(UpdateManyOperation, [
    operation_1.Aspect.WRITE_OPERATION,
    operation_1.Aspect.EXPLAINABLE,
    operation_1.Aspect.SKIP_COLLATION
]);
operation_1.defineAspects(ReplaceOneOperation, [
    operation_1.Aspect.RETRYABLE,
    operation_1.Aspect.WRITE_OPERATION,
    operation_1.Aspect.SKIP_COLLATION
]);
//# sourceMappingURL=update.js.map