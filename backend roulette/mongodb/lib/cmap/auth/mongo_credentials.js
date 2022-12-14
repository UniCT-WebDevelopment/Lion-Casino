"use strict";
// Resolves the default auth mechanism according to
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoCredentials = void 0;
const error_1 = require("../../error");
const defaultAuthProviders_1 = require("./defaultAuthProviders");
// https://github.com/mongodb/specifications/blob/master/source/auth/auth.rst
function getDefaultAuthMechanism(ismaster) {
    if (ismaster) {
        // If ismaster contains saslSupportedMechs, use scram-sha-256
        // if it is available, else scram-sha-1
        if (Array.isArray(ismaster.saslSupportedMechs)) {
            return ismaster.saslSupportedMechs.includes(defaultAuthProviders_1.AuthMechanism.MONGODB_SCRAM_SHA256)
                ? defaultAuthProviders_1.AuthMechanism.MONGODB_SCRAM_SHA256
                : defaultAuthProviders_1.AuthMechanism.MONGODB_SCRAM_SHA1;
        }
        // Fallback to legacy selection method. If wire version >= 3, use scram-sha-1
        if (ismaster.maxWireVersion >= 3) {
            return defaultAuthProviders_1.AuthMechanism.MONGODB_SCRAM_SHA1;
        }
    }
    // Default for wireprotocol < 3
    return defaultAuthProviders_1.AuthMechanism.MONGODB_CR;
}
/**
 * A representation of the credentials used by MongoDB
 * @public
 */
class MongoCredentials {
    constructor(options) {
        this.username = options.username;
        this.password = options.password;
        this.source = options.source;
        if (!this.source && options.db) {
            this.source = options.db;
        }
        this.mechanism = options.mechanism || defaultAuthProviders_1.AuthMechanism.MONGODB_DEFAULT;
        this.mechanismProperties = options.mechanismProperties || {};
        if (this.mechanism.match(/MONGODB-AWS/i)) {
            if (!this.username && process.env.AWS_ACCESS_KEY_ID) {
                this.username = process.env.AWS_ACCESS_KEY_ID;
            }
            if (!this.password && process.env.AWS_SECRET_ACCESS_KEY) {
                this.password = process.env.AWS_SECRET_ACCESS_KEY;
            }
            if (!this.mechanismProperties.AWS_SESSION_TOKEN && process.env.AWS_SESSION_TOKEN) {
                this.mechanismProperties = {
                    ...this.mechanismProperties,
                    AWS_SESSION_TOKEN: process.env.AWS_SESSION_TOKEN
                };
            }
        }
        Object.freeze(this.mechanismProperties);
        Object.freeze(this);
    }
    /** Determines if two MongoCredentials objects are equivalent */
    equals(other) {
        return (this.mechanism === other.mechanism &&
            this.username === other.username &&
            this.password === other.password &&
            this.source === other.source);
    }
    /**
     * If the authentication mechanism is set to "default", resolves the authMechanism
     * based on the server version and server supported sasl mechanisms.
     *
     * @param ismaster - An ismaster response from the server
     */
    resolveAuthMechanism(ismaster) {
        // If the mechanism is not "default", then it does not need to be resolved
        if (this.mechanism.match(/DEFAULT/i)) {
            return new MongoCredentials({
                username: this.username,
                password: this.password,
                source: this.source,
                mechanism: getDefaultAuthMechanism(ismaster),
                mechanismProperties: this.mechanismProperties
            });
        }
        return this;
    }
    validate() {
        if ((this.mechanism === defaultAuthProviders_1.AuthMechanism.MONGODB_GSSAPI ||
            this.mechanism === defaultAuthProviders_1.AuthMechanism.MONGODB_CR ||
            this.mechanism === defaultAuthProviders_1.AuthMechanism.MONGODB_PLAIN ||
            this.mechanism === defaultAuthProviders_1.AuthMechanism.MONGODB_SCRAM_SHA1 ||
            this.mechanism === defaultAuthProviders_1.AuthMechanism.MONGODB_SCRAM_SHA256) &&
            !this.username) {
            throw new error_1.MongoDriverError(`Username required for mechanism '${this.mechanism}'`);
        }
        if (this.mechanism === defaultAuthProviders_1.AuthMechanism.MONGODB_GSSAPI ||
            this.mechanism === defaultAuthProviders_1.AuthMechanism.MONGODB_AWS ||
            this.mechanism === defaultAuthProviders_1.AuthMechanism.MONGODB_X509) {
            if (this.source != null && this.source !== '$external') {
                throw new error_1.MongoDriverError(`Invalid source '${this.source}' for mechanism '${this.mechanism}' specified.`);
            }
        }
        if (this.mechanism === defaultAuthProviders_1.AuthMechanism.MONGODB_PLAIN && this.source == null) {
            throw new error_1.MongoDriverError('PLAIN Authentication Mechanism needs an auth source');
        }
        if (this.mechanism === defaultAuthProviders_1.AuthMechanism.MONGODB_X509 && this.password != null) {
            if (this.password === '') {
                Reflect.set(this, 'password', undefined);
                return;
            }
            throw new error_1.MongoDriverError(`Password not allowed for mechanism MONGODB-X509`);
        }
    }
    static merge(creds, options) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        return new MongoCredentials({
            username: (_b = (_a = options.username) !== null && _a !== void 0 ? _a : creds === null || creds === void 0 ? void 0 : creds.username) !== null && _b !== void 0 ? _b : '',
            password: (_d = (_c = options.password) !== null && _c !== void 0 ? _c : creds === null || creds === void 0 ? void 0 : creds.password) !== null && _d !== void 0 ? _d : '',
            mechanism: (_f = (_e = options.mechanism) !== null && _e !== void 0 ? _e : creds === null || creds === void 0 ? void 0 : creds.mechanism) !== null && _f !== void 0 ? _f : defaultAuthProviders_1.AuthMechanism.MONGODB_DEFAULT,
            mechanismProperties: (_h = (_g = options.mechanismProperties) !== null && _g !== void 0 ? _g : creds === null || creds === void 0 ? void 0 : creds.mechanismProperties) !== null && _h !== void 0 ? _h : {},
            source: (_l = (_k = (_j = options.source) !== null && _j !== void 0 ? _j : options.db) !== null && _k !== void 0 ? _k : creds === null || creds === void 0 ? void 0 : creds.source) !== null && _l !== void 0 ? _l : 'admin'
        });
    }
}
exports.MongoCredentials = MongoCredentials;
//# sourceMappingURL=mongo_credentials.js.map