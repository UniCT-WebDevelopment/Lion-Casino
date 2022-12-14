"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DistinctOperation = void 0;
const operation_1 = require("./operation");
const command_1 = require("./command");
const utils_1 = require("../utils");
const error_1 = require("../error");
/**
 * Return a list of distinct values for the given key across a collection.
 * @internal
 */
class DistinctOperation extends command_1.CommandOperation {
    /**
     * Construct a Distinct operation.
     *
     * @param collection - Collection instance.
     * @param key - Field of the document to find distinct values for.
     * @param query - The query for filtering the set of documents to which we apply the distinct filter.
     * @param options - Optional settings. See Collection.prototype.distinct for a list of options.
     */
    constructor(collection, key, query, options) {
        super(collection, options);
        this.options = options !== null && options !== void 0 ? options : {};
        this.collection = collection;
        this.key = key;
        this.query = query;
    }
    execute(server, session, callback) {
        const coll = this.collection;
        const key = this.key;
        const query = this.query;
        const options = this.options;
        // Distinct command
        const cmd = {
            distinct: coll.collectionName,
            key: key,
            query: query
        };
        // Add maxTimeMS if defined
        if (typeof options.maxTimeMS === 'number') {
            cmd.maxTimeMS = options.maxTimeMS;
        }
        // Do we have a readConcern specified
        utils_1.decorateWithReadConcern(cmd, coll, options);
        // Have we specified collation
        try {
            utils_1.decorateWithCollation(cmd, coll, options);
        }
        catch (err) {
            return callback(err);
        }
        if (this.explain && utils_1.maxWireVersion(server) < 4) {
            callback(new error_1.MongoDriverError(`server ${server.name} does not support explain on distinct`));
            return;
        }
        super.executeCommand(server, session, cmd, (err, result) => {
            if (err) {
                callback(err);
                return;
            }
            callback(undefined, this.options.fullResponse || this.explain ? result : result.values);
        });
    }
}
exports.DistinctOperation = DistinctOperation;
operation_1.defineAspects(DistinctOperation, [operation_1.Aspect.READ_OPERATION, operation_1.Aspect.RETRYABLE, operation_1.Aspect.EXPLAINABLE]);
//# sourceMappingURL=distinct.js.map