"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandFailedEvent = exports.CommandSucceededEvent = exports.CommandStartedEvent = void 0;
const commands_1 = require("./commands");
const utils_1 = require("../utils");
/**
 * An event indicating the start of a given
 * @public
 * @category Event
 */
class CommandStartedEvent {
    /**
     * Create a started event
     *
     * @internal
     * @param pool - the pool that originated the command
     * @param command - the command
     */
    constructor(pool, command) {
        const cmd = extractCommand(command);
        const commandName = extractCommandName(cmd);
        const { address, connectionId } = extractConnectionDetails(pool);
        // TODO: remove in major revision, this is not spec behavior
        if (SENSITIVE_COMMANDS.has(commandName)) {
            this.commandObj = {};
            this.commandObj[commandName] = true;
        }
        this.address = address;
        this.connectionId = connectionId;
        this.requestId = command.requestId;
        this.databaseName = databaseName(command);
        this.commandName = commandName;
        this.command = maybeRedact(commandName, cmd, cmd);
    }
}
exports.CommandStartedEvent = CommandStartedEvent;
/**
 * An event indicating the success of a given command
 * @public
 * @category Event
 */
class CommandSucceededEvent {
    /**
     * Create a succeeded event
     *
     * @internal
     * @param pool - the pool that originated the command
     * @param command - the command
     * @param reply - the reply for this command from the server
     * @param started - a high resolution tuple timestamp of when the command was first sent, to calculate duration
     */
    constructor(pool, command, reply, started) {
        const cmd = extractCommand(command);
        const commandName = extractCommandName(cmd);
        const { address, connectionId } = extractConnectionDetails(pool);
        this.address = address;
        this.connectionId = connectionId;
        this.requestId = command.requestId;
        this.commandName = commandName;
        this.duration = utils_1.calculateDurationInMs(started);
        this.reply = maybeRedact(commandName, cmd, extractReply(command, reply));
    }
}
exports.CommandSucceededEvent = CommandSucceededEvent;
/**
 * An event indicating the failure of a given command
 * @public
 * @category Event
 */
class CommandFailedEvent {
    /**
     * Create a failure event
     *
     * @internal
     * @param pool - the pool that originated the command
     * @param command - the command
     * @param error - the generated error or a server error response
     * @param started - a high resolution tuple timestamp of when the command was first sent, to calculate duration
     */
    constructor(pool, command, error, started) {
        const cmd = extractCommand(command);
        const commandName = extractCommandName(cmd);
        const { address, connectionId } = extractConnectionDetails(pool);
        this.address = address;
        this.connectionId = connectionId;
        this.requestId = command.requestId;
        this.commandName = commandName;
        this.duration = utils_1.calculateDurationInMs(started);
        this.failure = maybeRedact(commandName, cmd, error);
    }
}
exports.CommandFailedEvent = CommandFailedEvent;
/** Commands that we want to redact because of the sensitive nature of their contents */
const SENSITIVE_COMMANDS = new Set([
    'authenticate',
    'saslStart',
    'saslContinue',
    'getnonce',
    'createUser',
    'updateUser',
    'copydbgetnonce',
    'copydbsaslstart',
    'copydb'
]);
const HELLO_COMMANDS = new Set(['hello', 'ismaster', 'isMaster']);
// helper methods
const extractCommandName = (commandDoc) => Object.keys(commandDoc)[0];
const namespace = (command) => command.ns;
const databaseName = (command) => command.ns.split('.')[0];
const collectionName = (command) => command.ns.split('.')[1];
const maybeRedact = (commandName, commandDoc, result) => SENSITIVE_COMMANDS.has(commandName) ||
    (HELLO_COMMANDS.has(commandName) && commandDoc.speculativeAuthenticate)
    ? {}
    : result;
const LEGACY_FIND_QUERY_MAP = {
    $query: 'filter',
    $orderby: 'sort',
    $hint: 'hint',
    $comment: 'comment',
    $maxScan: 'maxScan',
    $max: 'max',
    $min: 'min',
    $returnKey: 'returnKey',
    $showDiskLoc: 'showRecordId',
    $maxTimeMS: 'maxTimeMS',
    $snapshot: 'snapshot'
};
const LEGACY_FIND_OPTIONS_MAP = {
    numberToSkip: 'skip',
    numberToReturn: 'batchSize',
    returnFieldSelector: 'projection'
};
const OP_QUERY_KEYS = [
    'tailable',
    'oplogReplay',
    'noCursorTimeout',
    'awaitData',
    'partial',
    'exhaust'
];
/** Extract the actual command from the query, possibly up-converting if it's a legacy format */
function extractCommand(command) {
    var _a;
    if (command instanceof commands_1.GetMore) {
        return {
            getMore: utils_1.deepCopy(command.cursorId),
            collection: collectionName(command),
            batchSize: command.numberToReturn
        };
    }
    if (command instanceof commands_1.KillCursor) {
        return {
            killCursors: collectionName(command),
            cursors: utils_1.deepCopy(command.cursorIds)
        };
    }
    if (command instanceof commands_1.Msg) {
        return utils_1.deepCopy(command.command);
    }
    if ((_a = command.query) === null || _a === void 0 ? void 0 : _a.$query) {
        let result;
        if (command.ns === 'admin.$cmd') {
            // up-convert legacy command
            result = Object.assign({}, command.query.$query);
        }
        else {
            // up-convert legacy find command
            result = { find: collectionName(command) };
            Object.keys(LEGACY_FIND_QUERY_MAP).forEach(key => {
                if (typeof command.query[key] !== 'undefined') {
                    result[LEGACY_FIND_QUERY_MAP[key]] = utils_1.deepCopy(command.query[key]);
                }
            });
        }
        Object.keys(LEGACY_FIND_OPTIONS_MAP).forEach(key => {
            const legacyKey = key;
            if (typeof command[legacyKey] !== 'undefined') {
                result[LEGACY_FIND_OPTIONS_MAP[legacyKey]] = utils_1.deepCopy(command[legacyKey]);
            }
        });
        OP_QUERY_KEYS.forEach(key => {
            const opKey = key;
            if (command[opKey]) {
                result[opKey] = command[opKey];
            }
        });
        if (typeof command.pre32Limit !== 'undefined') {
            result.limit = command.pre32Limit;
        }
        if (command.query.$explain) {
            return { explain: result };
        }
        return result;
    }
    const clonedQuery = {};
    const clonedCommand = {};
    if (command.query) {
        for (const k in command.query) {
            clonedQuery[k] = utils_1.deepCopy(command.query[k]);
        }
        clonedCommand.query = clonedQuery;
    }
    for (const k in command) {
        if (k === 'query')
            continue;
        clonedCommand[k] = utils_1.deepCopy(command[k]);
    }
    return command.query ? clonedQuery : clonedCommand;
}
function extractReply(command, reply) {
    if (command instanceof commands_1.KillCursor) {
        return {
            ok: 1,
            cursorsUnknown: command.cursorIds
        };
    }
    if (!reply) {
        return reply;
    }
    if (command instanceof commands_1.GetMore) {
        return {
            ok: 1,
            cursor: {
                id: utils_1.deepCopy(reply.cursorId),
                ns: namespace(command),
                nextBatch: utils_1.deepCopy(reply.documents)
            }
        };
    }
    if (command instanceof commands_1.Msg) {
        return utils_1.deepCopy(reply.result ? reply.result : reply);
    }
    // is this a legacy find command?
    if (command.query && typeof command.query.$query !== 'undefined') {
        return {
            ok: 1,
            cursor: {
                id: utils_1.deepCopy(reply.cursorId),
                ns: namespace(command),
                firstBatch: utils_1.deepCopy(reply.documents)
            }
        };
    }
    return utils_1.deepCopy(reply.result ? reply.result : reply);
}
function extractConnectionDetails(connection) {
    let connectionId;
    if ('id' in connection) {
        connectionId = connection.id;
    }
    return {
        address: connection.address,
        connectionId
    };
}
//# sourceMappingURL=command_monitoring_events.js.map