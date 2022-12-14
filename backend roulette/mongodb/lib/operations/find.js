"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindOperation = void 0;
const operation_1 = require("./operation");
const utils_1 = require("../utils");
const error_1 = require("../error");
const command_1 = require("./command");
const sort_1 = require("../sort");
const shared_1 = require("../cmap/wire_protocol/shared");
const read_concern_1 = require("../read_concern");
const SUPPORTS_WRITE_CONCERN_AND_COLLATION = 5;
/** @internal */
class FindOperation extends command_1.CommandOperation {
    constructor(collection, ns, filter = {}, options = {}) {
        super(collection, options);
        this.options = options;
        this.ns = ns;
        if (typeof filter !== 'object' || Array.isArray(filter)) {
            throw new error_1.MongoDriverError('Query filter must be a plain object or ObjectId');
        }
        // If the filter is a buffer, validate that is a valid BSON document
        if (Buffer.isBuffer(filter)) {
            const objectSize = filter[0] | (filter[1] << 8) | (filter[2] << 16) | (filter[3] << 24);
            if (objectSize !== filter.length) {
                throw new error_1.MongoDriverError(`query filter raw message size does not match message header size [${filter.length}] != [${objectSize}]`);
            }
        }
        // special case passing in an ObjectId as a filter
        this.filter = filter != null && filter._bsontype === 'ObjectID' ? { _id: filter } : filter;
    }
    execute(server, session, callback) {
        this.server = server;
        const serverWireVersion = utils_1.maxWireVersion(server);
        const options = this.options;
        if (typeof options.allowDiskUse !== 'undefined' && serverWireVersion < 4) {
            callback(new error_1.MongoDriverError('The `allowDiskUse` option is not supported on MongoDB < 3.2'));
            return;
        }
        if (options.collation && serverWireVersion < SUPPORTS_WRITE_CONCERN_AND_COLLATION) {
            callback(new error_1.MongoDriverError(`Server ${server.name}, which reports wire version ${serverWireVersion}, does not support collation`));
            return;
        }
        if (serverWireVersion < 4) {
            if (this.readConcern && this.readConcern.level !== 'local') {
                callback(new error_1.MongoDriverError(`server find command does not support a readConcern level of ${this.readConcern.level}`));
                return;
            }
            const findCommand = makeLegacyFindCommand(this.ns, this.filter, options);
            if (shared_1.isSharded(server) && this.readPreference) {
                findCommand.$readPreference = this.readPreference.toJSON();
            }
            server.query(this.ns, findCommand, {
                ...this.options,
                ...this.bsonOptions,
                documentsReturnedIn: 'firstBatch',
                readPreference: this.readPreference
            }, callback);
            return;
        }
        let findCommand = makeFindCommand(this.ns, this.filter, options);
        if (this.explain) {
            findCommand = utils_1.decorateWithExplain(findCommand, this.explain);
        }
        server.command(this.ns, findCommand, {
            fullResult: !!this.fullResponse,
            ...this.options,
            ...this.bsonOptions,
            documentsReturnedIn: 'firstBatch',
            session
        }, callback);
    }
}
exports.FindOperation = FindOperation;
function makeFindCommand(ns, filter, options) {
    const findCommand = {
        find: ns.collection,
        filter
    };
    if (options.sort) {
        findCommand.sort = sort_1.formatSort(options.sort);
    }
    if (options.projection) {
        let projection = options.projection;
        if (projection && Array.isArray(projection)) {
            projection = projection.length
                ? projection.reduce((result, field) => {
                    result[field] = 1;
                    return result;
                }, {})
                : { _id: 1 };
        }
        findCommand.projection = projection;
    }
    if (options.hint) {
        findCommand.hint = utils_1.normalizeHintField(options.hint);
    }
    if (typeof options.skip === 'number') {
        findCommand.skip = options.skip;
    }
    if (typeof options.limit === 'number') {
        if (options.limit < 0) {
            findCommand.limit = -options.limit;
            findCommand.singleBatch = true;
        }
        else {
            findCommand.limit = options.limit;
        }
    }
    if (typeof options.batchSize === 'number') {
        if (options.batchSize < 0) {
            if (options.limit &&
                options.limit !== 0 &&
                Math.abs(options.batchSize) < Math.abs(options.limit)) {
                findCommand.limit = -options.batchSize;
            }
            findCommand.singleBatch = true;
        }
        else {
            findCommand.batchSize = options.batchSize;
        }
    }
    if (typeof options.singleBatch === 'boolean') {
        findCommand.singleBatch = options.singleBatch;
    }
    if (options.comment) {
        findCommand.comment = options.comment;
    }
    if (typeof options.maxTimeMS === 'number') {
        findCommand.maxTimeMS = options.maxTimeMS;
    }
    const readConcern = read_concern_1.ReadConcern.fromOptions(options);
    if (readConcern) {
        findCommand.readConcern = readConcern.toJSON();
    }
    if (options.max) {
        findCommand.max = options.max;
    }
    if (options.min) {
        findCommand.min = options.min;
    }
    if (typeof options.returnKey === 'boolean') {
        findCommand.returnKey = options.returnKey;
    }
    if (typeof options.showRecordId === 'boolean') {
        findCommand.showRecordId = options.showRecordId;
    }
    if (typeof options.tailable === 'boolean') {
        findCommand.tailable = options.tailable;
    }
    if (typeof options.timeout === 'boolean') {
        findCommand.noCursorTimeout = !options.timeout;
    }
    else if (typeof options.noCursorTimeout === 'boolean') {
        findCommand.noCursorTimeout = options.noCursorTimeout;
    }
    if (typeof options.awaitData === 'boolean') {
        findCommand.awaitData = options.awaitData;
    }
    if (typeof options.allowPartialResults === 'boolean') {
        findCommand.allowPartialResults = options.allowPartialResults;
    }
    if (options.collation) {
        findCommand.collation = options.collation;
    }
    if (typeof options.allowDiskUse === 'boolean') {
        findCommand.allowDiskUse = options.allowDiskUse;
    }
    if (options.let) {
        findCommand.let = options.let;
    }
    return findCommand;
}
function makeLegacyFindCommand(ns, filter, options) {
    const findCommand = {
        $query: filter
    };
    if (options.sort) {
        findCommand.$orderby = sort_1.formatSort(options.sort);
    }
    if (options.hint) {
        findCommand.$hint = utils_1.normalizeHintField(options.hint);
    }
    if (typeof options.returnKey === 'boolean') {
        findCommand.$returnKey = options.returnKey;
    }
    if (options.max) {
        findCommand.$max = options.max;
    }
    if (options.min) {
        findCommand.$min = options.min;
    }
    if (typeof options.showRecordId === 'boolean') {
        findCommand.$showDiskLoc = options.showRecordId;
    }
    if (options.comment) {
        findCommand.$comment = options.comment;
    }
    if (typeof options.maxTimeMS === 'number') {
        findCommand.$maxTimeMS = options.maxTimeMS;
    }
    if (typeof options.explain !== 'undefined') {
        findCommand.$explain = true;
    }
    return findCommand;
}
operation_1.defineAspects(FindOperation, [operation_1.Aspect.READ_OPERATION, operation_1.Aspect.RETRYABLE, operation_1.Aspect.EXPLAINABLE]);
//# sourceMappingURL=find.js.map