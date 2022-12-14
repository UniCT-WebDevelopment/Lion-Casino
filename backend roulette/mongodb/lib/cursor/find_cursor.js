"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindCursor = exports.FLAGS = void 0;
const error_1 = require("../error");
const count_1 = require("../operations/count");
const execute_operation_1 = require("../operations/execute_operation");
const find_1 = require("../operations/find");
const utils_1 = require("../utils");
const sort_1 = require("../sort");
const abstract_cursor_1 = require("./abstract_cursor");
/** @internal */
const kFilter = Symbol('filter');
/** @internal */
const kNumReturned = Symbol('numReturned');
/** @internal */
const kBuiltOptions = Symbol('builtOptions');
/** @public Flags allowed for cursor */
exports.FLAGS = [
    'tailable',
    'oplogReplay',
    'noCursorTimeout',
    'awaitData',
    'exhaust',
    'partial'
];
/** @public */
class FindCursor extends abstract_cursor_1.AbstractCursor {
    /** @internal */
    constructor(topology, namespace, filter, options = {}) {
        super(topology, namespace, options);
        this[kFilter] = filter || {};
        this[kBuiltOptions] = options;
        if (typeof options.sort !== 'undefined') {
            this[kBuiltOptions].sort = sort_1.formatSort(options.sort);
        }
    }
    clone() {
        const clonedOptions = utils_1.mergeOptions({}, this[kBuiltOptions]);
        delete clonedOptions.session;
        return new FindCursor(this.topology, this.namespace, this[kFilter], {
            ...clonedOptions
        });
    }
    map(transform) {
        return super.map(transform);
    }
    /** @internal */
    _initialize(session, callback) {
        const findOperation = new find_1.FindOperation(undefined, this.namespace, this[kFilter], {
            ...this[kBuiltOptions],
            ...this.cursorOptions,
            session
        });
        execute_operation_1.executeOperation(this.topology, findOperation, (err, response) => {
            if (err || response == null)
                return callback(err);
            // TODO: We only need this for legacy queries that do not support `limit`, maybe
            //       the value should only be saved in those cases.
            if (response.cursor) {
                this[kNumReturned] = response.cursor.firstBatch.length;
            }
            else {
                this[kNumReturned] = response.documents ? response.documents.length : 0;
            }
            // TODO: NODE-2882
            callback(undefined, { server: findOperation.server, session, response });
        });
    }
    /** @internal */
    _getMore(batchSize, callback) {
        // NOTE: this is to support client provided limits in pre-command servers
        const numReturned = this[kNumReturned];
        if (numReturned) {
            const limit = this[kBuiltOptions].limit;
            batchSize =
                limit && limit > 0 && numReturned + batchSize > limit ? limit - numReturned : batchSize;
            if (batchSize <= 0) {
                return this.close(callback);
            }
        }
        super._getMore(batchSize, (err, response) => {
            if (err)
                return callback(err);
            // TODO: wrap this in some logic to prevent it from happening if we don't need this support
            if (response) {
                this[kNumReturned] = this[kNumReturned] + response.cursor.nextBatch.length;
            }
            callback(undefined, response);
        });
    }
    count(options, callback) {
        if (typeof options === 'boolean') {
            throw new error_1.MongoDriverError('Invalid first parameter to count');
        }
        if (typeof options === 'function')
            (callback = options), (options = {});
        options = options !== null && options !== void 0 ? options : {};
        return execute_operation_1.executeOperation(this.topology, new count_1.CountOperation(this.namespace, this[kFilter], {
            ...this[kBuiltOptions],
            ...this.cursorOptions,
            ...options
        }), callback);
    }
    explain(verbosity, callback) {
        if (typeof verbosity === 'function')
            (callback = verbosity), (verbosity = true);
        if (verbosity === undefined)
            verbosity = true;
        return execute_operation_1.executeOperation(this.topology, new find_1.FindOperation(undefined, this.namespace, this[kFilter], {
            ...this[kBuiltOptions],
            ...this.cursorOptions,
            explain: verbosity
        }), callback);
    }
    /** Set the cursor query */
    filter(filter) {
        abstract_cursor_1.assertUninitialized(this);
        this[kFilter] = filter;
        return this;
    }
    /**
     * Set the cursor hint
     *
     * @param hint - If specified, then the query system will only consider plans using the hinted index.
     */
    hint(hint) {
        abstract_cursor_1.assertUninitialized(this);
        this[kBuiltOptions].hint = hint;
        return this;
    }
    /**
     * Set the cursor min
     *
     * @param min - Specify a $min value to specify the inclusive lower bound for a specific index in order to constrain the results of find(). The $min specifies the lower bound for all keys of a specific index in order.
     */
    min(min) {
        abstract_cursor_1.assertUninitialized(this);
        this[kBuiltOptions].min = min;
        return this;
    }
    /**
     * Set the cursor max
     *
     * @param max - Specify a $max value to specify the exclusive upper bound for a specific index in order to constrain the results of find(). The $max specifies the upper bound for all keys of a specific index in order.
     */
    max(max) {
        abstract_cursor_1.assertUninitialized(this);
        this[kBuiltOptions].max = max;
        return this;
    }
    /**
     * Set the cursor returnKey.
     * If set to true, modifies the cursor to only return the index field or fields for the results of the query, rather than documents.
     * If set to true and the query does not use an index to perform the read operation, the returned documents will not contain any fields.
     *
     * @param value - the returnKey value.
     */
    returnKey(value) {
        abstract_cursor_1.assertUninitialized(this);
        this[kBuiltOptions].returnKey = value;
        return this;
    }
    /**
     * Modifies the output of a query by adding a field $recordId to matching documents. $recordId is the internal key which uniquely identifies a document in a collection.
     *
     * @param value - The $showDiskLoc option has now been deprecated and replaced with the showRecordId field. $showDiskLoc will still be accepted for OP_QUERY stye find.
     */
    showRecordId(value) {
        abstract_cursor_1.assertUninitialized(this);
        this[kBuiltOptions].showRecordId = value;
        return this;
    }
    /**
     * Add a query modifier to the cursor query
     *
     * @param name - The query modifier (must start with $, such as $orderby etc)
     * @param value - The modifier value.
     */
    addQueryModifier(name, value) {
        abstract_cursor_1.assertUninitialized(this);
        if (name[0] !== '$') {
            throw new error_1.MongoDriverError(`${name} is not a valid query modifier`);
        }
        // Strip of the $
        const field = name.substr(1);
        // NOTE: consider some TS magic for this
        switch (field) {
            case 'comment':
                this[kBuiltOptions].comment = value;
                break;
            case 'explain':
                this[kBuiltOptions].explain = value;
                break;
            case 'hint':
                this[kBuiltOptions].hint = value;
                break;
            case 'max':
                this[kBuiltOptions].max = value;
                break;
            case 'maxTimeMS':
                this[kBuiltOptions].maxTimeMS = value;
                break;
            case 'min':
                this[kBuiltOptions].min = value;
                break;
            case 'orderby':
                this[kBuiltOptions].sort = sort_1.formatSort(value);
                break;
            case 'query':
                this[kFilter] = value;
                break;
            case 'returnKey':
                this[kBuiltOptions].returnKey = value;
                break;
            case 'showDiskLoc':
                this[kBuiltOptions].showRecordId = value;
                break;
            default:
                throw new error_1.MongoDriverError(`invalid query modifier: ${name}`);
        }
        return this;
    }
    /**
     * Add a comment to the cursor query allowing for tracking the comment in the log.
     *
     * @param value - The comment attached to this query.
     */
    comment(value) {
        abstract_cursor_1.assertUninitialized(this);
        this[kBuiltOptions].comment = value;
        return this;
    }
    /**
     * Set a maxAwaitTimeMS on a tailing cursor query to allow to customize the timeout value for the option awaitData (Only supported on MongoDB 3.2 or higher, ignored otherwise)
     *
     * @param value - Number of milliseconds to wait before aborting the tailed query.
     */
    maxAwaitTimeMS(value) {
        abstract_cursor_1.assertUninitialized(this);
        if (typeof value !== 'number') {
            throw new error_1.MongoDriverError('maxAwaitTimeMS must be a number');
        }
        this[kBuiltOptions].maxAwaitTimeMS = value;
        return this;
    }
    /**
     * Set a maxTimeMS on the cursor query, allowing for hard timeout limits on queries (Only supported on MongoDB 2.6 or higher)
     *
     * @param value - Number of milliseconds to wait before aborting the query.
     */
    maxTimeMS(value) {
        abstract_cursor_1.assertUninitialized(this);
        if (typeof value !== 'number') {
            throw new error_1.MongoDriverError('maxTimeMS must be a number');
        }
        this[kBuiltOptions].maxTimeMS = value;
        return this;
    }
    project(value) {
        abstract_cursor_1.assertUninitialized(this);
        this[kBuiltOptions].projection = value;
        return this;
    }
    /**
     * Sets the sort order of the cursor query.
     *
     * @param sort - The key or keys set for the sort.
     * @param direction - The direction of the sorting (1 or -1).
     */
    sort(sort, direction) {
        abstract_cursor_1.assertUninitialized(this);
        if (this[kBuiltOptions].tailable) {
            throw new error_1.MongoDriverError('Tailable cursor does not support sorting');
        }
        this[kBuiltOptions].sort = sort_1.formatSort(sort, direction);
        return this;
    }
    /**
     * Allows disk use for blocking sort operations exceeding 100MB memory. (MongoDB 3.2 or higher)
     *
     * @remarks
     * {@link https://docs.mongodb.com/manual/reference/command/find/#find-cmd-allowdiskuse | find command allowDiskUse documentation}
     */
    allowDiskUse() {
        abstract_cursor_1.assertUninitialized(this);
        if (!this[kBuiltOptions].sort) {
            throw new error_1.MongoDriverError('allowDiskUse requires a sort specification');
        }
        this[kBuiltOptions].allowDiskUse = true;
        return this;
    }
    /**
     * Set the collation options for the cursor.
     *
     * @param value - The cursor collation options (MongoDB 3.4 or higher) settings for update operation (see 3.4 documentation for available fields).
     */
    collation(value) {
        abstract_cursor_1.assertUninitialized(this);
        this[kBuiltOptions].collation = value;
        return this;
    }
    /**
     * Set the limit for the cursor.
     *
     * @param value - The limit for the cursor query.
     */
    limit(value) {
        abstract_cursor_1.assertUninitialized(this);
        if (this[kBuiltOptions].tailable) {
            throw new error_1.MongoDriverError('Tailable cursor does not support limit');
        }
        if (typeof value !== 'number') {
            throw new error_1.MongoDriverError('limit requires an integer');
        }
        this[kBuiltOptions].limit = value;
        return this;
    }
    /**
     * Set the skip for the cursor.
     *
     * @param value - The skip for the cursor query.
     */
    skip(value) {
        abstract_cursor_1.assertUninitialized(this);
        if (this[kBuiltOptions].tailable) {
            throw new error_1.MongoDriverError('Tailable cursor does not support skip');
        }
        if (typeof value !== 'number') {
            throw new error_1.MongoDriverError('skip requires an integer');
        }
        this[kBuiltOptions].skip = value;
        return this;
    }
}
exports.FindCursor = FindCursor;
//# sourceMappingURL=find_cursor.js.map