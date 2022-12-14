"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EstimatedDocumentCountOperation = void 0;
const operation_1 = require("./operation");
const command_1 = require("./command");
const utils_1 = require("../utils");
/** @internal */
class EstimatedDocumentCountOperation extends command_1.CommandOperation {
    constructor(collection, options = {}) {
        super(collection, options);
        this.options = options;
        this.collectionName = collection.collectionName;
    }
    execute(server, session, callback) {
        if (utils_1.maxWireVersion(server) < 12) {
            return this.executeLegacy(server, session, callback);
        }
        const pipeline = [{ $collStats: { count: {} } }, { $group: { _id: 1, n: { $sum: '$count' } } }];
        const cmd = { aggregate: this.collectionName, pipeline, cursor: {} };
        if (typeof this.options.maxTimeMS === 'number') {
            cmd.maxTimeMS = this.options.maxTimeMS;
        }
        super.executeCommand(server, session, cmd, (err, response) => {
            var _a, _b;
            if (err && err.code !== 26) {
                callback(err);
                return;
            }
            callback(undefined, ((_b = (_a = response === null || response === void 0 ? void 0 : response.cursor) === null || _a === void 0 ? void 0 : _a.firstBatch[0]) === null || _b === void 0 ? void 0 : _b.n) || 0);
        });
    }
    executeLegacy(server, session, callback) {
        const cmd = { count: this.collectionName };
        if (typeof this.options.maxTimeMS === 'number') {
            cmd.maxTimeMS = this.options.maxTimeMS;
        }
        super.executeCommand(server, session, cmd, (err, response) => {
            if (err) {
                callback(err);
                return;
            }
            callback(undefined, response.n || 0);
        });
    }
}
exports.EstimatedDocumentCountOperation = EstimatedDocumentCountOperation;
operation_1.defineAspects(EstimatedDocumentCountOperation, [operation_1.Aspect.READ_OPERATION, operation_1.Aspect.RETRYABLE]);
//# sourceMappingURL=estimated_document_count.js.map