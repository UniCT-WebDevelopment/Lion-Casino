"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connect = exports.MONGO_CLIENT_EVENTS = void 0;
const error_1 = require("../error");
const topology_1 = require("../sdam/topology");
const connection_string_1 = require("../connection_string");
const connection_pool_1 = require("../cmap/connection_pool");
const connection_1 = require("../cmap/connection");
const server_1 = require("../sdam/server");
/** @public */
exports.MONGO_CLIENT_EVENTS = [
    ...connection_pool_1.CMAP_EVENTS,
    ...connection_1.APM_EVENTS,
    ...topology_1.TOPOLOGY_EVENTS,
    ...server_1.HEARTBEAT_EVENTS
];
function connect(mongoClient, options, callback) {
    if (!callback) {
        throw new error_1.MongoDriverError('no callback function provided');
    }
    // If a connection already been established, we can terminate early
    if (mongoClient.topology && mongoClient.topology.isConnected()) {
        return callback(undefined, mongoClient);
    }
    const logger = mongoClient.logger;
    const connectCallback = err => {
        const warningMessage = 'seed list contains no mongos proxies, replicaset connections requires ' +
            'the parameter replicaSet to be supplied in the URI or options object, ' +
            'mongodb://server:port/db?replicaSet=name';
        if (err && err.message === 'no mongos proxies found in seed list') {
            if (logger.isWarn()) {
                logger.warn(warningMessage);
            }
            // Return a more specific error message for MongoClient.connect
            return callback(new error_1.MongoDriverError(warningMessage));
        }
        callback(err, mongoClient);
    };
    if (typeof options.srvHost === 'string') {
        return connection_string_1.resolveSRVRecord(options, (err, hosts) => {
            if (err || !hosts)
                return callback(err);
            for (const [index, host] of hosts.entries()) {
                options.hosts[index] = host;
            }
            return createTopology(mongoClient, options, connectCallback);
        });
    }
    return createTopology(mongoClient, options, connectCallback);
}
exports.connect = connect;
function createTopology(mongoClient, options, callback) {
    // Create the topology
    const topology = new topology_1.Topology(options.hosts, options);
    // Events can be emitted before initialization is complete so we have to
    // save the reference to the topology on the client ASAP if the event handlers need to access it
    mongoClient.topology = topology;
    topology.once(topology_1.Topology.OPEN, () => mongoClient.emit('open', mongoClient));
    for (const event of exports.MONGO_CLIENT_EVENTS) {
        topology.on(event, (...args) => mongoClient.emit(event, ...args));
    }
    // initialize CSFLE if requested
    if (mongoClient.autoEncrypter) {
        mongoClient.autoEncrypter.init(err => {
            if (err) {
                return callback(err);
            }
            topology.connect(options, err => {
                if (err) {
                    topology.close({ force: true });
                    return callback(err);
                }
                options.encrypter.connectInternalClient(error => {
                    if (error)
                        return callback(error);
                    callback(undefined, topology);
                });
            });
        });
        return;
    }
    // otherwise connect normally
    topology.connect(options, err => {
        if (err) {
            topology.close({ force: true });
            return callback(err);
        }
        callback(undefined, topology);
        return;
    });
}
//# sourceMappingURL=connect.js.map