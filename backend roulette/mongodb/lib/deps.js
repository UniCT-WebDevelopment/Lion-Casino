"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoEncryptionLoggerLevel = exports.aws4 = exports.saslprep = exports.Snappy = exports.Kerberos = void 0;
const error_1 = require("./error");
function makeErrorModule(error) {
    const props = error ? { kModuleError: error } : {};
    return new Proxy(props, {
        get: (_, key) => {
            if (key === 'kModuleError') {
                return error;
            }
            throw error;
        },
        set: () => {
            throw error;
        }
    });
}
exports.Kerberos = makeErrorModule(new error_1.MongoDriverError('Optional module `kerberos` not found. Please install it to enable kerberos authentication'));
try {
    exports.Kerberos = require('kerberos');
}
catch { } // eslint-disable-line
exports.Snappy = makeErrorModule(new error_1.MongoDriverError('Optional module `snappy` not found. Please install it to enable snappy compression'));
try {
    exports.Snappy = require('snappy');
}
catch { } // eslint-disable-line
exports.saslprep = makeErrorModule(new error_1.MongoDriverError('Optional module `saslprep` not found.' +
    ' Please install it to enable Stringprep Profile for User Names and Passwords'));
try {
    exports.saslprep = require('saslprep');
}
catch { } // eslint-disable-line
exports.aws4 = makeErrorModule(new error_1.MongoDriverError('Optional module `aws4` not found. Please install it to enable AWS authentication'));
try {
    exports.aws4 = require('aws4');
}
catch { } // eslint-disable-line
/** @public */
exports.AutoEncryptionLoggerLevel = Object.freeze({
    FatalError: 0,
    Error: 1,
    Warning: 2,
    Info: 3,
    Trace: 4
});
//# sourceMappingURL=deps.js.map