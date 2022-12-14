"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_OPTIONS = exports.OPTIONS = exports.parseOptions = exports.checkTLSOptions = exports.resolveSRVRecord = void 0;
const dns = require("dns");
const fs = require("fs");
const mongodb_connection_string_url_1 = require("mongodb-connection-string-url");
const url_1 = require("url");
const defaultAuthProviders_1 = require("./cmap/auth/defaultAuthProviders");
const read_preference_1 = require("./read_preference");
const read_concern_1 = require("./read_concern");
const write_concern_1 = require("./write_concern");
const error_1 = require("./error");
const utils_1 = require("./utils");
const mongo_client_1 = require("./mongo_client");
const mongo_credentials_1 = require("./cmap/auth/mongo_credentials");
const logger_1 = require("./logger");
const promise_provider_1 = require("./promise_provider");
const encrypter_1 = require("./encrypter");
/**
 * Determines whether a provided address matches the provided parent domain in order
 * to avoid certain attack vectors.
 *
 * @param srvAddress - The address to check against a domain
 * @param parentDomain - The domain to check the provided address against
 * @returns Whether the provided address matches the parent domain
 */
function matchesParentDomain(srvAddress, parentDomain) {
    const regex = /^.*?\./;
    const srv = `.${srvAddress.replace(regex, '')}`;
    const parent = `.${parentDomain.replace(regex, '')}`;
    return srv.endsWith(parent);
}
/**
 * Lookup a `mongodb+srv` connection string, combine the parts and reparse it as a normal
 * connection string.
 *
 * @param uri - The connection string to parse
 * @param options - Optional user provided connection string options
 */
function resolveSRVRecord(options, callback) {
    if (typeof options.srvHost !== 'string') {
        return callback(new error_1.MongoParseError('Cannot resolve empty srv string'));
    }
    if (options.srvHost.split('.').length < 3) {
        return callback(new error_1.MongoParseError('URI does not have hostname, domain name and tld'));
    }
    // Resolve the SRV record and use the result as the list of hosts to connect to.
    const lookupAddress = options.srvHost;
    dns.resolveSrv(`_mongodb._tcp.${lookupAddress}`, (err, addresses) => {
        if (err)
            return callback(err);
        if (addresses.length === 0) {
            return callback(new error_1.MongoParseError('No addresses found at host'));
        }
        for (const { name } of addresses) {
            if (!matchesParentDomain(name, lookupAddress)) {
                return callback(new error_1.MongoParseError('Server record does not share hostname with parent URI'));
            }
        }
        const hostAddresses = addresses.map(r => { var _a; return utils_1.HostAddress.fromString(`${r.name}:${(_a = r.port) !== null && _a !== void 0 ? _a : 27017}`); });
        // Resolve TXT record and add options from there if they exist.
        dns.resolveTxt(lookupAddress, (err, record) => {
            var _a, _b;
            if (err) {
                if (err.code !== 'ENODATA' && err.code !== 'ENOTFOUND') {
                    return callback(err);
                }
            }
            else {
                if (record.length > 1) {
                    return callback(new error_1.MongoParseError('Multiple text records not allowed'));
                }
                const txtRecordOptions = new url_1.URLSearchParams(record[0].join(''));
                const txtRecordOptionKeys = [...txtRecordOptions.keys()];
                if (txtRecordOptionKeys.some(key => key !== 'authSource' && key !== 'replicaSet')) {
                    return callback(new error_1.MongoParseError('Text record must only set `authSource` or `replicaSet`'));
                }
                const source = (_a = txtRecordOptions.get('authSource')) !== null && _a !== void 0 ? _a : undefined;
                const replicaSet = (_b = txtRecordOptions.get('replicaSet')) !== null && _b !== void 0 ? _b : undefined;
                if (source === '' || replicaSet === '') {
                    return callback(new error_1.MongoParseError('Cannot have empty URI params in DNS TXT Record'));
                }
                if (!options.userSpecifiedAuthSource && source) {
                    options.credentials = mongo_credentials_1.MongoCredentials.merge(options.credentials, { source });
                }
                if (!options.userSpecifiedReplicaSet && replicaSet) {
                    options.replicaSet = replicaSet;
                }
            }
            callback(undefined, hostAddresses);
        });
    });
}
exports.resolveSRVRecord = resolveSRVRecord;
/**
 * Checks if TLS options are valid
 *
 * @param options - The options used for options parsing
 * @throws MongoParseError if TLS options are invalid
 */
function checkTLSOptions(options) {
    if (!options)
        return;
    const check = (a, b) => {
        if (Reflect.has(options, a) && Reflect.has(options, b)) {
            throw new error_1.MongoParseError(`The '${a}' option cannot be used with '${b}'`);
        }
    };
    check('tlsInsecure', 'tlsAllowInvalidCertificates');
    check('tlsInsecure', 'tlsAllowInvalidHostnames');
    check('tlsInsecure', 'tlsDisableCertificateRevocationCheck');
    check('tlsInsecure', 'tlsDisableOCSPEndpointCheck');
    check('tlsAllowInvalidCertificates', 'tlsDisableCertificateRevocationCheck');
    check('tlsAllowInvalidCertificates', 'tlsDisableOCSPEndpointCheck');
    check('tlsDisableCertificateRevocationCheck', 'tlsDisableOCSPEndpointCheck');
}
exports.checkTLSOptions = checkTLSOptions;
const TRUTHS = new Set(['true', 't', '1', 'y', 'yes']);
const FALSEHOODS = new Set(['false', 'f', '0', 'n', 'no', '-1']);
function getBoolean(name, value) {
    if (typeof value === 'boolean')
        return value;
    const valueString = String(value).toLowerCase();
    if (TRUTHS.has(valueString))
        return true;
    if (FALSEHOODS.has(valueString))
        return false;
    throw new error_1.MongoParseError(`For ${name} Expected stringified boolean value, got: ${value}`);
}
function getInt(name, value) {
    if (typeof value === 'number')
        return Math.trunc(value);
    const parsedValue = Number.parseInt(String(value), 10);
    if (!Number.isNaN(parsedValue))
        return parsedValue;
    throw new error_1.MongoParseError(`Expected ${name} to be stringified int value, got: ${value}`);
}
function getUint(name, value) {
    const parsedValue = getInt(name, value);
    if (parsedValue < 0) {
        throw new error_1.MongoParseError(`${name} can only be a positive int value, got: ${value}`);
    }
    return parsedValue;
}
function toRecord(value) {
    const record = Object.create(null);
    const keyValuePairs = value.split(',');
    for (const keyValue of keyValuePairs) {
        const [key, value] = keyValue.split(':');
        if (typeof value === 'undefined') {
            throw new error_1.MongoParseError('Cannot have undefined values in key value pairs');
        }
        try {
            // try to get a boolean
            record[key] = getBoolean('', value);
        }
        catch {
            try {
                // try to get a number
                record[key] = getInt('', value);
            }
            catch {
                // keep value as a string
                record[key] = value;
            }
        }
    }
    return record;
}
class CaseInsensitiveMap extends Map {
    constructor(entries = []) {
        super(entries.map(([k, v]) => [k.toLowerCase(), v]));
    }
    has(k) {
        return super.has(k.toLowerCase());
    }
    get(k) {
        return super.get(k.toLowerCase());
    }
    set(k, v) {
        return super.set(k.toLowerCase(), v);
    }
    delete(k) {
        return super.delete(k.toLowerCase());
    }
}
function parseOptions(uri, mongoClient = undefined, options = {}) {
    var _a, _b;
    if (typeof mongoClient !== 'undefined' && !(mongoClient instanceof mongo_client_1.MongoClient)) {
        options = mongoClient;
        mongoClient = undefined;
    }
    const url = new mongodb_connection_string_url_1.default(uri);
    const { hosts, isSRV } = url;
    const mongoOptions = Object.create(null);
    mongoOptions.hosts = isSRV ? [] : hosts.map(utils_1.HostAddress.fromString);
    if (isSRV) {
        // SRV Record is resolved upon connecting
        mongoOptions.srvHost = hosts[0];
        if (!url.searchParams.has('tls') && !url.searchParams.has('ssl')) {
            options.tls = true;
        }
    }
    const urlOptions = new CaseInsensitiveMap();
    if (url.pathname !== '/' && url.pathname !== '') {
        const dbName = decodeURIComponent(url.pathname[0] === '/' ? url.pathname.slice(1) : url.pathname);
        if (dbName) {
            urlOptions.set('dbName', [dbName]);
        }
    }
    if (url.username !== '') {
        const auth = {
            username: decodeURIComponent(url.username)
        };
        if (typeof url.password === 'string') {
            auth.password = decodeURIComponent(url.password);
        }
        urlOptions.set('auth', [auth]);
    }
    for (const key of url.searchParams.keys()) {
        const values = [...url.searchParams.getAll(key)];
        if (values.includes('')) {
            throw new error_1.MongoParseError('URI cannot contain options with no value');
        }
        if (key.toLowerCase() === 'serverapi') {
            throw new error_1.MongoParseError('URI cannot contain `serverApi`, it can only be passed to the client');
        }
        if (key.toLowerCase() === 'authsource' && urlOptions.has('authSource')) {
            // If authSource is an explicit key in the urlOptions we need to remove the implicit dbName
            urlOptions.delete('authSource');
        }
        if (!urlOptions.has(key)) {
            urlOptions.set(key, values);
        }
    }
    const objectOptions = new CaseInsensitiveMap(Object.entries(options).filter(([, v]) => (v !== null && v !== void 0 ? v : null) !== null));
    const allOptions = new CaseInsensitiveMap();
    const allKeys = new Set([
        ...urlOptions.keys(),
        ...objectOptions.keys(),
        ...exports.DEFAULT_OPTIONS.keys()
    ]);
    for (const key of allKeys) {
        const values = [];
        if (objectOptions.has(key)) {
            values.push(objectOptions.get(key));
        }
        if (urlOptions.has(key)) {
            values.push(...urlOptions.get(key));
        }
        if (exports.DEFAULT_OPTIONS.has(key)) {
            values.push(exports.DEFAULT_OPTIONS.get(key));
        }
        allOptions.set(key, values);
    }
    const unsupportedOptions = utils_1.setDifference(allKeys, Array.from(Object.keys(exports.OPTIONS)).map(s => s.toLowerCase()));
    if (unsupportedOptions.size !== 0) {
        const optionWord = unsupportedOptions.size > 1 ? 'options' : 'option';
        const isOrAre = unsupportedOptions.size > 1 ? 'are' : 'is';
        throw new error_1.MongoParseError(`${optionWord} ${Array.from(unsupportedOptions).join(', ')} ${isOrAre} not supported`);
    }
    for (const [key, descriptor] of Object.entries(exports.OPTIONS)) {
        const values = allOptions.get(key);
        if (!values || values.length === 0)
            continue;
        setOption(mongoOptions, key, descriptor, values);
    }
    if (mongoOptions.credentials) {
        const isGssapi = mongoOptions.credentials.mechanism === defaultAuthProviders_1.AuthMechanism.MONGODB_GSSAPI;
        const isX509 = mongoOptions.credentials.mechanism === defaultAuthProviders_1.AuthMechanism.MONGODB_X509;
        const isAws = mongoOptions.credentials.mechanism === defaultAuthProviders_1.AuthMechanism.MONGODB_AWS;
        if ((isGssapi || isX509) &&
            allOptions.has('authSource') &&
            mongoOptions.credentials.source !== '$external') {
            // If authSource was explicitly given and its incorrect, we error
            throw new error_1.MongoParseError(`${mongoOptions.credentials} can only have authSource set to '$external'`);
        }
        if (!(isGssapi || isX509 || isAws) && mongoOptions.dbName && !allOptions.has('authSource')) {
            // inherit the dbName unless GSSAPI or X509, then silently ignore dbName
            // and there was no specific authSource given
            mongoOptions.credentials = mongo_credentials_1.MongoCredentials.merge(mongoOptions.credentials, {
                source: mongoOptions.dbName
            });
        }
        mongoOptions.credentials.validate();
    }
    if (!mongoOptions.dbName) {
        // dbName default is applied here because of the credential validation above
        mongoOptions.dbName = 'test';
    }
    if (allOptions.has('tls')) {
        if (new Set((_a = allOptions.get('tls')) === null || _a === void 0 ? void 0 : _a.map(getBoolean)).size !== 1) {
            throw new error_1.MongoParseError('All values of tls must be the same.');
        }
    }
    if (allOptions.has('ssl')) {
        if (new Set((_b = allOptions.get('ssl')) === null || _b === void 0 ? void 0 : _b.map(getBoolean)).size !== 1) {
            throw new error_1.MongoParseError('All values of ssl must be the same.');
        }
    }
    checkTLSOptions(mongoOptions);
    if (options.promiseLibrary)
        promise_provider_1.PromiseProvider.set(options.promiseLibrary);
    if (mongoOptions.directConnection && typeof mongoOptions.srvHost === 'string') {
        throw new error_1.MongoParseError('directConnection not supported with SRV URI');
    }
    // Potential SRV Overrides
    mongoOptions.userSpecifiedAuthSource =
        objectOptions.has('authSource') || urlOptions.has('authSource');
    mongoOptions.userSpecifiedReplicaSet =
        objectOptions.has('replicaSet') || urlOptions.has('replicaSet');
    if (mongoClient && mongoOptions.autoEncryption) {
        encrypter_1.Encrypter.checkForMongoCrypt();
        mongoOptions.encrypter = new encrypter_1.Encrypter(mongoClient, uri, options);
        mongoOptions.autoEncrypter = mongoOptions.encrypter.autoEncrypter;
    }
    return mongoOptions;
}
exports.parseOptions = parseOptions;
function setOption(mongoOptions, key, descriptor, values) {
    const { target, type, transform, deprecated } = descriptor;
    const name = target !== null && target !== void 0 ? target : key;
    if (deprecated) {
        const deprecatedMsg = typeof deprecated === 'string' ? `: ${deprecated}` : '';
        utils_1.emitWarning(`${key} is a deprecated option${deprecatedMsg}`);
    }
    switch (type) {
        case 'boolean':
            mongoOptions[name] = getBoolean(name, values[0]);
            break;
        case 'int':
            mongoOptions[name] = getInt(name, values[0]);
            break;
        case 'uint':
            mongoOptions[name] = getUint(name, values[0]);
            break;
        case 'string':
            if (values[0] === undefined) {
                break;
            }
            mongoOptions[name] = String(values[0]);
            break;
        case 'record':
            if (!utils_1.isRecord(values[0])) {
                throw new error_1.MongoParseError(`${name} must be an object`);
            }
            mongoOptions[name] = values[0];
            break;
        case 'any':
            mongoOptions[name] = values[0];
            break;
        default: {
            if (!transform) {
                throw new error_1.MongoParseError('Descriptors missing a type must define a transform');
            }
            const transformValue = transform({ name, options: mongoOptions, values });
            mongoOptions[name] = transformValue;
            break;
        }
    }
}
exports.OPTIONS = {
    appName: {
        target: 'metadata',
        transform({ options, values: [value] }) {
            return utils_1.makeClientMetadata({ ...options.driverInfo, appName: String(value) });
        }
    },
    auth: {
        target: 'credentials',
        transform({ name, options, values: [value] }) {
            if (!utils_1.isRecord(value, ['username', 'password'])) {
                throw new error_1.MongoParseError(`${name} must be an object with 'username' and 'password' properties`);
            }
            return mongo_credentials_1.MongoCredentials.merge(options.credentials, {
                username: value.username,
                password: value.password
            });
        }
    },
    authMechanism: {
        target: 'credentials',
        transform({ options, values: [value] }) {
            var _a, _b;
            const mechanisms = Object.values(defaultAuthProviders_1.AuthMechanism);
            const [mechanism] = mechanisms.filter(m => m.match(RegExp(String.raw `\b${value}\b`, 'i')));
            if (!mechanism) {
                throw new error_1.MongoParseError(`authMechanism one of ${mechanisms}, got ${value}`);
            }
            let source = (_a = options.credentials) === null || _a === void 0 ? void 0 : _a.source;
            if (mechanism === defaultAuthProviders_1.AuthMechanism.MONGODB_PLAIN ||
                mechanism === defaultAuthProviders_1.AuthMechanism.MONGODB_GSSAPI ||
                mechanism === defaultAuthProviders_1.AuthMechanism.MONGODB_AWS ||
                mechanism === defaultAuthProviders_1.AuthMechanism.MONGODB_X509) {
                // some mechanisms have '$external' as the Auth Source
                source = '$external';
            }
            let password = (_b = options.credentials) === null || _b === void 0 ? void 0 : _b.password;
            if (mechanism === defaultAuthProviders_1.AuthMechanism.MONGODB_X509 && password === '') {
                password = undefined;
            }
            return mongo_credentials_1.MongoCredentials.merge(options.credentials, {
                mechanism,
                source,
                password
            });
        }
    },
    authMechanismProperties: {
        target: 'credentials',
        transform({ options, values: [value] }) {
            if (typeof value === 'string') {
                value = toRecord(value);
            }
            if (!utils_1.isRecord(value)) {
                throw new error_1.MongoParseError('AuthMechanismProperties must be an object');
            }
            return mongo_credentials_1.MongoCredentials.merge(options.credentials, { mechanismProperties: value });
        }
    },
    authSource: {
        target: 'credentials',
        transform({ options, values: [value] }) {
            const source = String(value);
            return mongo_credentials_1.MongoCredentials.merge(options.credentials, { source });
        }
    },
    autoEncryption: {
        type: 'record'
    },
    bsonRegExp: {
        type: 'boolean'
    },
    serverApi: {
        target: 'serverApi',
        transform({ values: [version] }) {
            const serverApiToValidate = typeof version === 'string' ? { version } : version;
            const versionToValidate = serverApiToValidate && serverApiToValidate.version;
            if (!versionToValidate) {
                throw new error_1.MongoParseError(`Invalid \`serverApi\` property; must specify a version from the following enum: ["${Object.values(mongo_client_1.ServerApiVersion).join('", "')}"]`);
            }
            if (!Object.values(mongo_client_1.ServerApiVersion).some(v => v === versionToValidate)) {
                throw new error_1.MongoParseError(`Invalid server API version=${versionToValidate}; must be in the following enum: ["${Object.values(mongo_client_1.ServerApiVersion).join('", "')}"]`);
            }
            return serverApiToValidate;
        }
    },
    checkKeys: {
        type: 'boolean'
    },
    compressors: {
        default: 'none',
        target: 'compressors',
        transform({ values }) {
            const compressionList = new Set();
            for (const compVal of values) {
                for (const c of compVal.split(',')) {
                    if (['none', 'snappy', 'zlib'].includes(String(c))) {
                        compressionList.add(String(c));
                    }
                    else {
                        throw new error_1.MongoParseError(`${c} is not a valid compression mechanism`);
                    }
                }
            }
            return [...compressionList];
        }
    },
    connectTimeoutMS: {
        default: 30000,
        type: 'uint'
    },
    dbName: {
        type: 'string'
    },
    directConnection: {
        default: false,
        type: 'boolean'
    },
    driverInfo: {
        target: 'metadata',
        default: utils_1.makeClientMetadata(),
        transform({ options, values: [value] }) {
            var _a, _b;
            if (!utils_1.isRecord(value))
                throw new error_1.MongoParseError('DriverInfo must be an object');
            return utils_1.makeClientMetadata({
                driverInfo: value,
                appName: (_b = (_a = options.metadata) === null || _a === void 0 ? void 0 : _a.application) === null || _b === void 0 ? void 0 : _b.name
            });
        }
    },
    family: {
        transform({ name, values: [value] }) {
            const transformValue = getInt(name, value);
            if (transformValue === 4 || transformValue === 6) {
                return transformValue;
            }
            throw new error_1.MongoParseError(`Option 'family' must be 4 or 6 got ${transformValue}.`);
        }
    },
    fieldsAsRaw: {
        type: 'record'
    },
    forceServerObjectId: {
        default: false,
        type: 'boolean'
    },
    fsync: {
        deprecated: 'Please use journal instead',
        target: 'writeConcern',
        transform({ name, options, values: [value] }) {
            const wc = write_concern_1.WriteConcern.fromOptions({
                writeConcern: {
                    ...options.writeConcern,
                    fsync: getBoolean(name, value)
                }
            });
            if (!wc)
                throw new error_1.MongoParseError(`Unable to make a writeConcern from fsync=${value}`);
            return wc;
        }
    },
    heartbeatFrequencyMS: {
        default: 10000,
        type: 'uint'
    },
    ignoreUndefined: {
        type: 'boolean'
    },
    j: {
        deprecated: 'Please use journal instead',
        target: 'writeConcern',
        transform({ name, options, values: [value] }) {
            const wc = write_concern_1.WriteConcern.fromOptions({
                writeConcern: {
                    ...options.writeConcern,
                    journal: getBoolean(name, value)
                }
            });
            if (!wc)
                throw new error_1.MongoParseError(`Unable to make a writeConcern from journal=${value}`);
            return wc;
        }
    },
    journal: {
        target: 'writeConcern',
        transform({ name, options, values: [value] }) {
            const wc = write_concern_1.WriteConcern.fromOptions({
                writeConcern: {
                    ...options.writeConcern,
                    journal: getBoolean(name, value)
                }
            });
            if (!wc)
                throw new error_1.MongoParseError(`Unable to make a writeConcern from journal=${value}`);
            return wc;
        }
    },
    keepAlive: {
        default: true,
        type: 'boolean'
    },
    keepAliveInitialDelay: {
        default: 120000,
        type: 'uint'
    },
    localThresholdMS: {
        default: 15,
        type: 'uint'
    },
    logger: {
        default: new logger_1.Logger('MongoClient'),
        transform({ values: [value] }) {
            if (value instanceof logger_1.Logger) {
                return value;
            }
            utils_1.emitWarning('Alternative loggers might not be supported');
            // TODO: make Logger an interface that others can implement, make usage consistent in driver
            // DRIVERS-1204
        }
    },
    loggerLevel: {
        target: 'logger',
        transform({ values: [value] }) {
            return new logger_1.Logger('MongoClient', { loggerLevel: value });
        }
    },
    maxIdleTimeMS: {
        default: 0,
        type: 'uint'
    },
    maxPoolSize: {
        default: 100,
        type: 'uint'
    },
    maxStalenessSeconds: {
        target: 'readPreference',
        transform({ name, options, values: [value] }) {
            const maxStalenessSeconds = getUint(name, value);
            if (options.readPreference) {
                return read_preference_1.ReadPreference.fromOptions({
                    readPreference: { ...options.readPreference, maxStalenessSeconds }
                });
            }
            else {
                return new read_preference_1.ReadPreference('secondary', undefined, { maxStalenessSeconds });
            }
        }
    },
    minInternalBufferSize: {
        type: 'uint'
    },
    minPoolSize: {
        default: 0,
        type: 'uint'
    },
    minHeartbeatFrequencyMS: {
        default: 500,
        type: 'uint'
    },
    monitorCommands: {
        default: true,
        type: 'boolean'
    },
    name: {
        target: 'driverInfo',
        transform({ values: [value], options }) {
            return { ...options.driverInfo, name: String(value) };
        }
    },
    noDelay: {
        default: true,
        type: 'boolean'
    },
    pkFactory: {
        default: utils_1.DEFAULT_PK_FACTORY,
        transform({ values: [value] }) {
            if (utils_1.isRecord(value, ['createPk']) && typeof value.createPk === 'function') {
                return value;
            }
            throw new error_1.MongoParseError(`Option pkFactory must be an object with a createPk function, got ${value}`);
        }
    },
    promiseLibrary: {
        deprecated: true,
        type: 'any'
    },
    promoteBuffers: {
        type: 'boolean'
    },
    promoteLongs: {
        type: 'boolean'
    },
    promoteValues: {
        type: 'boolean'
    },
    raw: {
        default: false,
        type: 'boolean'
    },
    readConcern: {
        transform({ values: [value], options }) {
            if (value instanceof read_concern_1.ReadConcern || utils_1.isRecord(value, ['level'])) {
                return read_concern_1.ReadConcern.fromOptions({ ...options.readConcern, ...value });
            }
            throw new error_1.MongoParseError(`ReadConcern must be an object, got ${JSON.stringify(value)}`);
        }
    },
    readConcernLevel: {
        target: 'readConcern',
        transform({ values: [level], options }) {
            return read_concern_1.ReadConcern.fromOptions({
                ...options.readConcern,
                level: level
            });
        }
    },
    readPreference: {
        default: read_preference_1.ReadPreference.primary,
        transform({ values: [value], options }) {
            var _a, _b, _c;
            if (value instanceof read_preference_1.ReadPreference) {
                return read_preference_1.ReadPreference.fromOptions({
                    readPreference: { ...options.readPreference, ...value },
                    ...value
                });
            }
            if (utils_1.isRecord(value, ['mode'])) {
                const rp = read_preference_1.ReadPreference.fromOptions({
                    readPreference: { ...options.readPreference, ...value },
                    ...value
                });
                if (rp)
                    return rp;
                else
                    throw new error_1.MongoParseError(`Cannot make read preference from ${JSON.stringify(value)}`);
            }
            if (typeof value === 'string') {
                const rpOpts = {
                    hedge: (_a = options.readPreference) === null || _a === void 0 ? void 0 : _a.hedge,
                    maxStalenessSeconds: (_b = options.readPreference) === null || _b === void 0 ? void 0 : _b.maxStalenessSeconds
                };
                return new read_preference_1.ReadPreference(value, (_c = options.readPreference) === null || _c === void 0 ? void 0 : _c.tags, rpOpts);
            }
        }
    },
    readPreferenceTags: {
        target: 'readPreference',
        transform({ values, options }) {
            const readPreferenceTags = [];
            for (const tag of values) {
                const readPreferenceTag = Object.create(null);
                if (typeof tag === 'string') {
                    for (const [k, v] of Object.entries(toRecord(tag))) {
                        readPreferenceTag[k] = v;
                    }
                }
                if (utils_1.isRecord(tag)) {
                    for (const [k, v] of Object.entries(tag)) {
                        readPreferenceTag[k] = v;
                    }
                }
                readPreferenceTags.push(readPreferenceTag);
            }
            return read_preference_1.ReadPreference.fromOptions({
                readPreference: options.readPreference,
                readPreferenceTags
            });
        }
    },
    replicaSet: {
        type: 'string'
    },
    retryReads: {
        default: true,
        type: 'boolean'
    },
    retryWrites: {
        default: true,
        type: 'boolean'
    },
    serializeFunctions: {
        type: 'boolean'
    },
    serverSelectionTimeoutMS: {
        default: 30000,
        type: 'uint'
    },
    servername: {
        type: 'string'
    },
    socketTimeoutMS: {
        default: 0,
        type: 'uint'
    },
    ssl: {
        target: 'tls',
        type: 'boolean'
    },
    sslCA: {
        target: 'ca',
        transform({ values: [value] }) {
            return fs.readFileSync(String(value), { encoding: 'ascii' });
        }
    },
    sslCRL: {
        target: 'crl',
        transform({ values: [value] }) {
            return fs.readFileSync(String(value), { encoding: 'ascii' });
        }
    },
    sslCert: {
        target: 'cert',
        transform({ values: [value] }) {
            return fs.readFileSync(String(value), { encoding: 'ascii' });
        }
    },
    sslKey: {
        target: 'key',
        transform({ values: [value] }) {
            return fs.readFileSync(String(value), { encoding: 'ascii' });
        }
    },
    sslPass: {
        deprecated: true,
        target: 'passphrase',
        type: 'string'
    },
    sslValidate: {
        target: 'rejectUnauthorized',
        type: 'boolean'
    },
    tls: {
        type: 'boolean'
    },
    tlsAllowInvalidCertificates: {
        target: 'rejectUnauthorized',
        transform({ name, values: [value] }) {
            // allowInvalidCertificates is the inverse of rejectUnauthorized
            return !getBoolean(name, value);
        }
    },
    tlsAllowInvalidHostnames: {
        target: 'checkServerIdentity',
        transform({ name, values: [value] }) {
            // tlsAllowInvalidHostnames means setting the checkServerIdentity function to a noop
            return getBoolean(name, value) ? () => undefined : undefined;
        }
    },
    tlsCAFile: {
        target: 'ca',
        transform({ values: [value] }) {
            return fs.readFileSync(String(value), { encoding: 'ascii' });
        }
    },
    tlsCertificateFile: {
        target: 'cert',
        transform({ values: [value] }) {
            return fs.readFileSync(String(value), { encoding: 'ascii' });
        }
    },
    tlsCertificateKeyFile: {
        target: 'key',
        transform({ values: [value] }) {
            return fs.readFileSync(String(value), { encoding: 'ascii' });
        }
    },
    tlsCertificateKeyFilePassword: {
        target: 'passphrase',
        type: 'any'
    },
    tlsInsecure: {
        transform({ name, options, values: [value] }) {
            const tlsInsecure = getBoolean(name, value);
            if (tlsInsecure) {
                options.checkServerIdentity = () => undefined;
                options.rejectUnauthorized = false;
            }
            else {
                options.checkServerIdentity = options.tlsAllowInvalidHostnames
                    ? () => undefined
                    : undefined;
                options.rejectUnauthorized = options.tlsAllowInvalidCertificates ? false : true;
            }
            return tlsInsecure;
        }
    },
    w: {
        target: 'writeConcern',
        transform({ values: [value], options }) {
            return write_concern_1.WriteConcern.fromOptions({ writeConcern: { ...options.writeConcern, w: value } });
        }
    },
    waitQueueTimeoutMS: {
        default: 0,
        type: 'uint'
    },
    writeConcern: {
        target: 'writeConcern',
        transform({ values: [value], options }) {
            if (utils_1.isRecord(value) || value instanceof write_concern_1.WriteConcern) {
                return write_concern_1.WriteConcern.fromOptions({
                    writeConcern: {
                        ...options.writeConcern,
                        ...value
                    }
                });
            }
            else if (value === 'majority' || typeof value === 'number') {
                return write_concern_1.WriteConcern.fromOptions({
                    writeConcern: {
                        ...options.writeConcern,
                        w: value
                    }
                });
            }
            throw new error_1.MongoParseError(`Invalid WriteConcern cannot parse: ${JSON.stringify(value)}`);
        }
    },
    wtimeout: {
        deprecated: 'Please use wtimeoutMS instead',
        target: 'writeConcern',
        transform({ values: [value], options }) {
            const wc = write_concern_1.WriteConcern.fromOptions({
                writeConcern: {
                    ...options.writeConcern,
                    wtimeout: getUint('wtimeout', value)
                }
            });
            if (wc)
                return wc;
            throw new error_1.MongoParseError(`Cannot make WriteConcern from wtimeout`);
        }
    },
    wtimeoutMS: {
        target: 'writeConcern',
        transform({ values: [value], options }) {
            const wc = write_concern_1.WriteConcern.fromOptions({
                writeConcern: {
                    ...options.writeConcern,
                    wtimeoutMS: getUint('wtimeoutMS', value)
                }
            });
            if (wc)
                return wc;
            throw new error_1.MongoParseError(`Cannot make WriteConcern from wtimeout`);
        }
    },
    zlibCompressionLevel: {
        default: 0,
        type: 'int'
    },
    // Custom types for modifying core behavior
    connectionType: { type: 'any' },
    srvPoller: { type: 'any' },
    // Accepted NodeJS Options
    minDHSize: { type: 'any' },
    pskCallback: { type: 'any' },
    secureContext: { type: 'any' },
    enableTrace: { type: 'any' },
    requestCert: { type: 'any' },
    rejectUnauthorized: { type: 'any' },
    checkServerIdentity: { type: 'any' },
    ALPNProtocols: { type: 'any' },
    SNICallback: { type: 'any' },
    session: { type: 'any' },
    requestOCSP: { type: 'any' },
    localAddress: { type: 'any' },
    localPort: { type: 'any' },
    hints: { type: 'any' },
    lookup: { type: 'any' },
    ca: { type: 'any' },
    cert: { type: 'any' },
    ciphers: { type: 'any' },
    crl: { type: 'any' },
    ecdhCurve: { type: 'any' },
    key: { type: 'any' },
    passphrase: { type: 'any' },
    pfx: { type: 'any' },
    secureProtocol: { type: 'any' },
    index: { type: 'any' },
    // Legacy Options, these are unused but left here to avoid errors with CSFLE lib
    useNewUrlParser: { type: 'boolean' },
    useUnifiedTopology: { type: 'boolean' }
};
exports.DEFAULT_OPTIONS = new CaseInsensitiveMap(Object.entries(exports.OPTIONS)
    .filter(([, descriptor]) => typeof descriptor.default !== 'undefined')
    .map(([k, d]) => [k, d.default]));
//# sourceMappingURL=connection_string.js.map