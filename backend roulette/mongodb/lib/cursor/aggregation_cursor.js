"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AggregationCursor = void 0;
const aggregate_1 = require("../operations/aggregate");
const abstract_cursor_1 = require("./abstract_cursor");
const execute_operation_1 = require("../operations/execute_operation");
const utils_1 = require("../utils");
/** @internal */
const kParent = Symbol('parent');
/** @internal */
const kPipeline = Symbol('pipeline');
/** @internal */
const kOptions = Symbol('options');
/**
 * The **AggregationCursor** class is an internal class that embodies an aggregation cursor on MongoDB
 * allowing for iteration over the results returned from the underlying query. It supports
 * one by one document iteration, conversion to an array or can be iterated as a Node 4.X
 * or higher stream
 * @public
 */
class AggregationCursor extends abstract_cursor_1.AbstractCursor {
    /** @internal */
    constructor(parent, topology, namespace, pipeline = [], options = {}) {
        super(topology, namespace, options);
        this[kParent] = parent;
        this[kPipeline] = pipeline;
        this[kOptions] = options;
    }
    get pipeline() {
        return this[kPipeline];
    }
    clone() {
        const clonedOptions = utils_1.mergeOptions({}, this[kOptions]);
        delete clonedOptions.session;
        return new AggregationCursor(this[kParent], this.topology, this.namespace, this[kPipeline], {
            ...clonedOptions
        });
    }
    map(transform) {
        return super.map(transform);
    }
    /** @internal */
    _initialize(session, callback) {
        const aggregateOperation = new aggregate_1.AggregateOperation(this[kParent], this[kPipeline], {
            ...this[kOptions],
            ...this.cursorOptions,
            session
        });
        execute_operation_1.executeOperation(this.topology, aggregateOperation, (err, response) => {
            if (err || response == null)
                return callback(err);
            // TODO: NODE-2882
            callback(undefined, { server: aggregateOperation.server, session, response });
        });
    }
    explain(verbosity, callback) {
        if (typeof verbosity === 'function')
            (callback = verbosity), (verbosity = true);
        if (verbosity === undefined)
            verbosity = true;
        return execute_operation_1.executeOperation(this.topology, new aggregate_1.AggregateOperation(this[kParent], this[kPipeline], {
            ...this[kOptions],
            ...this.cursorOptions,
            explain: verbosity
        }), callback);
    }
    group($group) {
        abstract_cursor_1.assertUninitialized(this);
        this[kPipeline].push({ $group });
        return this;
    }
    /** Add a limit stage to the aggregation pipeline */
    limit($limit) {
        abstract_cursor_1.assertUninitialized(this);
        this[kPipeline].push({ $limit });
        return this;
    }
    /** Add a match stage to the aggregation pipeline */
    match($match) {
        abstract_cursor_1.assertUninitialized(this);
        this[kPipeline].push({ $match });
        return this;
    }
    /** Add a out stage to the aggregation pipeline */
    out($out) {
        abstract_cursor_1.assertUninitialized(this);
        this[kPipeline].push({ $out });
        return this;
    }
    project($project) {
        abstract_cursor_1.assertUninitialized(this);
        this[kPipeline].push({ $project });
        return this;
    }
    /** Add a lookup stage to the aggregation pipeline */
    lookup($lookup) {
        abstract_cursor_1.assertUninitialized(this);
        this[kPipeline].push({ $lookup });
        return this;
    }
    /** Add a redact stage to the aggregation pipeline */
    redact($redact) {
        abstract_cursor_1.assertUninitialized(this);
        this[kPipeline].push({ $redact });
        return this;
    }
    /** Add a skip stage to the aggregation pipeline */
    skip($skip) {
        abstract_cursor_1.assertUninitialized(this);
        this[kPipeline].push({ $skip });
        return this;
    }
    /** Add a sort stage to the aggregation pipeline */
    sort($sort) {
        abstract_cursor_1.assertUninitialized(this);
        this[kPipeline].push({ $sort });
        return this;
    }
    /** Add a unwind stage to the aggregation pipeline */
    unwind($unwind) {
        abstract_cursor_1.assertUninitialized(this);
        this[kPipeline].push({ $unwind });
        return this;
    }
    // deprecated methods
    /** @deprecated Add a geoNear stage to the aggregation pipeline */
    geoNear($geoNear) {
        abstract_cursor_1.assertUninitialized(this);
        this[kPipeline].push({ $geoNear });
        return this;
    }
}
exports.AggregationCursor = AggregationCursor;
//# sourceMappingURL=aggregation_cursor.js.map