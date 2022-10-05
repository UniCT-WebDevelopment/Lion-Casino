/// <reference types="node" />
import { Binary } from 'bson';
import { BSONRegExp } from 'bson';
import { BSONSymbol } from 'bson';
import { Code } from 'bson';
import { ConnectionOptions as ConnectionOptions_2 } from 'tls';
import { DBRef } from 'bson';
import { Decimal128 } from 'bson';
import Denque = require('denque');
import { deserialize as deserialize_2 } from 'bson';
import { DeserializeOptions } from 'bson';
import * as dns from 'dns';
import { Document } from 'bson';
import { Double } from 'bson';
import { Duplex } from 'stream';
import { DuplexOptions } from 'stream';
import { EventEmitter } from 'events';
import { Int32 } from 'bson';
import { Long } from 'bson';
import { Map as Map_2 } from 'bson';
import { MaxKey } from 'bson';
import { MinKey } from 'bson';
import { ObjectId } from 'bson';
import { Readable } from 'stream';
import { serialize as serialize_2 } from 'bson';
import { SerializeOptions } from 'bson';
import { Socket } from 'net';
import { TcpNetConnectOpts } from 'net';
import { Timestamp } from 'bson';
import { TLSSocket } from 'tls';
import { TLSSocketOptions } from 'tls';
import { Writable } from 'stream';
/** @public */
export declare abstract class AbstractCursor<TSchema = any, CursorEvents extends AbstractCursorEvents = AbstractCursorEvents> extends TypedEventEmitter<CursorEvents> {
    /* Excluded from this release type: [kId] */
    /* Excluded from this release type: [kSession] */
    /* Excluded from this release type: [kServer] */
    /* Excluded from this release type: [kNamespace] */
    /* Excluded from this release type: [kDocuments] */
    /* Excluded from this release type: [kTopology] */
    /* Excluded from this release type: [kTransform] */
    /* Excluded from this release type: [kInitialized] */
    /* Excluded from this release type: [kClosed] */
    /* Excluded from this release type: [kKilled] */
    /* Excluded from this release type: [kOptions] */
    /** @event */
    static readonly CLOSE: "close";
    /*Excluded from this release type: __constructor */
    readonly id: Long | undefined;
    /*Excluded from this release type: topology
    Excluded from this release type: server */
    readonly namespace: MongoDBNamespace;
    readonly readPreference: ReadPreference;
    readonly readConcern: ReadConcern | undefined;
    /*Excluded from this release type: session
    Excluded from this release type: session
    Excluded from this release type: cursorOptions */
    readonly closed: boolean;
    readonly killed: boolean;
    /** Returns current buffered documents length */
    bufferedCount(): number;
    /** Returns current buffered documents */
    readBufferedDocuments(number?: number): TSchema[];
    [Symbol.asyncIterator](): AsyncIterator<TSchema | null>;
    stream(options?: CursorStreamOptions): Readable;
    hasNext(): Promise<boolean>;
    hasNext(callback: Callback<boolean>): void;
    /** Get the next available document from the cursor, returns null if no more documents are available. */
    next<T = TSchema>(): Promise<T | null>;
    next<T = TSchema>(callback: Callback<T | null>): void;
    /**
     * Try to get the next available document from the cursor or `null` if an empty batch is returned
     */
    tryNext<T = TSchema>(): Promise<T | null>;
    tryNext<T = TSchema>(callback: Callback<T | null>): void;
    /**
     * Iterates over all the documents for this cursor using the iterator, callback pattern.
     *
     * @param iterator - The iteration callback.
     * @param callback - The end callback.
     */
    forEach<T = TSchema>(iterator: (doc: T) => boolean | void): Promise<void>;
    forEach<T = TSchema>(iterator: (doc: T) => boolean | void, callback: Callback<void>): void;
    close(): void;
    close(callback: Callback): void;
    close(options: CursorCloseOptions): Promise<void>;
    close(options: CursorCloseOptions, callback: Callback): void;
    /**
     * Returns an array of documents. The caller is responsible for making sure that there
     * is enough memory to store the results. Note that the array only contains partial
     * results when this cursor had been previously accessed. In that case,
     * cursor.rewind() can be used to reset the cursor.
     *
     * @param callback - The result callback.
     */
    toArray<T = TSchema>(): Promise<T[]>;
    toArray<T = TSchema>(callback: Callback<T[]>): void;
    /**
     * Add a cursor flag to the cursor
     *
     * @param flag - The flag to set, must be one of following ['tailable', 'oplogReplay', 'noCursorTimeout', 'awaitData', 'partial' -.
     * @param value - The flag boolean value.
     */
    addCursorFlag(flag: CursorFlag, value: boolean): this;
    /**
     * Map all documents using the provided function
     * If there is a transform set on the cursor, that will be called first and the result passed to
     * this function's transform.
     * @remarks
     *
     * **NOTE:** adding a transform changes the return type of the iteration of this cursor, it **does not** return
     * a new instance of a cursor. This means when calling map, you should always assign the result to a new
     * variable. Take note of the following example:
     *
     * @example
     * ```typescript
     * const cursor: FindCursor<Document> = coll.find();
     * const mappedCursor: FindCursor<number> = cursor.map(doc => Object.keys(doc).length);
     * const keyCounts: number[] = await mappedCursor.toArray(); // cursor.toArray() still returns Document[]
     * ```
     * @param transform - The mapping transformation method.
     */
    map<T = any>(transform: (doc: TSchema) => T): AbstractCursor<T>;
    /**
     * Set the ReadPreference for the cursor.
     *
     * @param readPreference - The new read preference for the cursor.
     */
    withReadPreference(readPreference: ReadPreferenceLike): this;
    /**
     * Set the ReadPreference for the cursor.
     *
     * @param readPreference - The new read preference for the cursor.
     */
    withReadConcern(readConcern: ReadConcernLike): this;
    /**
     * Set a maxTimeMS on the cursor query, allowing for hard timeout limits on queries (Only supported on MongoDB 2.6 or higher)
     *
     * @param value - Number of milliseconds to wait before aborting the query.
     */
    maxTimeMS(value: number): this;
    /**
     * Set the batch size for the cursor.
     *
     * @param value - The number of documents to return per batch. See {@link https://docs.mongodb.com/manual/reference/command/find/|find command documentation}.
     */
    batchSize(value: number): this;
    /**
     * Rewind this cursor to its uninitialized state. Any options that are present on the cursor will
     * remain in effect. Iterating this cursor will cause new queries to be sent to the server, even
     * if the resultant data has already been retrieved by this cursor.
     */
    rewind(): void;
    /**
     * Returns a new uninitialized copy of this cursor, with options matching those that have been set on the current instance
     */
    abstract clone(): AbstractCursor<TSchema>;
}
/** @public */
export declare type AbstractCursorEvents = {
    [AbstractCursor.CLOSE](): void;
};
/** @public */
export declare interface AbstractCursorOptions extends BSONSerializeOptions {
    session?: ClientSession;
    readPreference?: ReadPreferenceLike;
    readConcern?: ReadConcernLike;
    batchSize?: number;
    maxTimeMS?: number;
    comment?: Document | string;
    tailable?: boolean;
    awaitData?: boolean;
    noCursorTimeout?: boolean;
}
/* Excluded from this release type: AbstractOperation */
/** @public */
export declare type AcceptedFields<TSchema, FieldType, AssignableType> = {
    readonly [key in KeysOfAType<TSchema, FieldType>]?: AssignableType;
};
/** @public */
export declare type AddToSetOperators<Type> = {
    $each?: Array<Flatten<Type>>;
};
/** @public */
export declare interface AddUserOptions extends CommandOperationOptions {
    /** @deprecated Please use db.command('createUser', ...) instead for this option */
    digestPassword?: null;
    /** Roles associated with the created user */
    roles?: string | string[] | RoleSpecification | RoleSpecification[];
    /** Custom data associated with the user (only Mongodb 2.6 or higher) */
    customData?: Document;
}
/**
 * The **Admin** class is an internal class that allows convenient access to
 * the admin functionality and commands for MongoDB.
 *
 * **ADMIN Cannot directly be instantiated**
 * @public
 *
 * @example
 * ```js
 * const MongoClient = require('mongodb').MongoClient;
 * const test = require('assert');
 * // Connection url
 * const url = 'mongodb://localhost:27017';
 * // Database Name
 * const dbName = 'test';
 *
 * // Connect using MongoClient
 * MongoClient.connect(url, function(err, client) {
 *   // Use the admin database for the operation
 *   const adminDb = client.db(dbName).admin();
 *
 *   // List all the available databases
 *   adminDb.listDatabases(function(err, dbs) {
 *     expect(err).to.not.exist;
 *     test.ok(dbs.databases.length > 0);
 *     client.close();
 *   });
 * });
 * ```
 */
export declare class Admin {
    /* Excluded from this release type: s */
    /* Excluded from this release type: __constructor */
    /**
     * Execute a command
     *
     * @param command - The command to execute
     * @param options - Optional settings for the command
     * @param callback - An optional callback, a Promise will be returned if none is provided
     */
    command(command: Document): Promise<Document>;
    command(command: Document, callback: Callback<Document>): void;
    command(command: Document, options: RunCommandOptions): Promise<Document>;
    command(command: Document, options: RunCommandOptions, callback: Callback<Document>): void;
    /**
     * Retrieve the server build information
     *
     * @param options - Optional settings for the command
     * @param callback - An optional callback, a Promise will be returned if none is provided
     */
    buildInfo(): Promise<Document>;
    buildInfo(callback: Callback<Document>): void;
    buildInfo(options: CommandOperationOptions): Promise<Document>;
    buildInfo(options: CommandOperationOptions, callback: Callback<Document>): void;
    /**
     * Retrieve the server build information
     *
     * @param options - Optional settings for the command
     * @param callback - An optional callback, a Promise will be returned if none is provided
     */
    serverInfo(): Promise<Document>;
    serverInfo(callback: Callback<Document>): void;
    serverInfo(options: CommandOperationOptions): Promise<Document>;
    serverInfo(options: CommandOperationOptions, callback: Callback<Document>): void;
    /**
     * Retrieve this db's server status.
     *
     * @param options - Optional settings for the command
     * @param callback - An optional callback, a Promise will be returned if none is provided
     */
    serverStatus(): Promise<Document>;
    serverStatus(callback: Callback<Document>): void;
    serverStatus(options: CommandOperationOptions): Promise<Document>;
    serverStatus(options: CommandOperationOptions, callback: Callback<Document>): void;
    /**
     * Ping the MongoDB server and retrieve results
     *
     * @param options - Optional settings for the command
     * @param callback - An optional callback, a Promise will be returned if none is provided
     */
    ping(): Promise<Document>;
    ping(callback: Callback<Document>): void;
    ping(options: CommandOperationOptions): Promise<Document>;
    ping(options: CommandOperationOptions, callback: Callback<Document>): void;
    /**
     * Add a user to the database
     *
     * @param username - The username for the new user
     * @param password - An optional password for the new user
     * @param options - Optional settings for the command
     * @param callback - An optional callback, a Promise will be returned if none is provided
     */
    addUser(username: string): Promise<Document>;
    addUser(username: string, callback: Callback<Document>): void;
    addUser(username: string, password: string): Promise<Document>;
    addUser(username: string, password: string, callback: Callback<Document>): void;
    addUser(username: string, options: AddUserOptions): Promise<Document>;
    addUser(username: string, options: AddUserOptions, callback: Callback<Document>): void;
    addUser(username: string, password: string, options: AddUserOptions): Promise<Document>;
    addUser(username: string, password: string, options: AddUserOptions, callback: Callback<Document>): void;
    /**
     * Remove a user from a database
     *
     * @param username - The username to remove
     * @param options - Optional settings for the command
     * @param callback - An optional callback, a Promise will be returned if none is provided
     */
    removeUser(username: string): Promise<boolean>;
    removeUser(username: string, callback: Callback<boolean>): void;
    removeUser(username: string, options: RemoveUserOptions): Promise<boolean>;
    removeUser(username: string, options: RemoveUserOptions, callback: Callback<boolean>): void;
    /**
     * Validate an existing collection
     *
     * @param collectionName - The name of the collection to validate.
     * @param options - Optional settings for the command
     * @param callback - An optional callback, a Promise will be returned if none is provided
     */
    validateCollection(collectionName: string): Promise<Document>;
    validateCollection(collectionName: string, callback: Callback<Document>): void;
    validateCollection(collectionName: string, options: ValidateCollectionOptions): Promise<Document>;
    validateCollection(collectionName: string, options: ValidateCollectionOptions, callback: Callback<Document>): void;
    /**
     * List the available databases
     *
     * @param options - Optional settings for the command
     * @param callback - An optional callback, a Promise will be returned if none is provided
     */
    listDatabases(): Promise<ListDatabasesResult>;
    listDatabases(callback: Callback<ListDatabasesResult>): void;
    listDatabases(options: ListDatabasesOptions): Promise<ListDatabasesResult>;
    listDatabases(options: ListDatabasesOptions, callback: Callback<ListDatabasesResult>): void;
    /**
     * Get ReplicaSet status
     *
     * @param options - Optional settings for the command
     * @param callback - An optional callback, a Promise will be returned if none is provided
     */
    replSetGetStatus(): Promise<Document>;
    replSetGetStatus(callback: Callback<Document>): void;
    replSetGetStatus(options: CommandOperationOptions): Promise<Document>;
    replSetGetStatus(options: CommandOperationOptions, callback: Callback<Document>): void;
}
/* Excluded from this release type: AdminPrivate */
/* Excluded from this release type: AggregateOperation */
/** @public */
export declare interface AggregateOptions extends CommandOperationOptions {
    /** allowDiskUse lets the server know if it can use disk to store temporary results for the aggregation (requires mongodb 2.6 \>). */
    allowDiskUse?: boolean;
    /** The number of documents to return per batch. See [aggregation documentation](https://docs.mongodb.com/manual/reference/command/aggregate). */
    batchSize?: number;
    /** Allow driver to bypass schema validation in MongoDB 3.2 or higher. */
    bypassDocumentValidation?: boolean;
    /** Return the query as cursor, on 2.6 \> it returns as a real cursor on pre 2.6 it returns as an emulated cursor. */
    cursor?: Document;
    /** specifies a cumulative time limit in milliseconds for processing operations on the cursor. MongoDB interrupts the operation at the earliest following interrupt point. */
    maxTimeMS?: number;
    /** The maximum amount of time for the server to wait on new documents to satisfy a tailable cursor query. */
    maxAwaitTimeMS?: number;
    /** Specify collation. */
    collation?: CollationOptions;
    /** Add an index selection hint to an aggregation command */
    hint?: Hint;
    /** Map of parameter names and values that can be accessed using $$var (requires MongoDB 5.0). */
    let?: Document;
    out?: string;
}
/**
 * The **AggregationCursor** class is an internal class that embodies an aggregation cursor on MongoDB
 * allowing for iteration over the results returned from the underlying query. It supports
 * one by one document iteration, conversion to an array or can be iterated as a Node 4.X
 * or higher stream
 * @public
 */
export declare class AggregationCursor<TSchema = Document> extends AbstractCursor<TSchema> {
    /*Excluded from this release type: [kParent]
    Excluded from this release type: [kPipeline]
    Excluded from this release type: [kOptions]
    Excluded from this release type: __constructor */
    readonly pipeline: Document[];
    clone(): AggregationCursor<TSchema>;
    map<T>(transform: (doc: TSchema) => T): AggregationCursor<T>;
    /* Excluded from this release type: _initialize */
    /** Execute the explain for the cursor */
    explain(): Promise<Document>;
    explain(callback: Callback): void;
    explain(verbosity: ExplainVerbosityLike): Promise<Document>;
    /** Add a group stage to the aggregation pipeline */
    group<T = TSchema>($group: Document): AggregationCursor<T>;
    /** Add a limit stage to the aggregation pipeline */
    limit($limit: number): this;
    /** Add a match stage to the aggregation pipeline */
    match($match: Document): this;
    /** Add a out stage to the aggregation pipeline */
    out($out: number): this;
    /**
     * Add a project stage to the aggregation pipeline
     *
     * @remarks
     * In order to strictly type this function you must provide an interface
     * that represents the effect of your projection on the result documents.
     *
     * **NOTE:** adding a projection changes the return type of the iteration of this cursor,
     * it **does not** return a new instance of a cursor. This means when calling project,
     * you should always assign the result to a new variable. Take note of the following example:
     *
     * @example
     * ```typescript
     * const cursor: AggregationCursor<{ a: number; b: string }> = coll.aggregate([]);
     * const projectCursor = cursor.project<{ a: number }>({ a: true });
     * const aPropOnlyArray: {a: number}[] = await projectCursor.toArray();
     * ```
     */
    project<T = TSchema>($project: Projection<T>): AggregationCursor<T>;
    /** Add a lookup stage to the aggregation pipeline */
    lookup($lookup: Document): this;
    /** Add a redact stage to the aggregation pipeline */
    redact($redact: Document): this;
    /** Add a skip stage to the aggregation pipeline */
    skip($skip: number): this;
    /** Add a sort stage to the aggregation pipeline */
    sort($sort: Sort): this;
    /** Add a unwind stage to the aggregation pipeline */
    unwind($unwind: Document | string): this;
    /** @deprecated Add a geoNear stage to the aggregation pipeline */
    geoNear($geoNear: Document): this;
}
/** @public */
export declare interface AggregationCursorOptions extends AbstractCursorOptions, AggregateOptions {
}
/**
 * It is possible to search using alternative types in mongodb e.g.
 * string types can be searched using a regex in mongo
 * array types can be searched using their element type
 * @public
 */
export declare type AlternativeType<T> = T extends ReadonlyArray<infer U> ? T | RegExpOrString<U> : RegExpOrString<T>;
/** @public */
export declare type AnyBulkWriteOperation<TSchema extends Document = Document> = {
    insertOne: InsertOneModel<TSchema>;
} | {
    replaceOne: ReplaceOneModel<TSchema>;
} | {
    updateOne: UpdateOneModel<TSchema>;
} | {
    updateMany: UpdateManyModel<TSchema>;
} | {
    deleteOne: DeleteOneModel<TSchema>;
} | {
    deleteMany: DeleteManyModel<TSchema>;
};
/** @public */
export declare type AnyError = MongoError | Error;
/** @public */
export declare type ArrayOperator<Type> = {
    $each?: Array<Flatten<Type>>;
    $slice?: number;
    $position?: number;
    $sort?: Sort;
};
/** @public */
export declare interface Auth {
    /** The username for auth */
    username?: string;
    /** The password for auth */
    password?: string;
}
/** @public */
export declare const AuthMechanism: Readonly<{
    readonly MONGODB_AWS: "MONGODB-AWS";
    readonly MONGODB_CR: "MONGODB-CR";
    readonly MONGODB_DEFAULT: "DEFAULT";
    readonly MONGODB_GSSAPI: "GSSAPI";
    readonly MONGODB_PLAIN: "PLAIN";
    readonly MONGODB_SCRAM_SHA1: "SCRAM-SHA-1";
    readonly MONGODB_SCRAM_SHA256: "SCRAM-SHA-256";
    readonly MONGODB_X509: "MONGODB-X509";
}>;
/** @public */
export declare type AuthMechanism = typeof AuthMechanism[keyof typeof AuthMechanism];
/** @public */
export declare interface AutoEncrypter {
    new (client: MongoClient, options: AutoEncryptionOptions): AutoEncrypter;
    init(cb: Callback): void;
    teardown(force: boolean, callback: Callback): void;
    encrypt(ns: string, cmd: Document, options: any, callback: Callback<Document>): void;
    decrypt(cmd: Document, options: any, callback: Callback<Document>): void;
}
/** @public */
export declare const AutoEncryptionLoggerLevel: Readonly<{
    readonly FatalError: 0;
    readonly Error: 1;
    readonly Warning: 2;
    readonly Info: 3;
    readonly Trace: 4;
}>;
/** @public */
export declare type AutoEncryptionLoggerLevel = typeof AutoEncryptionLoggerLevel[keyof typeof AutoEncryptionLoggerLevel];
/** @public */
export declare interface AutoEncryptionOptions {
    /* Excluded from this release type: bson */
    /* Excluded from this release type: metadataClient */
    /** A `MongoClient` used to fetch keys from a key vault */
    keyVaultClient?: MongoClient;
    /** The namespace where keys are stored in the key vault */
    keyVaultNamespace?: string;
    /** Configuration options that are used by specific KMS providers during key generation, encryption, and decryption. */
    kmsProviders?: {
        /** Configuration options for using 'aws' as your KMS provider */
        aws?: {
            /** The access key used for the AWS KMS provider */
            accessKeyId: string;
            /** The secret access key used for the AWS KMS provider */
            secretAccessKey: string;
            /**
             * An optional AWS session token that will be used as the
             * X-Amz-Security-Token header for AWS requests.
             */
            sessionToken?: string;
        };
        /** Configuration options for using 'local' as your KMS provider */
        local?: {
            /**
             * The master key used to encrypt/decrypt data keys.
             * A 96-byte long Buffer or base64 encoded string.
             */
            key: Buffer | string;
        };
        /** Configuration options for using 'azure' as your KMS provider */
        azure?: {
            /** The tenant ID identifies the organization for the account */
            tenantId: string;
            /** The client ID to authenticate a registered application */
            clientId: string;
            /** The client secret to authenticate a registered application */
            clientSecret: string;
            /**
             * If present, a host with optional port. E.g. "example.com" or "example.com:443".
             * This is optional, and only needed if customer is using a non-commercial Azure instance
             * (e.g. a government or China account, which use different URLs).
             * Defaults to "login.microsoftonline.com"
             */
            identityPlatformEndpoint?: string | undefined;
        };
        /** Configuration options for using 'gcp' as your KMS provider */
        gcp?: {
            /** The service account email to authenticate */
            email: string;
            /** A PKCS#8 encrypted key. This can either be a base64 string or a binary representation */
            privateKey: string | Buffer;
            /**
             * If present, a host with optional port. E.g. "example.com" or "example.com:443".
             * Defaults to "oauth2.googleapis.com"
             */
            endpoint?: string | undefined;
        };
    };
    /**
     * A map of namespaces to a local JSON schema for encryption
     *
     * **NOTE**: Supplying options.schemaMap provides more security than relying on JSON Schemas obtained from the server.
     * It protects against a malicious server advertising a false JSON Schema, which could trick the client into sending decrypted data that should be encrypted.
     * Schemas supplied in the schemaMap only apply to configuring automatic encryption for client side encryption.
     * Other validation rules in the JSON schema will not be enforced by the driver and will result in an error.
     */
    schemaMap?: Document;
    /** Allows the user to bypass auto encryption, maintaining implicit decryption */
    bypassAutoEncryption?: boolean;
    options?: {
        /** An optional hook to catch logging messages from the underlying encryption engine */
        logger?: (level: AutoEncryptionLoggerLevel, message: string) => void;
    };
    extraOptions?: {
        /**
         * A local process the driver communicates with to determine how to encrypt values in a command.
         * Defaults to "mongodb://%2Fvar%2Fmongocryptd.sock" if domain sockets are available or "mongodb://localhost:27020" otherwise
         */
        mongocryptdURI?: string;
        /** If true, autoEncryption will not attempt to spawn a mongocryptd before connecting  */
        mongocryptdBypassSpawn?: boolean;
        /** The path to the mongocryptd executable on the system */
        mongocryptdSpawnPath?: string;
        /** Command line arguments to use when auto-spawning a mongocryptd */
        mongocryptdSpawnArgs?: string[];
    };
}
/**
 * Keeps the state of a unordered batch so we can rewrite the results
 * correctly after command execution
 *
 * @public
 */
export declare class Batch<T = Document> {
    originalZeroIndex: number;
    currentIndex: number;
    originalIndexes: number[];
    batchType: BatchType;
    operations: T[];
    size: number;
    sizeBytes: number;
    constructor(batchType: BatchType, originalZeroIndex: number);
}
/** @public */
export declare const BatchType: Readonly<{
    readonly INSERT: 1;
    readonly UPDATE: 2;
    readonly DELETE: 3;
}>;
/** @public */
export declare type BatchType = typeof BatchType[keyof typeof BatchType];
export { Binary };
/** @public */
export declare type BitwiseFilter = number /** numeric bit mask */ | Binary /** BinData bit mask */ | number[];
export { BSONRegExp };
/**
 * BSON Serialization options.
 * @public
 */
export declare interface BSONSerializeOptions extends Pick<SerializeOptions, Exclude<keyof SerializeOptions, 'index'>>, Pick<DeserializeOptions, Exclude<keyof DeserializeOptions, 'evalFunctions' | 'cacheFunctions' | 'cacheFunctionsCrc32' | 'allowObjectSmallerThanBufferSize' | 'index'>> {
    /** Return BSON filled buffers from operations */
    raw?: boolean;
}
export { BSONSymbol };
/** @public */
export declare const BSONType: Readonly<{
    readonly double: 1;
    readonly string: 2;
    readonly object: 3;
    readonly array: 4;
    readonly binData: 5;
    readonly undefined: 6;
    readonly objectId: 7;
    readonly bool: 8;
    readonly date: 9;
    readonly null: 10;
    readonly regex: 11;
    readonly dbPointer: 12;
    readonly javascript: 13;
    readonly symbol: 14;
    readonly javascriptWithScope: 15;
    readonly int: 16;
    readonly timestamp: 17;
    readonly long: 18;
    readonly decimal: 19;
    readonly minKey: -1;
    readonly maxKey: 127;
}>;
/** @public */
export declare type BSONType = typeof BSONType[keyof typeof BSONType];
/** @public */
export declare type BSONTypeAlias = keyof typeof BSONType;
/* Excluded from this release type: BufferPool */
/** @public */
export declare abstract class BulkOperationBase {
    isOrdered: boolean;
    /* Excluded from this release type: s */
    operationId?: number;
    /* Excluded from this release type: __constructor */
    /**
     * Add a single insert document to the bulk operation
     *
     * @example
     * ```js
     * const bulkOp = collection.initializeOrderedBulkOp();
     *
     * // Adds three inserts to the bulkOp.
     * bulkOp
     *   .insert({ a: 1 })
     *   .insert({ b: 2 })
     *   .insert({ c: 3 });
     * await bulkOp.execute();
     * ```
     */
    insert(document: Document): BulkOperationBase;
    /**
     * Builds a find operation for an update/updateOne/delete/deleteOne/replaceOne.
     * Returns a builder object used to complete the definition of the operation.
     *
     * @example
     * ```js
     * const bulkOp = collection.initializeOrderedBulkOp();
     *
     * // Add an updateOne to the bulkOp
     * bulkOp.find({ a: 1 }).updateOne({ $set: { b: 2 } });
     *
     * // Add an updateMany to the bulkOp
     * bulkOp.find({ c: 3 }).update({ $set: { d: 4 } });
     *
     * // Add an upsert
     * bulkOp.find({ e: 5 }).upsert().updateOne({ $set: { f: 6 } });
     *
     * // Add a deletion
     * bulkOp.find({ g: 7 }).deleteOne();
     *
     * // Add a multi deletion
     * bulkOp.find({ h: 8 }).delete();
     *
     * // Add a replaceOne
     * bulkOp.find({ i: 9 }).replaceOne({writeConcern: { j: 10 }});
     *
     * // Update using a pipeline (requires Mongodb 4.2 or higher)
     * bulk.find({ k: 11, y: { $exists: true }, z: { $exists: true } }).updateOne([
     *   { $set: { total: { $sum: [ '$y', '$z' ] } } }
     * ]);
     *
     * // All of the ops will now be executed
     * await bulkOp.execute();
     * ```
     */
    find(selector: Document): FindOperators;
    /** Specifies a raw operation to perform in the bulk write. */
    raw(op: AnyBulkWriteOperation): this;
    readonly bsonOptions: BSONSerializeOptions;
    readonly writeConcern: WriteConcern | undefined;
    readonly batches: Batch[];
    /** An internal helper method. Do not invoke directly. Will be going away in the future */
    execute(options?: BulkWriteOptions, callback?: Callback<BulkWriteResult>): Promise<BulkWriteResult> | void;
    /* Excluded from this release type: handleWriteError */
    abstract addToOperationsList(batchType: BatchType, document: Document | UpdateStatement | DeleteStatement): this;
}
/* Excluded from this release type: BulkOperationPrivate */
/** @public */
export declare interface BulkResult {
    ok: number;
    writeErrors: WriteError[];
    writeConcernErrors: WriteConcernError[];
    insertedIds: Document[];
    nInserted: number;
    nUpserted: number;
    nMatched: number;
    nModified: number;
    nRemoved: number;
    upserted: Document[];
    opTime?: Document;
}
/** @public */
export declare interface BulkWriteOperationError {
    index: number;
    code: number;
    errmsg: string;
    op: Document | UpdateStatement | DeleteStatement;
}
/** @public */
export declare interface BulkWriteOptions extends CommandOperationOptions {
    /** Allow driver to bypass schema validation in MongoDB 3.2 or higher. */
    bypassDocumentValidation?: boolean;
    /** If true, when an insert fails, don't execute the remaining writes. If false, continue with remaining inserts when one fails. */
    ordered?: boolean;
    /** @deprecated use `ordered` instead */
    keepGoing?: boolean;
    /** Force server to assign _id values instead of driver. */
    forceServerObjectId?: boolean;
}
/**
 * @public
 * The result of a bulk write.
 */
export declare class BulkWriteResult {
    result: BulkResult;
    /*Excluded from this release type: __constructor
    Number of documents inserted. */
    readonly insertedCount: number;
    /*Number of documents matched for update. */
    readonly matchedCount: number;
    /*Number of documents modified. */
    readonly modifiedCount: number;
    /*Number of documents deleted. */
    readonly deletedCount: number;
    /*Number of documents upserted. */
    readonly upsertedCount: number;
    /*Upserted document generated Id's, hash key is the index of the originating operation */
    readonly upsertedIds: {
        [key: number]: any;
    };
    /*Inserted document generated Id's, hash key is the index of the originating operation */
    readonly insertedIds: {
        [key: number]: any;
    };
    /*Evaluates to true if the bulk operation correctly executes */
    readonly ok: number;
    /*The number of inserted documents */
    readonly nInserted: number;
    /*Number of upserted documents */
    readonly nUpserted: number;
    /*Number of matched documents */
    readonly nMatched: number;
    /*Number of documents updated physically on disk */
    readonly nModified: number;
    /*Number of removed documents */
    readonly nRemoved: number;
    /** Returns an array of all inserted ids */
    getInsertedIds(): Document[];
    /** Returns an array of all upserted ids */
    getUpsertedIds(): Document[];
    /** Returns the upserted id at the given index */
    getUpsertedIdAt(index: number): Document | undefined;
    /** Returns raw internal result */
    getRawResponse(): Document;
    /** Returns true if the bulk operation contains a write error */
    hasWriteErrors(): boolean;
    /** Returns the number of write errors off the bulk operation */
    getWriteErrorCount(): number;
    /** Returns a specific write error object */
    getWriteErrorAt(index: number): WriteError | undefined;
    /** Retrieve all write errors */
    getWriteErrors(): WriteError[];
    /** Retrieve lastOp if available */
    getLastOp(): Document | undefined;
    /** Retrieve the write concern error if one exists */
    getWriteConcernError(): WriteConcernError | undefined;
    toJSON(): BulkResult;
    toString(): string;
    isOk(): boolean;
}
/**
 * MongoDB Driver style callback
 * @public
 */
export declare type Callback<T = any> = (error?: AnyError, result?: T) => void;
/** @public */
export declare class CancellationToken extends TypedEventEmitter<{
    cancel(): void;
}> {
}
/**
 * Creates a new Change Stream instance. Normally created using {@link Collection#watch|Collection.watch()}.
 * @public
 */
export declare class ChangeStream<TSchema extends Document = Document> extends TypedEventEmitter<ChangeStreamEvents> {
    pipeline: Document[];
    options: ChangeStreamOptions;
    parent: MongoClient | Db | Collection;
    namespace: MongoDBNamespace;
    type: symbol;
    /* Excluded from this release type: cursor */
    streamOptions?: CursorStreamOptions;
    /* Excluded from this release type: [kResumeQueue] */
    /* Excluded from this release type: [kCursorStream] */
    /* Excluded from this release type: [kClosed] */
    /* Excluded from this release type: [kMode] */
    /** @event */
    static readonly RESPONSE: "response";
    /** @event */
    static readonly MORE: "more";
    /** @event */
    static readonly INIT: "init";
    /** @event */
    static readonly CLOSE: "close";
    /**
     * Fired for each new matching change in the specified namespace. Attaching a `change`
     * event listener to a Change Stream will switch the stream into flowing mode. Data will
     * then be passed as soon as it is available.
     * @event
     */
    static readonly CHANGE: "change";
    /** @event */
    static readonly END: "end";
    /** @event */
    static readonly ERROR: "error";
    /**
     * Emitted each time the change stream stores a new resume token.
     * @event
     */
    static readonly RESUME_TOKEN_CHANGED: "resumeTokenChanged";
    /*Excluded from this release type: __constructor
    Excluded from this release type: cursorStream
    The cached resume token that is used to resume after the most recently returned change. */
    readonly resumeToken: ResumeToken;
    /** Check if there is any document still available in the Change Stream */
    hasNext(callback?: Callback): Promise<void> | void;
    /** Get the next available document from the Change Stream. */
    next(): Promise<ChangeStreamDocument<TSchema>>;
    next(callback: Callback<ChangeStreamDocument<TSchema>>): void;
    /*Is the cursor closed */
    readonly closed: boolean;
    /** Close the Change Stream */
    close(callback?: Callback): Promise<void> | void;
    /**
     * Return a modified Readable stream including a possible transform method.
     * @throws MongoDriverError if this.cursor is undefined
     */
    stream(options?: CursorStreamOptions): Readable;
    /**
     * Try to get the next available document from the Change Stream's cursor or `null` if an empty batch is returned
     */
    tryNext(): Promise<Document | null>;
    tryNext(callback: Callback<Document | null>): void;
}
/* Excluded from this release type: ChangeStreamCursor */
/* Excluded from this release type: ChangeStreamCursorOptions */
/** @public */
export declare interface ChangeStreamDocument<TSchema extends Document = Document> {
    /**
     * The id functions as an opaque token for use when resuming an interrupted
     * change stream.
     */
    _id: InferIdType<TSchema>;
    /**
     * Describes the type of operation represented in this change notification.
     */
    operationType: 'insert' | 'update' | 'replace' | 'delete' | 'invalidate' | 'drop' | 'dropDatabase' | 'rename';
    /**
     * Contains two fields: “db” and “coll” containing the database and
     * collection name in which the change happened.
     */
    ns: {
        db: string;
        coll: string;
    };
    /**
     * Only present for ops of type ‘insert’, ‘update’, ‘replace’, and
     * ‘delete’.
     *
     * For unsharded collections this contains a single field, _id, with the
     * value of the _id of the document updated.  For sharded collections,
     * this will contain all the components of the shard key in order,
     * followed by the _id if the _id isn’t part of the shard key.
     */
    documentKey?: InferIdType<TSchema>;
    /**
     * Only present for ops of type ‘update’.
     *
     * Contains a description of updated and removed fields in this
     * operation.
     */
    updateDescription?: UpdateDescription<TSchema>;
    /**
     * Always present for operations of type ‘insert’ and ‘replace’. Also
     * present for operations of type ‘update’ if the user has specified ‘updateLookup’
     * in the ‘fullDocument’ arguments to the ‘$changeStream’ stage.
     *
     * For operations of type ‘insert’ and ‘replace’, this key will contain the
     * document being inserted, or the new version of the document that is replacing
     * the existing document, respectively.
     *
     * For operations of type ‘update’, this key will contain a copy of the full
     * version of the document from some point after the update occurred. If the
     * document was deleted since the updated happened, it will be null.
     */
    fullDocument?: TSchema;
}
/** @public */
export declare type ChangeStreamEvents = {
    resumeTokenChanged(token: ResumeToken): void;
    init(response: Document): void;
    more(response?: Document | undefined): void;
    response(): void;
    end(): void;
    error(error: Error): void;
    change(change: ChangeStreamDocument): void;
} & AbstractCursorEvents;
/**
 * Options that can be passed to a ChangeStream. Note that startAfter, resumeAfter, and startAtOperationTime are all mutually exclusive, and the server will error if more than one is specified.
 * @public
 */
export declare interface ChangeStreamOptions extends AggregateOptions {
    /** Allowed values: ‘default’, ‘updateLookup’. When set to ‘updateLookup’, the change stream will include both a delta describing the changes to the document, as well as a copy of the entire document that was changed from some time after the change occurred. */
    fullDocument?: string;
    /** The maximum amount of time for the server to wait on new documents to satisfy a change stream query. */
    maxAwaitTimeMS?: number;
    /** Allows you to start a changeStream after a specified event. See {@link https://docs.mongodb.com/master/changeStreams/#resumeafter-for-change-streams|ChangeStream documentation}. */
    resumeAfter?: ResumeToken;
    /** Similar to resumeAfter, but will allow you to start after an invalidated event. See {@link https://docs.mongodb.com/master/changeStreams/#startafter-for-change-streams|ChangeStream documentation}. */
    startAfter?: ResumeToken;
    /** Will start the changeStream after the specified operationTime. */
    startAtOperationTime?: OperationTime;
    /** The number of documents to return per batch. See {@link https://docs.mongodb.com/manual/reference/command/aggregate|aggregation documentation}. */
    batchSize?: number;
}
/** @public */
export declare interface ClientMetadata {
    driver: {
        name: string;
        version: string;
    };
    os: {
        type: string;
        name: NodeJS.Platform;
        architecture: string;
        version: string;
    };
    platform: string;
    version?: string;
    application?: {
        name: string;
    };
}
/** @public */
export declare interface ClientMetadataOptions {
    driverInfo?: {
        name?: string;
        version?: string;
        platform?: string;
    };
    appName?: string;
}
/**
 * A class representing a client session on the server
 *
 * NOTE: not meant to be instantiated directly.
 * @public
 */
export declare class ClientSession extends TypedEventEmitter<ClientSessionEvents> {
    /* Excluded from this release type: topology */
    /* Excluded from this release type: sessionPool */
    hasEnded: boolean;
    clientOptions?: MongoOptions;
    supports: {
        causalConsistency: boolean;
    };
    clusterTime?: ClusterTime;
    operationTime?: Timestamp;
    explicit: boolean;
    /* Excluded from this release type: owner */
    defaultTransactionOptions: TransactionOptions;
    transaction: Transaction;
    /*Excluded from this release type: [kServerSession]
    Excluded from this release type: [kSnapshotTime]
    Excluded from this release type: [kSnapshotEnabled]
    Excluded from this release type: __constructor
    The server id associated with this session */
    readonly id: ServerSessionId | undefined;
    readonly serverSession: ServerSession;
    /*Whether or not this session is configured for snapshot reads */
    readonly snapshotEnabled: boolean;
    /**
     * Ends this session on the server
     *
     * @param options - Optional settings. Currently reserved for future use
     * @param callback - Optional callback for completion of this operation
     */
    endSession(): Promise<void>;
    endSession(callback: Callback<void>): void;
    endSession(options: Record<string, unknown>): Promise<void>;
    endSession(options: Record<string, unknown>, callback: Callback<void>): void;
    /**
     * Advances the operationTime for a ClientSession.
     *
     * @param operationTime - the `BSON.Timestamp` of the operation type it is desired to advance to
     */
    advanceOperationTime(operationTime: Timestamp): void;
    /**
     * Used to determine if this session equals another
     *
     * @param session - The session to compare to
     */
    equals(session: ClientSession): boolean;
    /** Increment the transaction number on the internal ServerSession */
    incrementTransactionNumber(): void;
    /** @returns whether this session is currently in a transaction or not */
    inTransaction(): boolean;
    /**
     * Starts a new transaction with the given options.
     *
     * @param options - Options for the transaction
     */
    startTransaction(options?: TransactionOptions): void;
    /**
     * Commits the currently active transaction in this session.
     *
     * @param callback - An optional callback, a Promise will be returned if none is provided
     */
    commitTransaction(): Promise<Document>;
    commitTransaction(callback: Callback<Document>): void;
    /**
     * Aborts the currently active transaction in this session.
     *
     * @param callback - An optional callback, a Promise will be returned if none is provided
     */
    abortTransaction(): Promise<Document>;
    abortTransaction(callback: Callback<Document>): void;
    /**
     * This is here to ensure that ClientSession is never serialized to BSON.
     */
    toBSON(): never;
    /**
     * Runs a provided lambda within a transaction, retrying either the commit operation
     * or entire transaction as needed (and when the error permits) to better ensure that
     * the transaction can complete successfully.
     *
     * IMPORTANT: This method requires the user to return a Promise, all lambdas that do not
     * return a Promise will result in undefined behavior.
     *
     * @param fn - A lambda to run within a transaction
     * @param options - Optional settings for the transaction
     */
    withTransaction<T = void>(fn: WithTransactionCallback<T>, options?: TransactionOptions): ReturnType<typeof fn>;
}
/** @public */
export declare type ClientSessionEvents = {
    ended(session: ClientSession): void;
};
/** @public */
export declare interface ClientSessionOptions {
    /** Whether causal consistency should be enabled on this session */
    causalConsistency?: boolean;
    /** Whether all read operations should be read from the same snapshot for this session (NOTE: not compatible with `causalConsistency=true`) */
    snapshot?: boolean;
    /** The default TransactionOptions to use for transactions started on this session. */
    defaultTransactionOptions?: TransactionOptions;
}
/** @public */
export declare interface CloseOptions {
    force?: boolean;
}
/** @public */
export declare interface ClusterTime {
    clusterTime: Timestamp;
    signature: {
        hash: Binary;
        keyId: Long;
    };
}
export { Code };
/** @public */
export declare interface CollationOptions {
    locale: string;
    caseLevel?: boolean;
    caseFirst?: string;
    strength?: number;
    numericOrdering?: boolean;
    alternate?: string;
    maxVariable?: string;
    backwards?: boolean;
    normalization?: boolean;
}
/**
 * The **Collection** class is an internal class that embodies a MongoDB collection
 * allowing for insert/update/remove/find and other command operation on that MongoDB collection.
 *
 * **COLLECTION Cannot directly be instantiated**
 * @public
 *
 * @example
 * ```js
 * const MongoClient = require('mongodb').MongoClient;
 * const test = require('assert');
 * // Connection url
 * const url = 'mongodb://localhost:27017';
 * // Database Name
 * const dbName = 'test';
 * // Connect using MongoClient
 * MongoClient.connect(url, function(err, client) {
 *   // Create a collection we want to drop later
 *   const col = client.db(dbName).collection('createIndexExample1');
 *   // Show that duplicate records got dropped
 *   col.find({}).toArray(function(err, items) {
 *     expect(err).to.not.exist;
 *     test.equal(4, items.length);
 *     client.close();
 *   });
 * });
 * ```
 */
export declare class Collection<TSchema extends Document = Document> {
    /*Excluded from this release type: s
    Excluded from this release type: __constructor
    
    * The name of the database this collection belongs to
    */
    readonly dbName: string;
    /*
    * The name of this collection
    */
    readonly collectionName: string;
    /*
    * The namespace of this collection, in the format `${this.dbName}.${this.collectionName}`
    */
    readonly namespace: string;
    /*
    * The current readConcern of the collection. If not explicitly defined for
    * this collection, will be inherited from the parent DB
    */
    readonly readConcern: ReadConcern | undefined;
    /*
    * The current readPreference of the collection. If not explicitly defined for
    * this collection, will be inherited from the parent DB
    */
    readonly readPreference: ReadPreference | undefined;
    readonly bsonOptions: BSONSerializeOptions;
    /*
    * The current writeConcern of the collection. If not explicitly defined for
    * this collection, will be inherited from the parent DB
    */
    readonly writeConcern: WriteConcern | undefined;
    /*The current index hint for the collection */
    hint: Hint | undefined;
    /**
     * Inserts a single document into MongoDB. If documents passed in do not contain the **_id** field,
     * one will be added to each of the documents missing it by the driver, mutating the document. This behavior
     * can be overridden by setting the **forceServerObjectId** flag.
     *
     * @param doc - The document to insert
     * @param options - Optional settings for the command
     * @param callback - An optional callback, a Promise will be returned if none is provided
     */
    insertOne(doc: OptionalId<TSchema>): Promise<InsertOneResult<TSchema>>;
    insertOne(doc: OptionalId<TSchema>, callback: Callback<InsertOneResult<TSchema>>): void;
    insertOne(doc: OptionalId<TSchema>, options: InsertOneOptions): Promise<InsertOneResult<TSchema>>;
    insertOne(doc: OptionalId<TSchema>, options: InsertOneOptions, callback: Callback<InsertOneResult<TSchema>>): void;
    /**
     * Inserts an array of documents into MongoDB. If documents passed in do not contain the **_id** field,
     * one will be added to each of the documents missing it by the driver, mutating the document. This behavior
     * can be overridden by setting the **forceServerObjectId** flag.
     *
     * @param docs - The documents to insert
     * @param options - Optional settings for the command
     * @param callback - An optional callback, a Promise will be returned if none is provided
     */
    insertMany(docs: OptionalId<TSchema>[]): Promise<InsertManyResult<TSchema>>;
    insertMany(docs: OptionalId<TSchema>[], callback: Callback<InsertManyResult<TSchema>>): void;
    insertMany(docs: OptionalId<TSchema>[], options: BulkWriteOptions): Promise<InsertManyResult<TSchema>>;
    insertMany(docs: OptionalId<TSchema>[], options: BulkWriteOptions, callback: Callback<InsertManyResult<TSchema>>): void;
    /**
     * Perform a bulkWrite operation without a fluent API
     *
     * Legal operation types are
     *
     * ```js
     *  { insertOne: { document: { a: 1 } } }
     *
     *  { updateOne: { filter: {a:2}, update: {$set: {a:2}}, upsert:true } }
     *
     *  { updateMany: { filter: {a:2}, update: {$set: {a:2}}, upsert:true } }
     *
     *  { updateMany: { filter: {}, update: {$set: {"a.$[i].x": 5}}, arrayFilters: [{ "i.x": 5 }]} }
     *
     *  { deleteOne: { filter: {c:1} } }
     *
     *  { deleteMany: { filter: {c:1} } }
     *
     *  { replaceOne: { filter: {c:3}, replacement: {c:4}, upsert:true} }
     *```
     * Please note that raw operations are no longer accepted as of driver version 4.0.
     *
     * If documents passed in do not contain the **_id** field,
     * one will be added to each of the documents missing it by the driver, mutating the document. This behavior
     * can be overridden by setting the **forceServerObjectId** flag.
     *
     * @param operations - Bulk operations to perform
     * @param options - Optional settings for the command
     * @param callback - An optional callback, a Promise will be returned if none is provided
     * @throws MongoDriverError if operations is not an array
     */
    bulkWrite(operations: AnyBulkWriteOperation<TSchema>[]): Promise<BulkWriteResult>;
    bulkWrite(operations: AnyBulkWriteOperation<TSchema>[], callback: Callback<BulkWriteResult>): void;
    bulkWrite(operations: AnyBulkWriteOperation<TSchema>[], options: BulkWriteOptions): Promise<BulkWriteResult>;
    bulkWrite(operations: AnyBulkWriteOperation<TSchema>[], options: BulkWriteOptions, callback: Callback<BulkWriteResult>): void;
    /**
     * Update a single document in a collection
     *
     * @param filter - The filter used to select the document to update
     * @param update - The update operations to be applied to the document
     * @param options - Optional settings for the command
     * @param callback - An optional callback, a Promise will be returned if none is provided
     */
    updateOne(filter: Filter<TSchema>, update: UpdateFilter<TSchema> | Partial<TSchema>): Promise<UpdateResult | Document>;
    updateOne(filter: Filter<TSchema>, update: UpdateFilter<TSchema> | Partial<TSchema>, callback: Callback<UpdateResult | Document>): void;
    updateOne(filter: Filter<TSchema>, update: UpdateFilter<TSchema> | Partial<TSchema>, options: UpdateOptions): Promise<UpdateResult | Document>;
    updateOne(filter: Filter<TSchema>, update: UpdateFilter<TSchema> | Partial<TSchema>, options: UpdateOptions, callback: Callback<UpdateResult | Document>): void;
    /**
     * Replace a document in a collection with another document
     *
     * @param filter - The filter used to select the document to replace
     * @param replacement - The Document that replaces the matching document
     * @param options - Optional settings for the command
     * @param callback - An optional callback, a Promise will be returned if none is provided
     */
    replaceOne(filter: Filter<TSchema>, replacement: TSchema): Promise<UpdateResult | Document>;
    replaceOne(filter: Filter<TSchema>, replacement: TSchema, callback: Callback<UpdateResult | Document>): void;
    replaceOne(filter: Filter<TSchema>, replacement: TSchema, options: ReplaceOptions): Promise<UpdateResult | Document>;
    replaceOne(filter: Filter<TSchema>, replacement: TSchema, options: ReplaceOptions, callback: Callback<UpdateResult | Document>): void;
    /**
     * Update multiple documents in a collection
     *
     * @param filter - The filter used to select the documents to update
     * @param update - The update operations to be applied to the documents
     * @param options - Optional settings for the command
     * @param callback - An optional callback, a Promise will be returned if none is provided
     */
    updateMany(filter: Filter<TSchema>, update: UpdateFilter<TSchema>): Promise<UpdateResult | Document>;
    updateMany(filter: Filter<TSchema>, update: UpdateFilter<TSchema>, callback: Callback<UpdateResult | Document>): void;
    updateMany(filter: Filter<TSchema>, update: UpdateFilter<TSchema>, options: UpdateOptions): Promise<UpdateResult | Document>;
    updateMany(filter: Filter<TSchema>, update: UpdateFilter<TSchema>, options: UpdateOptions, callback: Callback<UpdateResult | Document>): void;
    /**
     * Delete a document from a collection
     *
     * @param filter - The filter used to select the document to remove
     * @param options - Optional settings for the command
     * @param callback - An optional callback, a Promise will be returned if none is provided
     */
    deleteOne(filter: Filter<TSchema>): Promise<DeleteResult>;
    deleteOne(filter: Filter<TSchema>, callback: Callback<DeleteResult>): void;
    deleteOne(filter: Filter<TSchema>, options: DeleteOptions): Promise<DeleteResult>;
    deleteOne(filter: Filter<TSchema>, options: DeleteOptions, callback?: Callback<DeleteResult>): void;
    /**
     * Delete multiple documents from a collection
     *
     * @param filter - The filter used to select the documents to remove
     * @param options - Optional settings for the command
     * @param callback - An optional callback, a Promise will be returned if none is provided
     */
    deleteMany(filter: Filter<TSchema>): Promise<DeleteResult>;
    deleteMany(filter: Filter<TSchema>, callback: Callback<DeleteResult>): void;
    deleteMany(filter: Filter<TSchema>, options: DeleteOptions): Promise<DeleteResult>;
    deleteMany(filter: Filter<TSchema>, options: DeleteOptions, callback: Callback<DeleteResult>): void;
    /**
     * Rename the collection.
     *
     * @remarks
     * This operation does not inherit options from the Db or MongoClient.
     *
     * @param newName - New name of of the collection.
     * @param options - Optional settings for the command
     * @param callback - An optional callback, a Promise will be returned if none is provided
     */
    rename(newName: string): Promise<Collection>;
    rename(newName: string, callback: Callback<Collection>): void;
    rename(newName: string, options: RenameOptions): Promise<Collection> | void;
    rename(newName: string, options: RenameOptions, callback: Callback<Collection>): void;
    /**
     * Drop the collection from the database, removing it permanently. New accesses will create a new collection.
     *
     * @param options - Optional settings for the command
     * @param callback - An optional callback, a Promise will be returned if none is provided
     */
    drop(): Promise<boolean>;
    drop(callback: Callback<boolean>): void;
    drop(options: DropCollectionOptions): Promise<boolean>;
    drop(options: DropCollectionOptions, callback: Callback<boolean>): void;
    /**
     * Fetches the first document that matches the filter
     *
     * @param filter - Query for find Operation
     * @param options - Optional settings for the command
     * @param callback - An optional callback, a Promise will be returned if none is provided
     */
    findOne(): Promise<TSchema | undefined>;
    findOne(callback: Callback<TSchema | undefined>): void;
    findOne(filter: Filter<TSchema>): Promise<TSchema | undefined>;
    findOne(filter: Filter<TSchema>, callback: Callback<TSchema | undefined>): void;
    findOne(filter: Filter<TSchema>, options: FindOptions<TSchema>): Promise<TSchema | undefined>;
    findOne(filter: Filter<TSchema>, options: FindOptions<TSchema>, callback: Callback<TSchema | undefined>): void;
    findOne<T = TSchema>(): Promise<T | undefined>;
    findOne<T = TSchema>(callback: Callback<T | undefined>): void;
    findOne<T = TSchema>(filter: Filter<T>): Promise<T | undefined>;
    findOne<T = TSchema>(filter: Filter<T>, options?: FindOptions<T>): Promise<T | undefined>;
    findOne<T = TSchema>(filter: Filter<T>, options?: FindOptions<T>, callback?: Callback<T | undefined>): void;
    /**
     * Creates a cursor for a filter that can be used to iterate over results from MongoDB
     *
     * @param filter - The filter predicate. If unspecified, then all documents in the collection will match the predicate
     */
    find(): FindCursor<TSchema>;
    find(filter: Filter<TSchema>, options?: FindOptions<TSchema>): FindCursor<TSchema>;
    find<T = TSchema>(filter: Filter<T>, options?: FindOptions<T>): FindCursor<T>;
    /**
     * Returns the options of the collection.
     *
     * @param options - Optional settings for the command
     * @param callback - An optional callback, a Promise will be returned if none is provided
     */
    options(): Promise<Document>;
    options(callback: Callback<Document>): void;
    options(options: OperationOptions): Promise<Document>;
    options(options: OperationOptions, callback: Callback<Document>): void;
    /**
     * Returns if the collection is a capped collection
     *
     * @param options - Optional settings for the command
     * @param callback - An optional callback, a Promise will be returned if none is provided
     */
    isCapped(): Promise<boolean>;
    isCapped(callback: Callback<boolean>): void;
    isCapped(options: OperationOptions): Promise<boolean>;
    isCapped(options: OperationOptions, callback: Callback<boolean>): void;
    /**
     * Creates an index on the db and collection collection.
     *
     * @param indexSpec - The field name or index specification to create an index for
     * @param options - Optional settings for the command
     * @param callback - An optional callback, a Promise will be returned if none is provided
     *
     * @example
     * ```js
     * const collection = client.db('foo').collection('bar');
     *
     * await collection.createIndex({ a: 1, b: -1 });
     *
     * // Alternate syntax for { c: 1, d: -1 } that ensures order of indexes
     * await collection.createIndex([ [c, 1], [d, -1] ]);
     *
     * // Equivalent to { e: 1 }
     * await collection.createIndex('e');
     *
     * // Equivalent to { f: 1, g: 1 }
     * await collection.createIndex(['f', 'g'])
     *
     * // Equivalent to { h: 1, i: -1 }
     * await collection.createIndex([ { h: 1 }, { i: -1 } ]);
     *
     * // Equivalent to { j: 1, k: -1, l: 2d }
     * await collection.createIndex(['j', ['k', -1], { l: '2d' }])
     * ```
     */
    createIndex(indexSpec: IndexSpecification): Promise<string>;
    createIndex(indexSpec: IndexSpecification, callback: Callback<string>): void;
    createIndex(indexSpec: IndexSpecification, options: CreateIndexesOptions): Promise<string>;
    createIndex(indexSpec: IndexSpecification, options: CreateIndexesOptions, callback: Callback<string>): void;
    /**
     * Creates multiple indexes in the collection, this method is only supported for
     * MongoDB 2.6 or higher. Earlier version of MongoDB will throw a command not supported
     * error.
     *
     * **Note**: Unlike {@link Collection#createIndex| createIndex}, this function takes in raw index specifications.
     * Index specifications are defined {@link http://docs.mongodb.org/manual/reference/command/createIndexes/| here}.
     *
     * @param indexSpecs - An array of index specifications to be created
     * @param options - Optional settings for the command
     * @param callback - An optional callback, a Promise will be returned if none is provided
     *
     * @example
     * ```js
     * const collection = client.db('foo').collection('bar');
     * await collection.createIndexes([
     *   // Simple index on field fizz
     *   {
     *     key: { fizz: 1 },
     *   }
     *   // wildcard index
     *   {
     *     key: { '$**': 1 }
     *   },
     *   // named index on darmok and jalad
     *   {
     *     key: { darmok: 1, jalad: -1 }
     *     name: 'tanagra'
     *   }
     * ]);
     * ```
     */
    createIndexes(indexSpecs: IndexDescription[]): Promise<string[]>;
    createIndexes(indexSpecs: IndexDescription[], callback: Callback<string[]>): void;
    createIndexes(indexSpecs: IndexDescription[], options: CreateIndexesOptions): Promise<string[]>;
    createIndexes(indexSpecs: IndexDescription[], options: CreateIndexesOptions, callback: Callback<string[]>): void;
    /**
     * Drops an index from this collection.
     *
     * @param indexName - Name of the index to drop.
     * @param options - Optional settings for the command
     * @param callback - An optional callback, a Promise will be returned if none is provided
     */
    dropIndex(indexName: string): Promise<Document>;
    dropIndex(indexName: string, callback: Callback<Document>): void;
    dropIndex(indexName: string, options: DropIndexesOptions): Promise<Document>;
    dropIndex(indexName: string, options: DropIndexesOptions, callback: Callback<Document>): void;
    /**
     * Drops all indexes from this collection.
     *
     * @param options - Optional settings for the command
     * @param callback - An optional callback, a Promise will be returned if none is provided
     */
    dropIndexes(): Promise<Document>;
    dropIndexes(callback: Callback<Document>): void;
    dropIndexes(options: DropIndexesOptions): Promise<Document>;
    dropIndexes(options: DropIndexesOptions, callback: Callback<Document>): void;
    /**
     * Get the list of all indexes information for the collection.
     *
     * @param options - Optional settings for the command
     */
    listIndexes(options?: ListIndexesOptions): ListIndexesCursor;
    /**
     * Checks if one or more indexes exist on the collection, fails on first non-existing index
     *
     * @param indexes - One or more index names to check.
     * @param options - Optional settings for the command
     * @param callback - An optional callback, a Promise will be returned if none is provided
     */
    indexExists(indexes: string | string[]): Promise<boolean>;
    indexExists(indexes: string | string[], callback: Callback<boolean>): void;
    indexExists(indexes: string | string[], options: IndexInformationOptions): Promise<boolean>;
    indexExists(indexes: string | string[], options: IndexInformationOptions, callback: Callback<boolean>): void;
    /**
     * Retrieves this collections index info.
     *
     * @param options - Optional settings for the command
     * @param callback - An optional callback, a Promise will be returned if none is provided
     */
    indexInformation(): Promise<Document>;
    indexInformation(callback: Callback<Document>): void;
    indexInformation(options: IndexInformationOptions): Promise<Document>;
    indexInformation(options: IndexInformationOptions, callback: Callback<Document>): void;
    /**
     * Gets an estimate of the count of documents in a collection using collection metadata.
     *
     * @param options - Optional settings for the command
     * @param callback - An optional callback, a Promise will be returned if none is provided
     */
    estimatedDocumentCount(): Promise<number>;
    estimatedDocumentCount(callback: Callback<number>): void;
    estimatedDocumentCount(options: EstimatedDocumentCountOptions): Promise<number>;
    estimatedDocumentCount(options: EstimatedDocumentCountOptions, callback: Callback<number>): void;
    /**
     * Gets the number of documents matching the filter.
     * For a fast count of the total documents in a collection see {@link Collection#estimatedDocumentCount| estimatedDocumentCount}.
     * **Note**: When migrating from {@link Collection#count| count} to {@link Collection#countDocuments| countDocuments}
     * the following query operators must be replaced:
     *
     * | Operator | Replacement |
     * | -------- | ----------- |
     * | `$where`   | [`$expr`][1] |
     * | `$near`    | [`$geoWithin`][2] with [`$center`][3] |
     * | `$nearSphere` | [`$geoWithin`][2] with [`$centerSphere`][4] |
     *
     * [1]: https://docs.mongodb.com/manual/reference/operator/query/expr/
     * [2]: https://docs.mongodb.com/manual/reference/operator/query/geoWithin/
     * [3]: https://docs.mongodb.com/manual/reference/operator/query/center/#op._S_center
     * [4]: https://docs.mongodb.com/manual/reference/operator/query/centerSphere/#op._S_centerSphere
     *
     * @param filter - The filter for the count
     * @param options - Optional settings for the command
     * @param callback - An optional callback, a Promise will be returned if none is provided
     *
     * @see https://docs.mongodb.com/manual/reference/operator/query/expr/
     * @see https://docs.mongodb.com/manual/reference/operator/query/geoWithin/
     * @see https://docs.mongodb.com/manual/reference/operator/query/center/#op._S_center
     * @see https://docs.mongodb.com/manual/reference/operator/query/centerSphere/#op._S_centerSphere
     */
    countDocuments(): Promise<number>;
    countDocuments(callback: Callback<number>): void;
    countDocuments(filter: Filter<TSchema>): Promise<number>;
    countDocuments(callback: Callback<number>): void;
    countDocuments(filter: Filter<TSchema>, options: CountDocumentsOptions): Promise<number>;
    countDocuments(filter: Filter<TSchema>, options: CountDocumentsOptions, callback: Callback<number>): void;
    countDocuments(filter: Filter<TSchema>, callback: Callback<number>): void;
    /**
     * The distinct command returns a list of distinct values for the given key across a collection.
     *
     * @param key - Field of the document to find distinct values for
     * @param filter - The filter for filtering the set of documents to which we apply the distinct filter.
     * @param options - Optional settings for the command
     * @param callback - An optional callback, a Promise will be returned if none is provided
     */
    distinct<Key extends keyof WithId<TSchema>>(key: Key): Promise<Array<Flatten<WithId<TSchema>[Key]>>>;
    distinct<Key extends keyof WithId<TSchema>>(key: Key, callback: Callback<Array<Flatten<WithId<TSchema>[Key]>>>): void;
    distinct<Key extends keyof WithId<TSchema>>(key: Key, filter: Filter<TSchema>): Promise<Array<Flatten<WithId<TSchema>[Key]>>>;
    distinct<Key extends keyof WithId<TSchema>>(key: Key, filter: Filter<TSchema>, callback: Callback<Array<Flatten<WithId<TSchema>[Key]>>>): void;
    distinct<Key extends keyof WithId<TSchema>>(key: Key, filter: Filter<TSchema>, options: DistinctOptions): Promise<Array<Flatten<WithId<TSchema>[Key]>>>;
    distinct<Key extends keyof WithId<TSchema>>(key: Key, filter: Filter<TSchema>, options: DistinctOptions, callback: Callback<Array<Flatten<WithId<TSchema>[Key]>>>): void;
    distinct(key: string): Promise<any[]>;
    distinct(key: string, callback: Callback<any[]>): void;
    distinct(key: string, filter: Filter<TSchema>): Promise<any[]>;
    distinct(key: string, filter: Filter<TSchema>, callback: Callback<any[]>): void;
    distinct(key: string, filter: Filter<TSchema>, options: DistinctOptions): Promise<any[]>;
    distinct(key: string, filter: Filter<TSchema>, options: DistinctOptions, callback: Callback<any[]>): void;
    /**
     * Retrieve all the indexes on the collection.
     *
     * @param options - Optional settings for the command
     * @param callback - An optional callback, a Promise will be returned if none is provided
     */
    indexes(): Promise<Document>;
    indexes(callback: Callback<Document>): void;
    indexes(options: IndexInformationOptions): Promise<Document>;
    indexes(options: IndexInformationOptions, callback: Callback<Document>): void;
    /**
     * Get all the collection statistics.
     *
     * @param options - Optional settings for the command
     * @param callback - An optional callback, a Promise will be returned if none is provided
     */
    stats(): Promise<CollStats>;
    stats(callback: Callback<CollStats>): void;
    stats(options: CollStatsOptions): Promise<CollStats>;
    stats(options: CollStatsOptions, callback: Callback<CollStats>): void;
    /**
     * Find a document and delete it in one atomic operation. Requires a write lock for the duration of the operation.
     *
     * @param filter - The filter used to select the document to remove
     * @param options - Optional settings for the command
     * @param callback - An optional callback, a Promise will be returned if none is provided
     */
    findOneAndDelete(filter: Filter<TSchema>): Promise<ModifyResult<TSchema>>;
    findOneAndDelete(filter: Filter<TSchema>, callback: Callback<ModifyResult<TSchema>>): void;
    findOneAndDelete(filter: Filter<TSchema>, options: FindOneAndDeleteOptions): Promise<ModifyResult<TSchema>>;
    findOneAndDelete(filter: Filter<TSchema>, options: FindOneAndDeleteOptions, callback: Callback<ModifyResult<TSchema>>): void;
    /**
     * Find a document and replace it in one atomic operation. Requires a write lock for the duration of the operation.
     *
     * @param filter - The filter used to select the document to replace
     * @param replacement - The Document that replaces the matching document
     * @param options - Optional settings for the command
     * @param callback - An optional callback, a Promise will be returned if none is provided
     */
    findOneAndReplace(filter: Filter<TSchema>, replacement: Document): Promise<ModifyResult<TSchema>>;
    findOneAndReplace(filter: Filter<TSchema>, replacement: Document, callback: Callback<ModifyResult<TSchema>>): void;
    findOneAndReplace(filter: Filter<TSchema>, replacement: Document, options: FindOneAndReplaceOptions): Promise<ModifyResult<TSchema>>;
    findOneAndReplace(filter: Filter<TSchema>, replacement: Document, options: FindOneAndReplaceOptions, callback: Callback<ModifyResult<TSchema>>): void;
    /**
     * Find a document and update it in one atomic operation. Requires a write lock for the duration of the operation.
     *
     * @param filter - The filter used to select the document to update
     * @param update - Update operations to be performed on the document
     * @param options - Optional settings for the command
     * @param callback - An optional callback, a Promise will be returned if none is provided
     */
    findOneAndUpdate(filter: Filter<TSchema>, update: UpdateFilter<TSchema>): Promise<ModifyResult<TSchema>>;
    findOneAndUpdate(filter: Filter<TSchema>, update: UpdateFilter<TSchema>, callback: Callback<ModifyResult<TSchema>>): void;
    findOneAndUpdate(filter: Filter<TSchema>, update: UpdateFilter<TSchema>, options: FindOneAndUpdateOptions): Promise<ModifyResult<TSchema>>;
    findOneAndUpdate(filter: Filter<TSchema>, update: UpdateFilter<TSchema>, options: FindOneAndUpdateOptions, callback: Callback<ModifyResult<TSchema>>): void;
    /**
     * Execute an aggregation framework pipeline against the collection, needs MongoDB \>= 2.2
     *
     * @param pipeline - An array of aggregation pipelines to execute
     * @param options - Optional settings for the command
     */
    aggregate<T = TSchema>(pipeline?: Document[], options?: AggregateOptions): AggregationCursor<T>;
    /**
     * Create a new Change Stream, watching for new changes (insertions, updates, replacements, deletions, and invalidations) in this collection.
     *
     * @since 3.0.0
     * @param pipeline - An array of {@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline/|aggregation pipeline stages} through which to pass change stream documents. This allows for filtering (using $match) and manipulating the change stream documents.
     * @param options - Optional settings for the command
     */
    watch<TLocal = TSchema>(pipeline?: Document[], options?: ChangeStreamOptions): ChangeStream<TLocal>;
    /**
     * Run Map Reduce across a collection. Be aware that the inline option for out will return an array of results not a collection.
     *
     * @param map - The mapping function.
     * @param reduce - The reduce function.
     * @param options - Optional settings for the command
     * @param callback - An optional callback, a Promise will be returned if none is provided
     */
    mapReduce<TKey = any, TValue = any>(map: string | MapFunction<TSchema>, reduce: string | ReduceFunction<TKey, TValue>): Promise<Document | Document[]>;
    mapReduce<TKey = any, TValue = any>(map: string | MapFunction<TSchema>, reduce: string | ReduceFunction<TKey, TValue>, callback: Callback<Document | Document[]>): void;
    mapReduce<TKey = any, TValue = any>(map: string | MapFunction<TSchema>, reduce: string | ReduceFunction<TKey, TValue>, options: MapReduceOptions<TKey, TValue>): Promise<Document | Document[]>;
    mapReduce<TKey = any, TValue = any>(map: string | MapFunction<TSchema>, reduce: string | ReduceFunction<TKey, TValue>, options: MapReduceOptions<TKey, TValue>, callback: Callback<Document | Document[]>): void;
    /** Initiate an Out of order batch write operation. All operations will be buffered into insert/update/remove commands executed out of order. */
    initializeUnorderedBulkOp(options?: BulkWriteOptions): UnorderedBulkOperation;
    /** Initiate an In order bulk write operation. Operations will be serially executed in the order they are added, creating a new operation for each switch in types. */
    initializeOrderedBulkOp(options?: BulkWriteOptions): OrderedBulkOperation;
    /** Get the db scoped logger */
    getLogger(): Logger;
    readonly logger: Logger;
    /**
     * Inserts a single document or a an array of documents into MongoDB. If documents passed in do not contain the **_id** field,
     * one will be added to each of the documents missing it by the driver, mutating the document. This behavior
     * can be overridden by setting the **forceServerObjectId** flag.
     *
     * @deprecated Use insertOne, insertMany or bulkWrite instead.
     * @param docs - The documents to insert
     * @param options - Optional settings for the command
     * @param callback - An optional callback, a Promise will be returned if none is provided
     */
    insert(docs: OptionalId<TSchema>[], options: BulkWriteOptions, callback: Callback<InsertManyResult<TSchema>>): Promise<InsertManyResult<TSchema>> | void;
    /**
     * Updates documents.
     *
     * @deprecated use updateOne, updateMany or bulkWrite
     * @param selector - The selector for the update operation.
     * @param update - The update operations to be applied to the documents
     * @param options - Optional settings for the command
     * @param callback - An optional callback, a Promise will be returned if none is provided
     */
    update(selector: Filter<TSchema>, update: UpdateFilter<TSchema>, options: UpdateOptions, callback: Callback<Document>): Promise<UpdateResult> | void;
    /**
     * Remove documents.
     *
     * @deprecated use deleteOne, deleteMany or bulkWrite
     * @param selector - The selector for the update operation.
     * @param options - Optional settings for the command
     * @param callback - An optional callback, a Promise will be returned if none is provided
     */
    remove(selector: Filter<TSchema>, options: DeleteOptions, callback: Callback): Promise<DeleteResult> | void;
    /**
     * An estimated count of matching documents in the db to a filter.
     *
     * **NOTE:** This method has been deprecated, since it does not provide an accurate count of the documents
     * in a collection. To obtain an accurate count of documents in the collection, use {@link Collection#countDocuments| countDocuments}.
     * To obtain an estimated count of all documents in the collection, use {@link Collection#estimatedDocumentCount| estimatedDocumentCount}.
     *
     * @deprecated use {@link Collection#countDocuments| countDocuments} or {@link Collection#estimatedDocumentCount| estimatedDocumentCount} instead
     *
     * @param filter - The filter for the count.
     * @param options - Optional settings for the command
     * @param callback - An optional callback, a Promise will be returned if none is provided
     */
    count(): Promise<number>;
    count(callback: Callback<number>): void;
    count(filter: Filter<TSchema>): Promise<number>;
    count(filter: Filter<TSchema>, callback: Callback<number>): void;
    count(filter: Filter<TSchema>, options: CountOptions): Promise<number>;
    count(filter: Filter<TSchema>, options: CountOptions, callback: Callback<number>): Promise<number> | void;
}
/** @public */
export declare interface CollectionInfo extends Document {
    name: string;
    type?: string;
    options?: Document;
    info?: {
        readOnly?: false;
        uuid?: Binary;
    };
    idIndex?: Document;
}
/** @public */
export declare interface CollectionOptions extends BSONSerializeOptions, WriteConcernOptions, LoggerOptions {
    slaveOk?: boolean;
    /** Specify a read concern for the collection. (only MongoDB 3.2 or higher supported) */
    readConcern?: ReadConcernLike;
    /** The preferred read preference (ReadPreference.PRIMARY, ReadPreference.PRIMARY_PREFERRED, ReadPreference.SECONDARY, ReadPreference.SECONDARY_PREFERRED, ReadPreference.NEAREST). */
    readPreference?: ReadPreferenceLike;
}
/* Excluded from this release type: CollectionPrivate */
/**
 * @public
 * @see https://docs.mongodb.org/manual/reference/command/collStats/
 */
export declare interface CollStats extends Document {
    /** Namespace */
    ns: string;
    /** Number of documents */
    count: number;
    /** Collection size in bytes */
    size: number;
    /** Average object size in bytes */
    avgObjSize: number;
    /** (Pre)allocated space for the collection in bytes */
    storageSize: number;
    /** Number of extents (contiguously allocated chunks of datafile space) */
    numExtents: number;
    /** Number of indexes */
    nindexes: number;
    /** Size of the most recently created extent in bytes */
    lastExtentSize: number;
    /** Padding can speed up updates if documents grow */
    paddingFactor: number;
    /** A number that indicates the user-set flags on the collection. userFlags only appears when using the mmapv1 storage engine */
    userFlags?: number;
    /** Total index size in bytes */
    totalIndexSize: number;
    /** Size of specific indexes in bytes */
    indexSizes: {
        _id_: number;
        [index: string]: number;
    };
    /** `true` if the collection is capped */
    capped: boolean;
    /** The maximum number of documents that may be present in a capped collection */
    max: number;
    /** The maximum size of a capped collection */
    maxSize: number;
    /** This document contains data reported directly by the WiredTiger engine and other data for internal diagnostic use */
    wiredTiger?: WiredTigerData;
    /** The fields in this document are the names of the indexes, while the values themselves are documents that contain statistics for the index provided by the storage engine */
    indexDetails?: any;
    ok: number;
    /** The amount of storage available for reuse. The scale argument affects this value. */
    freeStorageSize?: number;
    /** An array that contains the names of the indexes that are currently being built on the collection */
    indexBuilds?: number;
    /** The sum of the storageSize and totalIndexSize. The scale argument affects this value */
    totalSize: number;
    /** The scale value used by the command. */
    scaleFactor: number;
}
/** @public */
export declare interface CollStatsOptions extends CommandOperationOptions {
    /** Divide the returned sizes by scale value. */
    scale?: number;
}
/**
 * An event indicating the failure of a given command
 * @public
 * @category Event
 */
export declare class CommandFailedEvent {
    address: string;
    connectionId?: string | number;
    requestId: number;
    duration: number;
    commandName: string;
    failure: Error;
}
/* Excluded from this release type: CommandOperation */
/** @public */
export declare interface CommandOperationOptions extends OperationOptions, WriteConcernOptions, ExplainOptions {
    /** Return the full server response for the command */
    fullResponse?: boolean;
    /** Specify a read concern and level for the collection. (only MongoDB 3.2 or higher supported) */
    readConcern?: ReadConcernLike;
    /** Collation */
    collation?: CollationOptions;
    maxTimeMS?: number;
    /** A user-provided comment to attach to this command */
    comment?: string | Document;
    /** Should retry failed writes */
    retryWrites?: boolean;
    dbName?: string;
    authdb?: string;
    noResponse?: boolean;
}
/** @public */
export declare interface CommandOptions extends BSONSerializeOptions {
    command?: boolean;
    slaveOk?: boolean;
    /** Specify read preference if command supports it */
    readPreference?: ReadPreferenceLike;
    raw?: boolean;
    monitoring?: boolean;
    fullResult?: boolean;
    socketTimeoutMS?: number;
    /** Session to use for the operation */
    session?: ClientSession;
    documentsReturnedIn?: string;
    noResponse?: boolean;
    willRetryWrite?: boolean;
    writeConcern?: WriteConcernOptions | WriteConcern | W;
}
/**
 * An event indicating the start of a given
 * @public
 * @category Event
 */
export declare class CommandStartedEvent {
    commandObj?: Document;
    requestId: number;
    databaseName: string;
    commandName: string;
    command: Document;
    address: string;
    connectionId?: string | number;
}
/**
 * An event indicating the success of a given command
 * @public
 * @category Event
 */
export declare class CommandSucceededEvent {
    address: string;
    connectionId?: string | number;
    requestId: number;
    duration: number;
    commandName: string;
    reply: unknown;
}
/** @public */
export declare type CommonEvents = 'newListener' | 'removeListener';
/** @public */
export declare const Compressor: Readonly<{
    readonly none: 0;
    readonly snappy: 1;
    readonly zlib: 2;
}>;
/** @public */
export declare type Compressor = typeof Compressor[CompressorName];
/** @public */
export declare type CompressorName = keyof typeof Compressor;
/** @public */
export declare type Condition<T> = AlternativeType<T> | FilterOperators<AlternativeType<T>>;
/* Excluded from this release type: Connection */
/**
 * An event published when a connection is checked into the connection pool
 * @public
 * @category Event
 */
export declare class ConnectionCheckedInEvent extends ConnectionPoolMonitoringEvent {
    /** The id of the connection */
    connectionId: number | '<monitor>';
}
/**
 * An event published when a connection is checked out of the connection pool
 * @public
 * @category Event
 */
export declare class ConnectionCheckedOutEvent extends ConnectionPoolMonitoringEvent {
    /** The id of the connection */
    connectionId: number | '<monitor>';
}
/**
 * An event published when a request to check a connection out fails
 * @public
 * @category Event
 */
export declare class ConnectionCheckOutFailedEvent extends ConnectionPoolMonitoringEvent {
    /** The reason the attempt to check out failed */
    reason: AnyError | string;
}
/**
 * An event published when a request to check a connection out begins
 * @public
 * @category Event
 */
export declare class ConnectionCheckOutStartedEvent extends ConnectionPoolMonitoringEvent {
}
/**
 * An event published when a connection is closed
 * @public
 * @category Event
 */
export declare class ConnectionClosedEvent extends ConnectionPoolMonitoringEvent {
    /** The id of the connection */
    connectionId: number | '<monitor>';
    /** The reason the connection was closed */
    reason: string;
}
/**
 * An event published when a connection pool creates a new connection
 * @public
 * @category Event
 */
export declare class ConnectionCreatedEvent extends ConnectionPoolMonitoringEvent {
    /** A monotonically increasing, per-pool id for the newly created connection */
    connectionId: number | '<monitor>';
}
/** @public */
export declare type ConnectionEvents = {
    commandStarted(event: CommandStartedEvent): void;
    commandSucceeded(event: CommandSucceededEvent): void;
    commandFailed(event: CommandFailedEvent): void;
    clusterTimeReceived(clusterTime: Document): void;
    close(): void;
    message(message: any): void;
};
/** @public */
export declare interface ConnectionOptions extends SupportedNodeConnectionOptions, StreamDescriptionOptions {
    id: number | '<monitor>';
    generation: number;
    hostAddress: HostAddress;
    autoEncrypter?: AutoEncrypter;
    serverApi?: ServerApi;
    monitorCommands: boolean;
    /* Excluded from this release type: connectionType */
    credentials?: MongoCredentials;
    connectTimeoutMS?: number;
    tls: boolean;
    keepAlive?: boolean;
    keepAliveInitialDelay?: number;
    noDelay?: boolean;
    socketTimeoutMS?: number;
    cancellationToken?: CancellationToken;
    metadata: ClientMetadata;
}
/* Excluded from this release type: ConnectionPool */
/**
 * An event published when a connection pool is cleared
 * @public
 * @category Event
 */
export declare class ConnectionPoolClearedEvent extends ConnectionPoolMonitoringEvent {
}
/**
 * An event published when a connection pool is closed
 * @public
 * @category Event
 */
export declare class ConnectionPoolClosedEvent extends ConnectionPoolMonitoringEvent {
}
/**
 * An event published when a connection pool is created
 * @public
 * @category Event
 */
export declare class ConnectionPoolCreatedEvent extends ConnectionPoolMonitoringEvent {
    /** The options used to create this connection pool */
    options?: ConnectionPoolOptions;
}
/** @public */
export declare type ConnectionPoolEvents = {
    connectionPoolCreated(event: ConnectionPoolCreatedEvent): void;
    connectionPoolClosed(event: ConnectionPoolClosedEvent): void;
    connectionPoolCleared(event: ConnectionPoolClearedEvent): void;
    connectionCreated(event: ConnectionCreatedEvent): void;
    connectionReady(event: ConnectionReadyEvent): void;
    connectionClosed(event: ConnectionClosedEvent): void;
    connectionCheckOutStarted(event: ConnectionCheckOutStartedEvent): void;
    connectionCheckOutFailed(event: ConnectionCheckOutFailedEvent): void;
    connectionCheckedOut(event: ConnectionCheckedOutEvent): void;
    connectionCheckedIn(event: ConnectionCheckedInEvent): void;
} & Pick<ConnectionEvents, Exclude<keyof ConnectionEvents, 'close' | 'message'>>;
/**
 * The base export class for all monitoring events published from the connection pool
 * @public
 * @category Event
 */
export declare class ConnectionPoolMonitoringEvent {
    /** A timestamp when the event was created  */
    time: Date;
    /** The address (host/port pair) of the pool */
    address: string;
}
/** @public */
export declare interface ConnectionPoolOptions extends Pick<ConnectionOptions, Exclude<keyof ConnectionOptions, 'id' | 'generation'>> {
    /** The maximum number of connections that may be associated with a pool at a given time. This includes in use and available connections. */
    maxPoolSize: number;
    /** The minimum number of connections that MUST exist at any moment in a single connection pool. */
    minPoolSize: number;
    /** The maximum amount of time a connection should remain idle in the connection pool before being marked idle. */
    maxIdleTimeMS: number;
    /** The maximum amount of time operation execution should wait for a connection to become available. The default is 0 which means there is no limit. */
    waitQueueTimeoutMS: number;
}
/**
 * An event published when a connection is ready for use
 * @public
 * @category Event
 */
export declare class ConnectionReadyEvent extends ConnectionPoolMonitoringEvent {
    /** The id of the connection */
    connectionId: number | '<monitor>';
}
/** @public */
export declare interface ConnectOptions {
    readPreference?: ReadPreference;
}
/** @public */
export declare interface CountDocumentsOptions extends AggregateOptions {
    /** The number of documents to skip. */
    skip?: number;
    /** The maximum amounts to count before aborting. */
    limit?: number;
}
/** @public */
export declare interface CountOptions extends CommandOperationOptions {
    /** The number of documents to skip. */
    skip?: number;
    /** The maximum amounts to count before aborting. */
    limit?: number;
    /** Number of milliseconds to wait before aborting the query. */
    maxTimeMS?: number;
    /** An index name hint for the query. */
    hint?: string | Document;
}
/** @public */
export declare interface CreateCollectionOptions extends CommandOperationOptions {
    /** Returns an error if the collection does not exist */
    strict?: boolean;
    /** Create a capped collection */
    capped?: boolean;
    /** @deprecated Create an index on the _id field of the document, True by default on MongoDB 2.6 - 3.0 */
    autoIndexId?: boolean;
    /** The size of the capped collection in bytes */
    size?: number;
    /** The maximum number of documents in the capped collection */
    max?: number;
    /** Available for the MMAPv1 storage engine only to set the usePowerOf2Sizes and the noPadding flag */
    flags?: number;
    /** Allows users to specify configuration to the storage engine on a per-collection basis when creating a collection on MongoDB 3.0 or higher */
    storageEngine?: Document;
    /** Allows users to specify validation rules or expressions for the collection. For more information, see Document Validation on MongoDB 3.2 or higher */
    validator?: Document;
    /** Determines how strictly MongoDB applies the validation rules to existing documents during an update on MongoDB 3.2 or higher */
    validationLevel?: string;
    /** Determines whether to error on invalid documents or just warn about the violations but allow invalid documents to be inserted on MongoDB 3.2 or higher */
    validationAction?: string;
    /** Allows users to specify a default configuration for indexes when creating a collection on MongoDB 3.2 or higher */
    indexOptionDefaults?: Document;
    /** The name of the source collection or view from which to create the view. The name is not the full namespace of the collection or view; i.e. does not include the database name and implies the same database as the view to create on MongoDB 3.4 or higher */
    viewOn?: string;
    /** An array that consists of the aggregation pipeline stage. Creates the view by applying the specified pipeline to the viewOn collection or view on MongoDB 3.4 or higher */
    pipeline?: Document[];
    /** A primary key factory function for generation of custom _id keys. */
    pkFactory?: PkFactory;
    /** A document specifying configuration options for timeseries collections. */
    timeseries?: TimeSeriesCollectionOptions;
    /** The number of seconds after which a document in a timeseries collection expires. */
    expireAfterSeconds?: number;
}
/** @public */
export declare interface CreateIndexesOptions extends CommandOperationOptions {
    /** Creates the index in the background, yielding whenever possible. */
    background?: boolean;
    /** Creates an unique index. */
    unique?: boolean;
    /** Override the autogenerated index name (useful if the resulting name is larger than 128 bytes) */
    name?: string;
    /** Creates a partial index based on the given filter object (MongoDB 3.2 or higher) */
    partialFilterExpression?: Document;
    /** Creates a sparse index. */
    sparse?: boolean;
    /** Allows you to expire data on indexes applied to a data (MongoDB 2.2 or higher) */
    expireAfterSeconds?: number;
    storageEngine?: Document;
    /** (MongoDB 4.4. or higher) Specifies how many data-bearing members of a replica set, including the primary, must complete the index builds successfully before the primary marks the indexes as ready. This option accepts the same values for the "w" field in a write concern plus "votingMembers", which indicates all voting data-bearing nodes. */
    commitQuorum?: number | string;
    weights?: Document;
    default_language?: string;
    language_override?: string;
    textIndexVersion?: number;
    '2dsphereIndexVersion'?: number;
    bits?: number;
    /** For geospatial indexes set the lower bound for the co-ordinates. */
    min?: number;
    /** For geospatial indexes set the high bound for the co-ordinates. */
    max?: number;
    bucketSize?: number;
    wildcardProjection?: Document;
}
/** @public */
export declare const CURSOR_FLAGS: readonly [
    "tailable",
    "oplogReplay",
    "noCursorTimeout",
    "awaitData",
    "exhaust",
    "partial"
];
/** @public */
export declare interface CursorCloseOptions {
    /** Bypass calling killCursors when closing the cursor. */
    skipKillCursors?: boolean;
}
/** @public */
export declare type CursorFlag = typeof CURSOR_FLAGS[number];
/** @public */
export declare interface CursorStreamOptions {
    /** A transformation method applied to each document emitted by the stream */
    transform?(doc: Document): Document;
}
/**
 * The **Db** class is a class that represents a MongoDB Database.
 * @public
 *
 * @example
 * ```js
 * const { MongoClient } = require('mongodb');
 * // Connection url
 * const url = 'mongodb://localhost:27017';
 * // Database Name
 * const dbName = 'test';
 * // Connect using MongoClient
 * MongoClient.connect(url, function(err, client) {
 *   // Select the database by name
 *   const testDb = client.db(dbName);
 *   client.close();
 * });
 * ```
 */
export declare class Db {
    /* Excluded from this release type: s */
    static SYSTEM_NAMESPACE_COLLECTION: string;
    static SYSTEM_INDEX_COLLECTION: string;
    static SYSTEM_PROFILE_COLLECTION: string;
    static SYSTEM_USER_COLLECTION: string;
    static SYSTEM_COMMAND_COLLECTION: string;
    static SYSTEM_JS_COLLECTION: string;
    /**
     * Creates a new Db instance
     *
     * @param client - The MongoClient for the database.
     * @param databaseName - The name of the database this instance represents.
     * @param options - Optional settings for Db construction
     */
    constructor(client: MongoClient, databaseName: string, options?: DbOptions);
    readonly databaseName: string;
    readonly options: DbOptions | undefined;
    readonly slaveOk: boolean;
    readonly readConcern: ReadConcern | undefined;
    /*
    * The current readPreference of the Db. If not explicitly defined for
    * this Db, will be inherited from the parent MongoClient
    */
    readonly readPreference: ReadPreference;
    readonly bsonOptions: BSONSerializeOptions;
    readonly writeConcern: WriteConcern | undefined;
    readonly namespace: string;
    /**
     * Create a new collection on a server with the specified options. Use this to create capped collections.
     * More information about command options available at https://docs.mongodb.com/manual/reference/command/create/
     *
     * @param name - The name of the collection to create
     * @param options - Optional settings for the command
     * @param callback - An optional callback, a Promise will be returned if none is provided
     */
    createCollection<TSchema extends Document = Document>(name: string): Promise<Collection<TSchema>>;
    createCollection<TSchema extends Document = Document>(name: string, callback: Callback<Collection<TSchema>>): void;
    createCollection<TSchema extends Document = Document>(name: string, options: CreateCollectionOptions): Promise<Collection<TSchema>>;
    createCollection<TSchema extends Document = Document>(name: string, options: CreateCollectionOptions, callback: Callback<Collection<TSchema>>): void;
    /**
     * Execute a command
     *
     * @remarks
     * This command does not inherit options from the MongoClient.
     *
     * @param command - The command to run
     * @param options - Optional settings for the command
     * @param callback - An optional callback, a Promise will be returned if none is provided
     */
    command(command: Document): Promise<Document>;
    command(command: Document, callback: Callback<Document>): void;
    command(command: Document, options: RunCommandOptions): Promise<Document>;
    command(command: Document, options: RunCommandOptions, callback: Callback<Document>): void;
    /**
     * Execute an aggregation framework pipeline against the database, needs MongoDB \>= 3.6
     *
     * @param pipeline - An array of aggregation stages to be executed
     * @param options - Optional settings for the command
     */
    aggregate(pipeline?: Document[], options?: AggregateOptions): AggregationCursor;
    /** Return the Admin db instance */
    admin(): Admin;
    /**
     * Returns a reference to a MongoDB Collection. If it does not exist it will be created implicitly.
     *
     * @param name - the collection name we wish to access.
     * @returns return the new Collection instance
     */
    collection<TSchema extends Document = Document>(name: string): Collection<TSchema>;
    /**
     * Get all the db statistics.
     *
     * @param options - Optional settings for the command
     * @param callback - An optional callback, a Promise will be returned if none is provided
     */
    stats(): Promise<Document>;
    stats(callback: Callback<Document>): void;
    stats(options: DbStatsOptions): Promise<Document>;
    stats(options: DbStatsOptions, callback: Callback<Document>): void;
    /**
     * List all collections of this database with optional filter
     *
     * @param filter - Query to filter collections by
     * @param options - Optional settings for the command
     */
    listCollections(filter: Document, options: Exclude<ListCollectionsOptions, 'nameOnly'> & {
        nameOnly: true;
    }): ListCollectionsCursor<Pick<CollectionInfo, 'name' | 'type'>>;
    listCollections(filter: Document, options: Exclude<ListCollectionsOptions, 'nameOnly'> & {
        nameOnly: false;
    }): ListCollectionsCursor<CollectionInfo>;
    listCollections<T extends Pick<CollectionInfo, 'name' | 'type'> | CollectionInfo = Pick<CollectionInfo, 'name' | 'type'> | CollectionInfo>(filter?: Document, options?: ListCollectionsOptions): ListCollectionsCursor<T>;
    /**
     * Rename a collection.
     *
     * @remarks
     * This operation does not inherit options from the MongoClient.
     *
     * @param fromCollection - Name of current collection to rename
     * @param toCollection - New name of of the collection
     * @param options - Optional settings for the command
     * @param callback - An optional callback, a Promise will be returned if none is provided
     */
    renameCollection<TSchema extends Document = Document>(fromCollection: string, toCollection: string): Promise<Collection<TSchema>>;
    renameCollection<TSchema extends Document = Document>(fromCollection: string, toCollection: string, callback: Callback<Collection<TSchema>>): void;
    renameCollection<TSchema extends Document = Document>(fromCollection: string, toCollection: string, options: RenameOptions): Promise<Collection<TSchema>>;
    renameCollection<TSchema extends Document = Document>(fromCollection: string, toCollection: string, options: RenameOptions, callback: Callback<Collection<TSchema>>): void;
    /**
     * Drop a collection from the database, removing it permanently. New accesses will create a new collection.
     *
     * @param name - Name of collection to drop
     * @param options - Optional settings for the command
     * @param callback - An optional callback, a Promise will be returned if none is provided
     */
    dropCollection(name: string): Promise<boolean>;
    dropCollection(name: string, callback: Callback<boolean>): void;
    dropCollection(name: string, options: DropCollectionOptions): Promise<boolean>;
    dropCollection(name: string, options: DropCollectionOptions, callback: Callback<boolean>): void;
    /**
     * Drop a database, removing it permanently from the server.
     *
     * @param options - Optional settings for the command
     * @param callback - An optional callback, a Promise will be returned if none is provided
     */
    dropDatabase(): Promise<boolean>;
    dropDatabase(callback: Callback<boolean>): void;
    dropDatabase(options: DropDatabaseOptions): Promise<boolean>;
    dropDatabase(options: DropDatabaseOptions, callback: Callback<boolean>): void;
    /**
     * Fetch all collections for the current db.
     *
     * @param options - Optional settings for the command
     * @param callback - An optional callback, a Promise will be returned if none is provided
     */
    collections(): Promise<Collection[]>;
    collections(callback: Callback<Collection[]>): void;
    collections(options: ListCollectionsOptions): Promise<Collection[]>;
    collections(options: ListCollectionsOptions, callback: Callback<Collection[]>): void;
    /**
     * Creates an index on the db and collection.
     *
     * @param name - Name of the collection to create the index on.
     * @param indexSpec - Specify the field to index, or an index specification
     * @param options - Optional settings for the command
     * @param callback - An optional callback, a Promise will be returned if none is provided
     */
    createIndex(name: string, indexSpec: IndexSpecification): Promise<string>;
    createIndex(name: string, indexSpec: IndexSpecification, callback?: Callback<string>): void;
    createIndex(name: string, indexSpec: IndexSpecification, options: CreateIndexesOptions): Promise<string>;
    createIndex(name: string, indexSpec: IndexSpecification, options: CreateIndexesOptions, callback: Callback<string>): void;
    /**
     * Add a user to the database
     *
     * @param username - The username for the new user
     * @param password - An optional password for the new user
     * @param options - Optional settings for the command
     * @param callback - An optional callback, a Promise will be returned if none is provided
     */
    addUser(username: string): Promise<Document>;
    addUser(username: string, callback: Callback<Document>): void;
    addUser(username: string, password: string): Promise<Document>;
    addUser(username: string, password: string, callback: Callback<Document>): void;
    addUser(username: string, options: AddUserOptions): Promise<Document>;
    addUser(username: string, options: AddUserOptions, callback: Callback<Document>): void;
    addUser(username: string, password: string, options: AddUserOptions): Promise<Document>;
    addUser(username: string, password: string, options: AddUserOptions, callback: Callback<Document>): void;
    /**
     * Remove a user from a database
     *
     * @param username - The username to remove
     * @param options - Optional settings for the command
     * @param callback - An optional callback, a Promise will be returned if none is provided
     */
    removeUser(username: string): Promise<boolean>;
    removeUser(username: string, callback: Callback<boolean>): void;
    removeUser(username: string, options: RemoveUserOptions): Promise<boolean>;
    removeUser(username: string, options: RemoveUserOptions, callback: Callback<boolean>): void;
    /**
     * Set the current profiling level of MongoDB
     *
     * @param level - The new profiling level (off, slow_only, all).
     * @param options - Optional settings for the command
     * @param callback - An optional callback, a Promise will be returned if none is provided
     */
    setProfilingLevel(level: ProfilingLevel): Promise<ProfilingLevel>;
    setProfilingLevel(level: ProfilingLevel, callback: Callback<ProfilingLevel>): void;
    setProfilingLevel(level: ProfilingLevel, options: SetProfilingLevelOptions): Promise<ProfilingLevel>;
    setProfilingLevel(level: ProfilingLevel, options: SetProfilingLevelOptions, callback: Callback<ProfilingLevel>): void;
    /**
     * Retrieve the current profiling Level for MongoDB
     *
     * @param options - Optional settings for the command
     * @param callback - An optional callback, a Promise will be returned if none is provided
     */
    profilingLevel(): Promise<string>;
    profilingLevel(callback: Callback<string>): void;
    profilingLevel(options: ProfilingLevelOptions): Promise<string>;
    profilingLevel(options: ProfilingLevelOptions, callback: Callback<string>): void;
    /**
     * Retrieves this collections index info.
     *
     * @param name - The name of the collection.
     * @param options - Optional settings for the command
     * @param callback - An optional callback, a Promise will be returned if none is provided
     */
    indexInformation(name: string): Promise<Document>;
    indexInformation(name: string, callback: Callback<Document>): void;
    indexInformation(name: string, options: IndexInformationOptions): Promise<Document>;
    indexInformation(name: string, options: IndexInformationOptions, callback: Callback<Document>): void;
    /** Unref all sockets */
    unref(): void;
    /**
     * Create a new Change Stream, watching for new changes (insertions, updates,
     * replacements, deletions, and invalidations) in this database. Will ignore all
     * changes to system collections.
     *
     * @param pipeline - An array of {@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline/|aggregation pipeline stages} through which to pass change stream documents. This allows for filtering (using $match) and manipulating the change stream documents.
     * @param options - Optional settings for the command
     */
    watch<TSchema = Document>(pipeline?: Document[], options?: ChangeStreamOptions): ChangeStream<TSchema>;
    /** Return the db logger */
    getLogger(): Logger;
    readonly logger: Logger;
}
/* Excluded from this release type: DB_AGGREGATE_COLLECTION */
/** @public */
export declare interface DbOptions extends BSONSerializeOptions, WriteConcernOptions, LoggerOptions {
    /** If the database authentication is dependent on another databaseName. */
    authSource?: string;
    /** Force server to assign _id values instead of driver. */
    forceServerObjectId?: boolean;
    /** The preferred read preference (ReadPreference.PRIMARY, ReadPreference.PRIMARY_PREFERRED, ReadPreference.SECONDARY, ReadPreference.SECONDARY_PREFERRED, ReadPreference.NEAREST). */
    readPreference?: ReadPreferenceLike;
    /** A primary key factory object for generation of custom _id keys. */
    pkFactory?: PkFactory;
    /** Specify a read concern for the collection. (only MongoDB 3.2 or higher supported) */
    readConcern?: ReadConcern;
    /** Should retry failed writes */
    retryWrites?: boolean;
}
/* Excluded from this release type: DbPrivate */
export { DBRef };
/** @public */
export declare interface DbStatsOptions extends CommandOperationOptions {
    /** Divide the returned sizes by scale value. */
    scale?: number;
}
export { Decimal128 };
/** @public */
export declare interface DeleteManyModel<TSchema extends Document = Document> {
    /** The filter to limit the deleted documents. */
    filter: Filter<TSchema>;
    /** Specifies a collation. */
    collation?: CollationOptions;
    /** The index to use. If specified, then the query system will only consider plans using the hinted index. */
    hint?: Hint;
}
/** @public */
export declare interface DeleteOneModel<TSchema extends Document = Document> {
    /** The filter to limit the deleted documents. */
    filter: Filter<TSchema>;
    /** Specifies a collation. */
    collation?: CollationOptions;
    /** The index to use. If specified, then the query system will only consider plans using the hinted index. */
    hint?: Hint;
}
/** @public */
export declare interface DeleteOptions extends CommandOperationOptions, WriteConcernOptions {
    /** If true, when an insert fails, don't execute the remaining writes. If false, continue with remaining inserts when one fails. */
    ordered?: boolean;
    /** A user-provided comment to attach to this command */
    comment?: string | Document;
    /** Specifies the collation to use for the operation */
    collation?: CollationOptions;
    /** Specify that the update query should only consider plans using the hinted index */
    hint?: string | Document;
    /** Map of parameter names and values that can be accessed using $$var (requires MongoDB 5.0). */
    let?: Document;
    /** @deprecated use `removeOne` or `removeMany` to implicitly specify the limit */
    single?: boolean;
}
/** @public */
export declare interface DeleteResult {
    /** Indicates whether this write result was acknowledged. If not, then all other members of this result will be undefined. */
    acknowledged: boolean;
    /** The number of documents that were deleted */
    deletedCount: number;
}
/** @public */
export declare interface DeleteStatement {
    /** The query that matches documents to delete. */
    q: Document;
    /** The number of matching documents to delete. */
    limit: number;
    /** Specifies the collation to use for the operation. */
    collation?: CollationOptions;
    /** A document or string that specifies the index to use to support the query predicate. */
    hint?: Hint;
    /** A user-provided comment to attach to this command */
    comment?: string | Document;
}
/* Excluded from this release type: deserialize */
/** @public */
export declare interface DestroyOptions {
    /** Force the destruction. */
    force?: boolean;
}
/** @public */
export declare type DistinctOptions = CommandOperationOptions;
export { Document };
export { Double };
/** @public */
export declare interface DriverInfo {
    name?: string;
    version?: string;
    platform?: string;
}
/** @public */
export declare type DropCollectionOptions = CommandOperationOptions;
/** @public */
export declare type DropDatabaseOptions = CommandOperationOptions;
/** @public */
export declare type DropIndexesOptions = CommandOperationOptions;
/* Excluded from this release type: Encrypter */
/* Excluded from this release type: EncrypterOptions */
/** TypeScript Omit (Exclude to be specific) does not work for objects with an "any" indexed type, and breaks discriminated unions @public */
export declare type EnhancedOmit<TRecordOrUnion, KeyUnion> = string extends keyof TRecordOrUnion ? TRecordOrUnion : TRecordOrUnion extends any ? Pick<TRecordOrUnion, Exclude<keyof TRecordOrUnion, KeyUnion>> : never;
/** @public */
export declare interface ErrorDescription {
    message?: string;
    errmsg?: string;
    $err?: string;
    errorLabels?: string[];
    [key: string]: any;
}
/** @public */
export declare interface EstimatedDocumentCountOptions extends CommandOperationOptions {
    /**
     * The maximum amount of time to allow the operation to run.
     *
     * This option is sent only if the caller explicitly provides a value. The default is to not send a value.
     */
    maxTimeMS?: number;
}
/** @public */
export declare interface EvalOptions extends CommandOperationOptions {
    nolock?: boolean;
}
/** @public */
export declare type EventEmitterWithState = {};
/**
 * Event description type
 * @public
 */
export declare type EventsDescription = Record<string, GenericListener>;
/* Excluded from this release type: ExecutionResult */
/* Excluded from this release type: Explain */
/** @public */
export declare interface ExplainOptions {
    /** Specifies the verbosity mode for the explain output. */
    explain?: ExplainVerbosityLike;
}
/** @public */
export declare const ExplainVerbosity: Readonly<{
    readonly queryPlanner: "queryPlanner";
    readonly queryPlannerExtended: "queryPlannerExtended";
    readonly executionStats: "executionStats";
    readonly allPlansExecution: "allPlansExecution";
}>;
/** @public */
export declare type ExplainVerbosity = string;
/**
 * For backwards compatibility, true is interpreted as "allPlansExecution"
 * and false as "queryPlanner". Prior to server version 3.6, aggregate()
 * ignores the verbosity parameter and executes in "queryPlanner".
 * @public
 */
export declare type ExplainVerbosityLike = ExplainVerbosity | boolean;
/** A MongoDB filter can be some portion of the schema or a set of operators @public */
export declare type Filter<TSchema> = {
    [P in keyof TSchema]?: Condition<TSchema[P]>;
} & RootFilterOperators<TSchema>;
/** @public */
export declare type FilterOperations<T> = T extends Record<string, any> ? {
    [key in keyof T]?: FilterOperators<T[key]>;
} : FilterOperators<T>;
/** @public */
export declare interface FilterOperators<TValue> extends Document {
    $eq?: TValue;
    $gt?: TValue;
    $gte?: TValue;
    $in?: TValue[];
    $lt?: TValue;
    $lte?: TValue;
    $ne?: TValue;
    $nin?: TValue[];
    $not?: TValue extends string ? FilterOperators<TValue> | RegExp : FilterOperators<TValue>;
    /**
     * When `true`, `$exists` matches the documents that contain the field,
     * including documents where the field value is null.
     */
    $exists?: boolean;
    $type?: BSONType | BSONTypeAlias;
    $expr?: Record<string, any>;
    $jsonSchema?: Record<string, any>;
    $mod?: TValue extends number ? [
        number,
        number
    ] : never;
    $regex?: TValue extends string ? RegExp | BSONRegExp | string : never;
    $options?: TValue extends string ? string : never;
    $geoIntersects?: {
        $geometry: Document;
    };
    $geoWithin?: Document;
    $near?: Document;
    $nearSphere?: Document;
    $maxDistance?: number;
    $all?: TValue extends ReadonlyArray<any> ? any[] : never;
    $elemMatch?: TValue extends ReadonlyArray<any> ? Document : never;
    $size?: TValue extends ReadonlyArray<any> ? number : never;
    $bitsAllClear?: BitwiseFilter;
    $bitsAllSet?: BitwiseFilter;
    $bitsAnyClear?: BitwiseFilter;
    $bitsAnySet?: BitwiseFilter;
    $rand?: Record<string, never>;
}
/** @public */
export declare type FinalizeFunction<TKey = ObjectId, TValue = Document> = (key: TKey, reducedValue: TValue) => TValue;
/** @public */
export declare class FindCursor<TSchema = Document> extends AbstractCursor<TSchema> {
    /* Excluded from this release type: [kFilter] */
    /* Excluded from this release type: [kNumReturned] */
    /* Excluded from this release type: [kBuiltOptions] */
    /* Excluded from this release type: __constructor */
    clone(): FindCursor<TSchema>;
    map<T>(transform: (doc: TSchema) => T): FindCursor<T>;
    /* Excluded from this release type: _initialize */
    /* Excluded from this release type: _getMore */
    /** Get the count of documents for this cursor */
    count(): Promise<number>;
    count(callback: Callback<number>): void;
    count(options: CountOptions): Promise<number>;
    count(options: CountOptions, callback: Callback<number>): void;
    /** Execute the explain for the cursor */
    explain(): Promise<Document>;
    explain(callback: Callback): void;
    explain(verbosity?: ExplainVerbosityLike): Promise<Document>;
    /** Set the cursor query */
    filter(filter: Document): this;
    /**
     * Set the cursor hint
     *
     * @param hint - If specified, then the query system will only consider plans using the hinted index.
     */
    hint(hint: Hint): this;
    /**
     * Set the cursor min
     *
     * @param min - Specify a $min value to specify the inclusive lower bound for a specific index in order to constrain the results of find(). The $min specifies the lower bound for all keys of a specific index in order.
     */
    min(min: Document): this;
    /**
     * Set the cursor max
     *
     * @param max - Specify a $max value to specify the exclusive upper bound for a specific index in order to constrain the results of find(). The $max specifies the upper bound for all keys of a specific index in order.
     */
    max(max: Document): this;
    /**
     * Set the cursor returnKey.
     * If set to true, modifies the cursor to only return the index field or fields for the results of the query, rather than documents.
     * If set to true and the query does not use an index to perform the read operation, the returned documents will not contain any fields.
     *
     * @param value - the returnKey value.
     */
    returnKey(value: boolean): this;
    /**
     * Modifies the output of a query by adding a field $recordId to matching documents. $recordId is the internal key which uniquely identifies a document in a collection.
     *
     * @param value - The $showDiskLoc option has now been deprecated and replaced with the showRecordId field. $showDiskLoc will still be accepted for OP_QUERY stye find.
     */
    showRecordId(value: boolean): this;
    /**
     * Add a query modifier to the cursor query
     *
     * @param name - The query modifier (must start with $, such as $orderby etc)
     * @param value - The modifier value.
     */
    addQueryModifier(name: string, value: string | boolean | number | Document): this;
    /**
     * Add a comment to the cursor query allowing for tracking the comment in the log.
     *
     * @param value - The comment attached to this query.
     */
    comment(value: string): this;
    /**
     * Set a maxAwaitTimeMS on a tailing cursor query to allow to customize the timeout value for the option awaitData (Only supported on MongoDB 3.2 or higher, ignored otherwise)
     *
     * @param value - Number of milliseconds to wait before aborting the tailed query.
     */
    maxAwaitTimeMS(value: number): this;
    /**
     * Set a maxTimeMS on the cursor query, allowing for hard timeout limits on queries (Only supported on MongoDB 2.6 or higher)
     *
     * @param value - Number of milliseconds to wait before aborting the query.
     */
    maxTimeMS(value: number): this;
    /**
     * Add a project stage to the aggregation pipeline
     *
     * @remarks
     * In order to strictly type this function you must provide an interface
     * that represents the effect of your projection on the result documents.
     *
     * **NOTE:** adding a projection changes the return type of the iteration of this cursor,
     * it **does not** return a new instance of a cursor. This means when calling project,
     * you should always assign the result to a new variable. Take note of the following example:
     *
     * @example
     * ```typescript
     * const cursor: FindCursor<{ a: number; b: string }> = coll.find();
     * const projectCursor = cursor.project<{ a: number }>({ a: true });
     * const aPropOnlyArray: {a: number}[] = await projectCursor.toArray();
     * ```
     */
    project<T = TSchema>(value: Projection<T>): FindCursor<T>;
    /**
     * Sets the sort order of the cursor query.
     *
     * @param sort - The key or keys set for the sort.
     * @param direction - The direction of the sorting (1 or -1).
     */
    sort(sort: Sort | string, direction?: SortDirection): this;
    /**
     * Allows disk use for blocking sort operations exceeding 100MB memory. (MongoDB 3.2 or higher)
     *
     * @remarks
     * {@link https://docs.mongodb.com/manual/reference/command/find/#find-cmd-allowdiskuse | find command allowDiskUse documentation}
     */
    allowDiskUse(): this;
    /**
     * Set the collation options for the cursor.
     *
     * @param value - The cursor collation options (MongoDB 3.4 or higher) settings for update operation (see 3.4 documentation for available fields).
     */
    collation(value: CollationOptions): this;
    /**
     * Set the limit for the cursor.
     *
     * @param value - The limit for the cursor query.
     */
    limit(value: number): this;
    /**
     * Set the skip for the cursor.
     *
     * @param value - The skip for the cursor query.
     */
    skip(value: number): this;
}
/** @public */
export declare interface FindOneAndDeleteOptions extends CommandOperationOptions {
    /** An optional hint for query optimization. See the {@link https://docs.mongodb.com/manual/reference/command/update/#update-command-hint|update command} reference for more information.*/
    hint?: Document;
    /** Limits the fields to return for all matching documents. */
    projection?: Document;
    /** Determines which document the operation modifies if the query selects multiple documents. */
    sort?: Sort;
    /** Map of parameter names and values that can be accessed using $$var (requires MongoDB 5.0). */
    let?: Document;
}
/** @public */
export declare interface FindOneAndReplaceOptions extends CommandOperationOptions {
    /** Allow driver to bypass schema validation in MongoDB 3.2 or higher. */
    bypassDocumentValidation?: boolean;
    /** An optional hint for query optimization. See the {@link https://docs.mongodb.com/manual/reference/command/update/#update-command-hint|update command} reference for more information.*/
    hint?: Document;
    /** Limits the fields to return for all matching documents. */
    projection?: Document;
    /** When set to 'after', returns the updated document rather than the original. The default is 'before'.  */
    returnDocument?: ReturnDocument;
    /** Determines which document the operation modifies if the query selects multiple documents. */
    sort?: Sort;
    /** Upsert the document if it does not exist. */
    upsert?: boolean;
    /** Map of parameter names and values that can be accessed using $$var (requires MongoDB 5.0). */
    let?: Document;
}
/** @public */
export declare interface FindOneAndUpdateOptions extends CommandOperationOptions {
    /** Optional list of array filters referenced in filtered positional operators */
    arrayFilters?: Document[];
    /** Allow driver to bypass schema validation in MongoDB 3.2 or higher. */
    bypassDocumentValidation?: boolean;
    /** An optional hint for query optimization. See the {@link https://docs.mongodb.com/manual/reference/command/update/#update-command-hint|update command} reference for more information.*/
    hint?: Document;
    /** Limits the fields to return for all matching documents. */
    projection?: Document;
    /** When set to 'after', returns the updated document rather than the original. The default is 'before'.  */
    returnDocument?: ReturnDocument;
    /** Determines which document the operation modifies if the query selects multiple documents. */
    sort?: Sort;
    /** Upsert the document if it does not exist. */
    upsert?: boolean;
    /** Map of parameter names and values that can be accessed using $$var (requires MongoDB 5.0). */
    let?: Document;
}
/**
 * A builder object that is returned from {@link BulkOperationBase#find}.
 * Is used to build a write operation that involves a query filter.
 *
 * @public
 */
export declare class FindOperators {
    bulkOperation: BulkOperationBase;
    /* Excluded from this release type: __constructor */
    /** Add a multiple update operation to the bulk operation */
    update(updateDocument: Document): BulkOperationBase;
    /** Add a single update operation to the bulk operation */
    updateOne(updateDocument: Document): BulkOperationBase;
    /** Add a replace one operation to the bulk operation */
    replaceOne(replacement: Document): BulkOperationBase;
    /** Add a delete one operation to the bulk operation */
    deleteOne(): BulkOperationBase;
    /** Add a delete many operation to the bulk operation */
    delete(): BulkOperationBase;
    /** Upsert modifier for update bulk operation, noting that this operation is an upsert. */
    upsert(): this;
    /** Specifies the collation for the query condition. */
    collation(collation: CollationOptions): this;
    /** Specifies arrayFilters for UpdateOne or UpdateMany bulk operations. */
    arrayFilters(arrayFilters: Document[]): this;
}
/** @public */
export declare interface FindOptions<TSchema = Document> extends CommandOperationOptions {
    /** Sets the limit of documents returned in the query. */
    limit?: number;
    /** Set to sort the documents coming back from the query. Array of indexes, `[['a', 1]]` etc. */
    sort?: Sort;
    /** The fields to return in the query. Object of fields to either include or exclude (one of, not both), `{'a':1, 'b': 1}` **or** `{'a': 0, 'b': 0}` */
    projection?: Projection<TSchema>;
    /** Set to skip N documents ahead in your query (useful for pagination). */
    skip?: number;
    /** Tell the query to use specific indexes in the query. Object of indexes to use, `{'_id':1}` */
    hint?: Hint;
    /** Specify if the cursor can timeout. */
    timeout?: boolean;
    /** Specify if the cursor is tailable. */
    tailable?: boolean;
    /** Specify if the cursor is a a tailable-await cursor. Requires `tailable` to be true */
    awaitData?: boolean;
    /** Set the batchSize for the getMoreCommand when iterating over the query results. */
    batchSize?: number;
    /** If true, returns only the index keys in the resulting documents. */
    returnKey?: boolean;
    /** The inclusive lower bound for a specific index */
    min?: Document;
    /** The exclusive upper bound for a specific index */
    max?: Document;
    /** You can put a $comment field on a query to make looking in the profiler logs simpler. */
    comment?: string | Document;
    /** Number of milliseconds to wait before aborting the query. */
    maxTimeMS?: number;
    /** The maximum amount of time for the server to wait on new documents to satisfy a tailable cursor query. Requires `tailable` and `awaitData` to be true */
    maxAwaitTimeMS?: number;
    /** The server normally times out idle cursors after an inactivity period (10 minutes) to prevent excess memory use. Set this option to prevent that. */
    noCursorTimeout?: boolean;
    /** Specify collation (MongoDB 3.4 or higher) settings for update operation (see 3.4 documentation for available fields). */
    collation?: CollationOptions;
    /** Allows disk use for blocking sort operations exceeding 100MB memory. (MongoDB 3.2 or higher) */
    allowDiskUse?: boolean;
    /** Determines whether to close the cursor after the first batch. Defaults to false. */
    singleBatch?: boolean;
    /** For queries against a sharded collection, allows the command (or subsequent getMore commands) to return partial results, rather than an error, if one or more queried shards are unavailable. */
    allowPartialResults?: boolean;
    /** Determines whether to return the record identifier for each document. If true, adds a field $recordId to the returned documents. */
    showRecordId?: boolean;
    /** Map of parameter names and values that can be accessed using $$var (requires MongoDB 5.0). */
    let?: Document;
}
/** @public */
export declare type Flatten<Type> = Type extends ReadonlyArray<infer Item> ? Item : Type;
/** @public */
export declare type GenericListener = (...args: any[]) => void;
/* Excluded from this release type: GetMore */
/* Excluded from this release type: GetMoreOptions */
/**
 * Constructor for a streaming GridFS interface
 * @public
 */
export declare class GridFSBucket extends TypedEventEmitter<GridFSBucketEvents> {
    /* Excluded from this release type: s */
    /**
     * When the first call to openUploadStream is made, the upload stream will
     * check to see if it needs to create the proper indexes on the chunks and
     * files collections. This event is fired either when 1) it determines that
     * no index creation is necessary, 2) when it successfully creates the
     * necessary indexes.
     * @event
     */
    static readonly INDEX: "index";
    constructor(db: Db, options?: GridFSBucketOptions);
    /**
     * Returns a writable stream (GridFSBucketWriteStream) for writing
     * buffers to GridFS. The stream's 'id' property contains the resulting
     * file's id.
     *
     * @param filename - The value of the 'filename' key in the files doc
     * @param options - Optional settings.
     */
    openUploadStream(filename: string, options?: GridFSBucketWriteStreamOptions): GridFSBucketWriteStream;
    /**
     * Returns a writable stream (GridFSBucketWriteStream) for writing
     * buffers to GridFS for a custom file id. The stream's 'id' property contains the resulting
     * file's id.
     */
    openUploadStreamWithId(id: ObjectId, filename: string, options?: GridFSBucketWriteStreamOptions): GridFSBucketWriteStream;
    /** Returns a readable stream (GridFSBucketReadStream) for streaming file data from GridFS. */
    openDownloadStream(id: ObjectId, options?: GridFSBucketReadStreamOptions): GridFSBucketReadStream;
    /**
     * Deletes a file with the given id
     *
     * @param id - The id of the file doc
     */
    delete(id: ObjectId): Promise<undefined>;
    delete(id: ObjectId, callback: Callback<void>): void;
    /** Convenience wrapper around find on the files collection */
    find(filter?: Filter<GridFSFile>, options?: FindOptions): FindCursor<GridFSFile>;
    /**
     * Returns a readable stream (GridFSBucketReadStream) for streaming the
     * file with the given name from GridFS. If there are multiple files with
     * the same name, this will stream the most recent file with the given name
     * (as determined by the `uploadDate` field). You can set the `revision`
     * option to change this behavior.
     */
    openDownloadStreamByName(filename: string, options?: GridFSBucketReadStreamOptionsWithRevision): GridFSBucketReadStream;
    /**
     * Renames the file with the given _id to the given string
     *
     * @param id - the id of the file to rename
     * @param filename - new name for the file
     */
    rename(id: ObjectId, filename: string): Promise<void>;
    rename(id: ObjectId, filename: string, callback: Callback<void>): void;
    /** Removes this bucket's files collection, followed by its chunks collection. */
    drop(): Promise<void>;
    drop(callback: Callback<void>): void;
    /** Get the Db scoped logger. */
    getLogger(): Logger;
}
/** @public */
export declare type GridFSBucketEvents = {
    index(): void;
};
/** @public */
export declare interface GridFSBucketOptions extends WriteConcernOptions {
    /** The 'files' and 'chunks' collections will be prefixed with the bucket name followed by a dot. */
    bucketName?: string;
    /** Number of bytes stored in each chunk. Defaults to 255KB */
    chunkSizeBytes?: number;
    /** Read preference to be passed to read operations */
    readPreference?: ReadPreference;
}
/* Excluded from this release type: GridFSBucketPrivate */
/**
 * A readable stream that enables you to read buffers from GridFS.
 *
 * Do not instantiate this class directly. Use `openDownloadStream()` instead.
 * @public
 */
export declare class GridFSBucketReadStream extends Readable {
    /* Excluded from this release type: s */
    /**
     * An error occurred
     * @event
     */
    static readonly ERROR: "error";
    /**
     * Fires when the stream loaded the file document corresponding to the provided id.
     * @event
     */
    static readonly FILE: "file";
    /**
     * Emitted when a chunk of data is available to be consumed.
     * @event
     */
    static readonly DATA: "data";
    /**
     * Fired when the stream is exhausted (no more data events).
     * @event
     */
    static readonly END: "end";
    /**
     * Fired when the stream is exhausted and the underlying cursor is killed
     * @event
     */
    static readonly CLOSE: "close";
    /* Excluded from this release type: __constructor */
    /* Excluded from this release type: _read */
    /**
     * Sets the 0-based offset in bytes to start streaming from. Throws
     * an error if this stream has entered flowing mode
     * (e.g. if you've already called `on('data')`)
     *
     * @param start - 0-based offset in bytes to start streaming from
     */
    start(start?: number): this;
    /**
     * Sets the 0-based offset in bytes to start streaming from. Throws
     * an error if this stream has entered flowing mode
     * (e.g. if you've already called `on('data')`)
     *
     * @param end - Offset in bytes to stop reading at
     */
    end(end?: number): this;
    /**
     * Marks this stream as aborted (will never push another `data` event)
     * and kills the underlying cursor. Will emit the 'end' event, and then
     * the 'close' event once the cursor is successfully killed.
     *
     * @param callback - called when the cursor is successfully closed or an error occurred.
     */
    abort(callback?: Callback<void>): void;
}
/** @public */
export declare interface GridFSBucketReadStreamOptions {
    sort?: Sort;
    skip?: number;
    /** 0-based offset in bytes to start streaming from */
    start?: number;
    /** 0-based offset in bytes to stop streaming before */
    end?: number;
}
/** @public */
export declare interface GridFSBucketReadStreamOptionsWithRevision extends GridFSBucketReadStreamOptions {
    /** The revision number relative to the oldest file with the given filename. 0
     * gets you the oldest file, 1 gets you the 2nd oldest, -1 gets you the
     * newest. */
    revision?: number;
}
/* Excluded from this release type: GridFSBucketReadStreamPrivate */
/**
 * A writable stream that enables you to write buffers to GridFS.
 *
 * Do not instantiate this class directly. Use `openUploadStream()` instead.
 * @public
 */
export declare class GridFSBucketWriteStream extends Writable {
    bucket: GridFSBucket;
    chunks: Collection<GridFSChunk>;
    filename: string;
    files: Collection<GridFSFile>;
    options: GridFSBucketWriteStreamOptions;
    done: boolean;
    id: ObjectId;
    chunkSizeBytes: number;
    bufToStore: Buffer;
    length: number;
    n: number;
    pos: number;
    state: {
        streamEnd: boolean;
        outstandingRequests: number;
        errored: boolean;
        aborted: boolean;
    };
    writeConcern?: WriteConcern;
    /** @event */
    static readonly CLOSE = "close";
    /** @event */
    static readonly ERROR = "error";
    /**
     * `end()` was called and the write stream successfully wrote the file metadata and all the chunks to MongoDB.
     * @event
     */
    static readonly FINISH = "finish";
    /* Excluded from this release type: __constructor */
    /**
     * Write a buffer to the stream.
     *
     * @param chunk - Buffer to write
     * @param encodingOrCallback - Optional encoding for the buffer
     * @param callback - Function to call when the chunk was added to the buffer, or if the entire chunk was persisted to MongoDB if this chunk caused a flush.
     * @returns False if this write required flushing a chunk to MongoDB. True otherwise.
     */
    write(chunk: Buffer): boolean;
    write(chunk: Buffer, callback: Callback<void>): boolean;
    write(chunk: Buffer, encoding: BufferEncoding | undefined): boolean;
    write(chunk: Buffer, encoding: BufferEncoding | undefined, callback: Callback<void>): boolean;
    /**
     * Places this write stream into an aborted state (all future writes fail)
     * and deletes all chunks that have already been written.
     *
     * @param callback - called when chunks are successfully removed or error occurred
     */
    abort(): Promise<void>;
    abort(callback: Callback<void>): void;
    /**
     * Tells the stream that no more data will be coming in. The stream will
     * persist the remaining data to MongoDB, write the files document, and
     * then emit a 'finish' event.
     *
     * @param chunk - Buffer to write
     * @param encoding - Optional encoding for the buffer
     * @param callback - Function to call when all files and chunks have been persisted to MongoDB
     */
    end(): void;
    end(chunk: Buffer): void;
    end(callback: Callback<GridFSFile | void>): void;
    end(chunk: Buffer, callback: Callback<GridFSFile | void>): void;
    end(chunk: Buffer, encoding: BufferEncoding): void;
    end(chunk: Buffer, encoding: BufferEncoding | undefined, callback: Callback<GridFSFile | void>): void;
}
/** @public */
export declare interface GridFSBucketWriteStreamOptions extends WriteConcernOptions {
    /** Overwrite this bucket's chunkSizeBytes for this file */
    chunkSizeBytes?: number;
    /** Custom file id for the GridFS file. */
    id?: ObjectId;
    /** Object to store in the file document's `metadata` field */
    metadata?: Document;
    /** String to store in the file document's `contentType` field */
    contentType?: string;
    /** Array of strings to store in the file document's `aliases` field */
    aliases?: string[];
}
/** @public */
export declare interface GridFSChunk {
    _id: ObjectId;
    files_id: ObjectId;
    n: number;
    data: Buffer | Uint8Array;
}
/** @public */
export declare interface GridFSFile {
    _id: ObjectId;
    length: number;
    chunkSize: number;
    filename: string;
    contentType?: string;
    aliases?: string[];
    metadata?: Document;
    uploadDate: Date;
}
/** @public */
export declare interface HedgeOptions {
    /** Explicitly enable or disable hedged reads. */
    enabled?: boolean;
}
/** @public */
export declare type Hint = string | Document;
/** @public */
export declare class HostAddress {
    host: string | undefined;
    port: number | undefined;
    socketPath: string | undefined;
    isIPv6: boolean | undefined;
    constructor(hostString: string);
    /**
     * @param ipv6Brackets - optionally request ipv6 bracket notation required for connection strings
     */
    toString(ipv6Brackets?: boolean): string;
    static fromString(s: string): HostAddress;
}
/** @public */
export declare interface IndexDescription {
    collation?: CollationOptions;
    name?: string;
    key: Document;
}
/** @public */
export declare type IndexDirection = -1 | 1 | '2d' | '2dsphere' | 'text' | 'geoHaystack' | number;
/** @public */
export declare interface IndexInformationOptions {
    full?: boolean;
    readPreference?: ReadPreference;
    session?: ClientSession;
}
/** @public */
export declare type IndexSpecification = OneOrMore<string | [
    string,
    IndexDirection
] | {
    [key: string]: IndexDirection;
} | [
    string,
    IndexDirection
][] | {
    [key: string]: IndexDirection;
}[]>;
/** Given an object shaped type, return the type of the _id field or default to ObjectId @public */
export declare type InferIdType<TSchema> = TSchema extends {
    _id: infer IdType;
} ? {} extends IdType ? Exclude<IdType, {}> : unknown extends IdType ? ObjectId : IdType : ObjectId;
/** @public */
export declare interface InsertManyResult<TSchema = Document> {
    /** Indicates whether this write result was acknowledged. If not, then all other members of this result will be undefined */
    acknowledged: boolean;
    /** The number of inserted documents for this operations */
    insertedCount: number;
    /** Map of the index of the inserted document to the id of the inserted document */
    insertedIds: {
        [key: number]: InferIdType<TSchema>;
    };
}
/** @public */
export declare interface InsertOneModel<TSchema extends Document = Document> {
    /** The document to insert. */
    document: OptionalId<TSchema>;
}
/** @public */
export declare interface InsertOneOptions extends CommandOperationOptions {
    /** Allow driver to bypass schema validation in MongoDB 3.2 or higher. */
    bypassDocumentValidation?: boolean;
    /** Force server to assign _id values instead of driver. */
    forceServerObjectId?: boolean;
}
/** @public */
export declare interface InsertOneResult<TSchema = Document> {
    /** Indicates whether this write result was acknowledged. If not, then all other members of this result will be undefined */
    acknowledged: boolean;
    /** The identifier that was inserted. If the server generated the identifier, this value will be null as the driver does not have access to that data */
    insertedId: InferIdType<TSchema>;
}
export { Int32 };
/** @public */
export declare type IntegerType = number | Int32 | Long;
/* Excluded from this release type: InternalAbstractCursorOptions */
/* Excluded from this release type: InterruptibleAsyncInterval */
/** @public */
export declare type IsAny<Type, ResultIfAny, ResultIfNotAny> = true extends false & Type ? ResultIfAny : ResultIfNotAny;
/* Excluded from this release type: kBeforeHandshake */
/* Excluded from this release type: kBuffer */
/* Excluded from this release type: kBuffers */
/* Excluded from this release type: kBuiltOptions */
/* Excluded from this release type: kCancellationToken */
/* Excluded from this release type: kCancellationToken_2 */
/* Excluded from this release type: kCancelled */
/* Excluded from this release type: kCancelled_2 */
/* Excluded from this release type: kClosed */
/* Excluded from this release type: kClosed_2 */
/* Excluded from this release type: kClusterTime */
/* Excluded from this release type: kConnection */
/* Excluded from this release type: kConnectionCounter */
/* Excluded from this release type: kConnections */
/* Excluded from this release type: kCursorStream */
/* Excluded from this release type: kDescription */
/* Excluded from this release type: kDocuments */
/* Excluded from this release type: kErrorLabels */
/** @public */
export declare type KeysOfAType<TSchema, Type> = {
    [key in keyof TSchema]: NonNullable<TSchema[key]> extends Type ? key : never;
}[keyof TSchema];
/** @public */
export declare type KeysOfOtherType<TSchema, Type> = {
    [key in keyof TSchema]: NonNullable<TSchema[key]> extends Type ? never : key;
}[keyof TSchema];
/* Excluded from this release type: kFilter */
/* Excluded from this release type: kGeneration */
/* Excluded from this release type: kGeneration_2 */
/* Excluded from this release type: kId */
/* Excluded from this release type: KillCursor */
/* Excluded from this release type: kInitialized */
/* Excluded from this release type: kInternalClient */
/* Excluded from this release type: kIsMaster */
/* Excluded from this release type: kKilled */
/* Excluded from this release type: kLastUseTime */
/* Excluded from this release type: kLength */
/* Excluded from this release type: kLogger */
/* Excluded from this release type: kMessageStream */
/* Excluded from this release type: kMinPoolSizeTimer */
/* Excluded from this release type: kMode */
/* Excluded from this release type: kMonitor */
/* Excluded from this release type: kMonitorId */
/* Excluded from this release type: kNamespace */
/* Excluded from this release type: kNumReturned */
/* Excluded from this release type: kOptions */
/* Excluded from this release type: kOptions_2 */
/* Excluded from this release type: kOptions_3 */
/* Excluded from this release type: kParent */
/* Excluded from this release type: kPermits */
/* Excluded from this release type: kPipeline */
/* Excluded from this release type: kQueue */
/* Excluded from this release type: kResumeQueue */
/* Excluded from this release type: kRoundTripTime */
/* Excluded from this release type: kRTTPinger */
/* Excluded from this release type: kServer */
/* Excluded from this release type: kServer_2 */
/* Excluded from this release type: kServerSession */
/* Excluded from this release type: kSession */
/* Excluded from this release type: kSession_2 */
/* Excluded from this release type: kSnapshotEnabled */
/* Excluded from this release type: kSnapshotTime */
/* Excluded from this release type: kStream */
/* Excluded from this release type: kTopology */
/* Excluded from this release type: kTransform */
/* Excluded from this release type: kWaitQueue */
/* Excluded from this release type: kWaitQueue_2 */
/** @public */
export declare const LEGAL_TCP_SOCKET_OPTIONS: readonly [
    "family",
    "hints",
    "localAddress",
    "localPort",
    "lookup"
];
/** @public */
export declare const LEGAL_TLS_SOCKET_OPTIONS: readonly [
    "ALPNProtocols",
    "ca",
    "cert",
    "checkServerIdentity",
    "ciphers",
    "crl",
    "ecdhCurve",
    "key",
    "minDHSize",
    "passphrase",
    "pfx",
    "rejectUnauthorized",
    "secureContext",
    "secureProtocol",
    "servername",
    "session"
];
/** @public */
export declare class ListCollectionsCursor<T extends Pick<CollectionInfo, 'name' | 'type'> | CollectionInfo = CollectionInfo> extends AbstractCursor<T> {
    parent: Db;
    filter: Document;
    options?: ListCollectionsOptions;
    constructor(db: Db, filter: Document, options?: ListCollectionsOptions);
    clone(): ListCollectionsCursor<T>;
}
/** @public */
export declare interface ListCollectionsOptions extends CommandOperationOptions {
    /** Since 4.0: If true, will only return the collection name in the response, and will omit additional info */
    nameOnly?: boolean;
    /** The batchSize for the returned command cursor or if pre 2.8 the systems batch collection */
    batchSize?: number;
}
/** @public */
export declare interface ListDatabasesOptions extends CommandOperationOptions {
    /** A query predicate that determines which databases are listed */
    filter?: Document;
    /** A flag to indicate whether the command should return just the database names, or return both database names and size information */
    nameOnly?: boolean;
    /** A flag that determines which databases are returned based on the user privileges when access control is enabled */
    authorizedDatabases?: boolean;
}
/** @public */
export declare type ListDatabasesResult = string[] | Document[];
/** @public */
export declare class ListIndexesCursor extends AbstractCursor {
    parent: Collection;
    options?: ListIndexesOptions;
    constructor(collection: Collection, options?: ListIndexesOptions);
    clone(): ListIndexesCursor;
}
/** @public */
export declare interface ListIndexesOptions extends CommandOperationOptions {
    /** The batchSize for the returned command cursor or if pre 2.8 the systems batch collection */
    batchSize?: number;
}
/**
 * @public
 */
export declare class Logger {
    className: string;
    /**
     * Creates a new Logger instance
     *
     * @param className - The Class name associated with the logging instance
     * @param options - Optional logging settings
     */
    constructor(className: string, options?: LoggerOptions);
    /**
     * Log a message at the debug level
     *
     * @param message - The message to log
     * @param object - Additional meta data to log
     */
    debug(message: string, object?: unknown): void;
    /**
     * Log a message at the warn level
     *
     * @param message - The message to log
     * @param object - Additional meta data to log
     */
    warn(message: string, object?: unknown): void;
    /**
     * Log a message at the info level
     *
     * @param message - The message to log
     * @param object - Additional meta data to log
     */
    info(message: string, object?: unknown): void;
    /**
     * Log a message at the error level
     *
     * @param message - The message to log
     * @param object - Additional meta data to log
     */
    error(message: string, object?: unknown): void;
    /** Is the logger set at info level */
    isInfo(): boolean;
    /** Is the logger set at error level */
    isError(): boolean;
    /** Is the logger set at error level */
    isWarn(): boolean;
    /** Is the logger set at debug level */
    isDebug(): boolean;
    /** Resets the logger to default settings, error and no filtered classes */
    static reset(): void;
    /** Get the current logger function */
    static currentLogger(): LoggerFunction;
    /**
     * Set the current logger function
     *
     * @param logger - Custom logging function
     */
    static setCurrentLogger(logger: LoggerFunction): void;
    /**
     * Filter log messages for a particular class
     *
     * @param type - The type of filter (currently only class)
     * @param values - The filters to apply
     */
    static filter(type: string, values: string[]): void;
    /**
     * Set the current log level
     *
     * @param newLevel - Set current log level (debug, warn, info, error)
     */
    static setLevel(newLevel: LoggerLevel): void;
}
/** @public */
export declare type LoggerFunction = (message?: any, ...optionalParams: any[]) => void;
/** @public */
export declare const LoggerLevel: Readonly<{
    readonly ERROR: "error";
    readonly WARN: "warn";
    readonly INFO: "info";
    readonly DEBUG: "debug";
    readonly error: "error";
    readonly warn: "warn";
    readonly info: "info";
    readonly debug: "debug";
}>;
/** @public */
export declare type LoggerLevel = typeof LoggerLevel[keyof typeof LoggerLevel];
/** @public */
export declare interface LoggerOptions {
    logger?: LoggerFunction;
    loggerLevel?: LoggerLevel;
}
export { Long };
export { Map_2 as Map };
/** @public */
export declare type MapFunction<TSchema = Document> = (this: TSchema) => void;
/** @public */
export declare interface MapReduceOptions<TKey = ObjectId, TValue = Document> extends CommandOperationOptions {
    /** Sets the output target for the map reduce job. */
    out?: 'inline' | {
        inline: 1;
    } | {
        replace: string;
    } | {
        merge: string;
    } | {
        reduce: string;
    };
    /** Query filter object. */
    query?: Document;
    /** Sorts the input objects using this key. Useful for optimization, like sorting by the emit key for fewer reduces. */
    sort?: Sort;
    /** Number of objects to return from collection. */
    limit?: number;
    /** Keep temporary data. */
    keeptemp?: boolean;
    /** Finalize function. */
    finalize?: FinalizeFunction<TKey, TValue> | string;
    /** Can pass in variables that can be access from map/reduce/finalize. */
    scope?: Document;
    /** It is possible to make the execution stay in JS. Provided in MongoDB \> 2.0.X. */
    jsMode?: boolean;
    /** Provide statistics on job execution time. */
    verbose?: boolean;
    /** Allow driver to bypass schema validation in MongoDB 3.2 or higher. */
    bypassDocumentValidation?: boolean;
}
/** @public */
export declare type MatchKeysAndValues<TSchema> = Readonly<Partial<TSchema>> & Record<string, any>;
export { MaxKey };
/* Excluded from this release type: MessageStream */
/* Excluded from this release type: MessageStreamOptions */
export { MinKey };
/** @public */
export declare interface ModifyResult<TSchema = Document> {
    value?: TSchema;
    lastErrorObject?: Document;
    ok: 0 | 1;
}
/** @public */
export declare const MONGO_CLIENT_EVENTS: readonly [
    "connectionPoolCreated",
    "connectionPoolClosed",
    "connectionCreated",
    "connectionReady",
    "connectionClosed",
    "connectionCheckOutStarted",
    "connectionCheckOutFailed",
    "connectionCheckedOut",
    "connectionCheckedIn",
    "connectionPoolCleared",
    ...("error" | "close" | "commandStarted" | "commandSucceeded" | "commandFailed" | "serverHeartbeatStarted" | "serverHeartbeatSucceeded" | "serverHeartbeatFailed" | "timeout" | "serverOpening" | "serverClosed" | "serverDescriptionChanged" | "topologyOpening" | "topologyClosed" | "topologyDescriptionChanged")[]
];
/**
 * An error indicating an unsuccessful Bulk Write
 * @public
 * @category Error
 */
export declare class MongoBulkWriteError extends MongoServerError {
    result: BulkWriteResult;
    /** Creates a new MongoBulkWriteError */
    constructor(error: AnyError, result: BulkWriteResult);
    readonly name: string;
    /*Number of documents inserted. */
    readonly insertedCount: number;
    /*Number of documents matched for update. */
    readonly matchedCount: number;
    /*Number of documents modified. */
    readonly modifiedCount: number;
    /*Number of documents deleted. */
    readonly deletedCount: number;
    /*Number of documents upserted. */
    readonly upsertedCount: number;
    /*Inserted document generated Id's, hash key is the index of the originating operation */
    readonly insertedIds: {
        [key: number]: any;
    };
    /*Upserted document generated Id's, hash key is the index of the originating operation */
    readonly upsertedIds: {
        [key: number]: any;
    };
}
/**
 * The **MongoClient** class is a class that allows for making Connections to MongoDB.
 * @public
 *
 * @remarks
 * The programmatically provided options take precedent over the URI options.
 *
 * @example
 * ```js
 * // Connect using a MongoClient instance
 * const MongoClient = require('mongodb').MongoClient;
 * const test = require('assert');
 * // Connection url
 * const url = 'mongodb://localhost:27017';
 * // Database Name
 * const dbName = 'test';
 * // Connect using MongoClient
 * const mongoClient = new MongoClient(url);
 * mongoClient.connect(function(err, client) {
 *   const db = client.db(dbName);
 *   client.close();
 * });
 * ```
 *
 * @example
 * ```js
 * // Connect using the MongoClient.connect static method
 * const MongoClient = require('mongodb').MongoClient;
 * const test = require('assert');
 * // Connection url
 * const url = 'mongodb://localhost:27017';
 * // Database Name
 * const dbName = 'test';
 * // Connect using MongoClient
 * MongoClient.connect(url, function(err, client) {
 *   const db = client.db(dbName);
 *   client.close();
 * });
 * ```
 */
export declare class MongoClient extends TypedEventEmitter<MongoClientEvents> {
    /* Excluded from this release type: s */
    /* Excluded from this release type: topology */
    /* Excluded from this release type: [kOptions] */
    constructor(url: string, options?: MongoClientOptions);
    readonly options: Readonly<MongoOptions>;
    readonly serverApi: Readonly<ServerApi | undefined>;
    /*Excluded from this release type: monitorCommands
    Excluded from this release type: monitorCommands */
    readonly autoEncrypter: AutoEncrypter | undefined;
    readonly readConcern: ReadConcern | undefined;
    readonly writeConcern: WriteConcern | undefined;
    readonly readPreference: ReadPreference;
    readonly bsonOptions: BSONSerializeOptions;
    readonly logger: Logger;
    /**
     * Connect to MongoDB using a url
     *
     * @see docs.mongodb.org/manual/reference/connection-string/
     */
    connect(): Promise<MongoClient>;
    connect(callback: Callback<MongoClient>): void;
    /**
     * Close the db and its underlying connections
     *
     * @param force - Force close, emitting no events
     * @param callback - An optional callback, a Promise will be returned if none is provided
     */
    close(): Promise<void>;
    close(callback: Callback<void>): void;
    close(force: boolean): Promise<void>;
    close(force: boolean, callback: Callback<void>): void;
    /**
     * Create a new Db instance sharing the current socket connections.
     *
     * @param dbName - The name of the database we want to use. If not provided, use database name from connection string.
     * @param options - Optional settings for Db construction
     */
    db(dbName?: string, options?: DbOptions): Db;
    /**
     * Connect to MongoDB using a url
     *
     * @remarks
     * The programmatically provided options take precedent over the URI options.
     *
     * @see https://docs.mongodb.org/manual/reference/connection-string/
     */
    static connect(url: string): Promise<MongoClient>;
    static connect(url: string, callback: Callback<MongoClient>): void;
    static connect(url: string, options: MongoClientOptions): Promise<MongoClient>;
    static connect(url: string, options: MongoClientOptions, callback: Callback<MongoClient>): void;
    /** Starts a new session on the server */
    startSession(): ClientSession;
    startSession(options: ClientSessionOptions): ClientSession;
    /**
     * Runs a given operation with an implicitly created session. The lifetime of the session
     * will be handled without the need for user interaction.
     *
     * NOTE: presently the operation MUST return a Promise (either explicit or implicitly as an async function)
     *
     * @param options - Optional settings for the command
     * @param callback - An callback to execute with an implicitly created session
     */
    withSession(callback: WithSessionCallback): Promise<void>;
    withSession(options: ClientSessionOptions, callback: WithSessionCallback): Promise<void>;
    /**
     * Create a new Change Stream, watching for new changes (insertions, updates,
     * replacements, deletions, and invalidations) in this cluster. Will ignore all
     * changes to system collections, as well as the local, admin, and config databases.
     *
     * @param pipeline - An array of {@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline/|aggregation pipeline stages} through which to pass change stream documents. This allows for filtering (using $match) and manipulating the change stream documents.
     * @param options - Optional settings for the command
     */
    watch<TSchema = Document>(pipeline?: Document[], options?: ChangeStreamOptions): ChangeStream<TSchema>;
    /** Return the mongo client logger */
    getLogger(): Logger;
}
/** @public */
export declare type MongoClientEvents = Pick<TopologyEvents, typeof MONGO_CLIENT_EVENTS[number]> & {
    open(mongoClient: MongoClient): void;
};
/**
 * Describes all possible URI query options for the mongo client
 * @public
 * @see https://docs.mongodb.com/manual/reference/connection-string
 */
export declare interface MongoClientOptions extends BSONSerializeOptions, SupportedNodeConnectionOptions {
    /** Specifies the name of the replica set, if the mongod is a member of a replica set. */
    replicaSet?: string;
    /** Enables or disables TLS/SSL for the connection. */
    tls?: boolean;
    /** A boolean to enable or disables TLS/SSL for the connection. (The ssl option is equivalent to the tls option.) */
    ssl?: boolean;
    /** Specifies the location of a local TLS Certificate */
    tlsCertificateFile?: string;
    /** Specifies the location of a local .pem file that contains either the client’s TLS/SSL certificate or the client’s TLS/SSL certificate and key. */
    tlsCertificateKeyFile?: string;
    /** Specifies the password to de-crypt the tlsCertificateKeyFile. */
    tlsCertificateKeyFilePassword?: string;
    /** Specifies the location of a local .pem file that contains the root certificate chain from the Certificate Authority. This file is used to validate the certificate presented by the mongod/mongos instance. */
    tlsCAFile?: string;
    /** Bypasses validation of the certificates presented by the mongod/mongos instance */
    tlsAllowInvalidCertificates?: boolean;
    /** Disables hostname validation of the certificate presented by the mongod/mongos instance. */
    tlsAllowInvalidHostnames?: boolean;
    /** Disables various certificate validations. */
    tlsInsecure?: boolean;
    /** The time in milliseconds to attempt a connection before timing out. */
    connectTimeoutMS?: number;
    /** The time in milliseconds to attempt a send or receive on a socket before the attempt times out. */
    socketTimeoutMS?: number;
    /** Comma-delimited string of compressors to enable network compression for communication between this client and a mongod/mongos instance. */
    compressors?: CompressorName[];
    /** An integer that specifies the compression level if using zlib for network compression. */
    zlibCompressionLevel?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | undefined;
    /** The maximum number of connections in the connection pool. */
    maxPoolSize?: number;
    /** The minimum number of connections in the connection pool. */
    minPoolSize?: number;
    /** The maximum number of milliseconds that a connection can remain idle in the pool before being removed and closed. */
    maxIdleTimeMS?: number;
    /** The maximum time in milliseconds that a thread can wait for a connection to become available. */
    waitQueueTimeoutMS?: number;
    /** Specify a read concern for the collection (only MongoDB 3.2 or higher supported) */
    readConcern?: ReadConcernLike;
    /** The level of isolation */
    readConcernLevel?: ReadConcernLevel;
    /** Specifies the read preferences for this connection */
    readPreference?: ReadPreferenceMode | ReadPreference;
    /** Specifies, in seconds, how stale a secondary can be before the client stops using it for read operations. */
    maxStalenessSeconds?: number;
    /** Specifies the tags document as a comma-separated list of colon-separated key-value pairs.  */
    readPreferenceTags?: TagSet[];
    /** The auth settings for when connection to server. */
    auth?: Auth;
    /** Specify the database name associated with the user’s credentials. */
    authSource?: string;
    /** Specify the authentication mechanism that MongoDB will use to authenticate the connection. */
    authMechanism?: AuthMechanism;
    /** Specify properties for the specified authMechanism as a comma-separated list of colon-separated key-value pairs. */
    authMechanismProperties?: {
        SERVICE_NAME?: string;
        CANONICALIZE_HOST_NAME?: boolean;
        SERVICE_REALM?: string;
        [key: string]: any;
    };
    /** The size (in milliseconds) of the latency window for selecting among multiple suitable MongoDB instances. */
    localThresholdMS?: number;
    /** Specifies how long (in milliseconds) to block for server selection before throwing an exception.  */
    serverSelectionTimeoutMS?: number;
    /** heartbeatFrequencyMS controls when the driver checks the state of the MongoDB deployment. Specify the interval (in milliseconds) between checks, counted from the end of the previous check until the beginning of the next one. */
    heartbeatFrequencyMS?: number;
    /** Sets the minimum heartbeat frequency. In the event that the driver has to frequently re-check a server's availability, it will wait at least this long since the previous check to avoid wasted effort. */
    minHeartbeatFrequencyMS?: number;
    /** The name of the application that created this MongoClient instance. MongoDB 3.4 and newer will print this value in the server log upon establishing each connection. It is also recorded in the slow query log and profile collections */
    appName?: string;
    /** Enables retryable reads. */
    retryReads?: boolean;
    /** Enable retryable writes. */
    retryWrites?: boolean;
    /** Allow a driver to force a Single topology type with a connection string containing one host */
    directConnection?: boolean;
    /** The write concern w value */
    w?: W;
    /** The write concern timeout */
    wtimeoutMS?: number;
    /** The journal write concern */
    journal?: boolean;
    /** Validate mongod server certificate against Certificate Authority */
    sslValidate?: boolean;
    /** SSL Certificate file path. */
    sslCA?: string;
    /** SSL Certificate file path. */
    sslCert?: string;
    /** SSL Key file file path. */
    sslKey?: string;
    /** SSL Certificate pass phrase. */
    sslPass?: string;
    /** SSL Certificate revocation list file path. */
    sslCRL?: string;
    /** TCP Connection no delay */
    noDelay?: boolean;
    /** TCP Connection keep alive enabled */
    keepAlive?: boolean;
    /** The number of milliseconds to wait before initiating keepAlive on the TCP socket */
    keepAliveInitialDelay?: number;
    /** Force server to assign `_id` values instead of driver */
    forceServerObjectId?: boolean;
    /** Return document results as raw BSON buffers */
    raw?: boolean;
    /** A primary key factory function for generation of custom `_id` keys */
    pkFactory?: PkFactory;
    /** A Promise library class the application wishes to use such as Bluebird, must be ES6 compatible */
    promiseLibrary?: any;
    /** The logging level */
    loggerLevel?: LoggerLevel;
    /** Custom logger object */
    logger?: Logger;
    /** Enable command monitoring for this client */
    monitorCommands?: boolean;
    /** Server API version */
    serverApi?: ServerApi | ServerApiVersion;
    /**
     * Optionally enable client side auto encryption
     *
     * @remarks
     *  Automatic encryption is an enterprise only feature that only applies to operations on a collection. Automatic encryption is not supported for operations on a database or view, and operations that are not bypassed will result in error
     *  (see [libmongocrypt: Auto Encryption Allow-List](https://github.com/mongodb/specifications/blob/master/source/client-side-encryption/client-side-encryption.rst#libmongocrypt-auto-encryption-allow-list)). To bypass automatic encryption for all operations, set bypassAutoEncryption=true in AutoEncryptionOpts.
     *
     *  Automatic encryption requires the authenticated user to have the [listCollections privilege action](https://docs.mongodb.com/manual/reference/command/listCollections/#dbcmd.listCollections).
     *
     *  If a MongoClient with a limited connection pool size (i.e a non-zero maxPoolSize) is configured with AutoEncryptionOptions, a separate internal MongoClient is created if any of the following are true:
     *  - AutoEncryptionOptions.keyVaultClient is not passed.
     *  - AutoEncryptionOptions.bypassAutomaticEncryption is false.
     *
     * If an internal MongoClient is created, it is configured with the same options as the parent MongoClient except minPoolSize is set to 0 and AutoEncryptionOptions is omitted.
     */
    autoEncryption?: AutoEncryptionOptions;
    /** Allows a wrapping driver to amend the client metadata generated by the driver to include information about the wrapping driver */
    driverInfo?: DriverInfo;
}
/* Excluded from this release type: MongoClientPrivate */
/**
 * A representation of the credentials used by MongoDB
 * @public
 */
export declare class MongoCredentials {
    /** The username used for authentication */
    readonly username: string;
    /** The password used for authentication */
    readonly password: string;
    /** The database that the user should authenticate against */
    readonly source: string;
    /** The method used to authenticate */
    readonly mechanism: AuthMechanism;
    /** Special properties used by some types of auth mechanisms */
    readonly mechanismProperties: Document;
    constructor(options: MongoCredentialsOptions);
    /** Determines if two MongoCredentials objects are equivalent */
    equals(other: MongoCredentials): boolean;
    /**
     * If the authentication mechanism is set to "default", resolves the authMechanism
     * based on the server version and server supported sasl mechanisms.
     *
     * @param ismaster - An ismaster response from the server
     */
    resolveAuthMechanism(ismaster?: Document): MongoCredentials;
    validate(): void;
    static merge(creds: MongoCredentials | undefined, options: Partial<MongoCredentialsOptions>): MongoCredentials;
}
/** @public */
export declare interface MongoCredentialsOptions {
    username: string;
    password: string;
    source: string;
    db?: string;
    mechanism?: AuthMechanism;
    mechanismProperties: Document;
}
/** @public */
export declare class MongoDBNamespace {
    db: string;
    collection?: string;
    /**
     * Create a namespace object
     *
     * @param db - database name
     * @param collection - collection name
     */
    constructor(db: string, collection?: string);
    toString(): string;
    withCollection(collection: string): MongoDBNamespace;
    static fromString(namespace?: string): MongoDBNamespace;
}
/**
 * An error generated by the driver
 *
 * @public
 * @category Error
 */
export declare class MongoDriverError extends MongoError {
    code?: string;
    constructor(message: string);
    readonly name: string;
}
/**
 * @public
 * @category Error
 *
 * @privateRemarks
 * CSFLE has a dependency on this error, it uses the constructor with a string argument
 */
export declare class MongoError extends Error {
    /* Excluded from this release type: [kErrorLabels] */
    code?: number | string;
    topologyVersion?: TopologyVersion;
    constructor(message: string | Error);
    readonly name: string;
    /*Legacy name for server error responses */
    readonly errmsg: string;
    /**
     * Checks the error to see if it has an error label
     *
     * @param label - The error label to check for
     * @returns returns true if the error has the provided error label
     */
    hasErrorLabel(label: string): boolean;
    addErrorLabel(label: string): void;
    readonly errorLabels: string[];
}
/**
 * An error indicating an issue with the network, including TCP errors and timeouts.
 * @public
 * @category Error
 */
export declare class MongoNetworkError extends MongoError {
    /* Excluded from this release type: [kBeforeHandshake] */
    constructor(message: string | Error, options?: {
        beforeHandshake?: boolean;
    });
    readonly name: string;
}
/**
 * An error indicating a network timeout occurred
 * @public
 * @category Error
 *
 * @privateRemarks
 * CSFLE has a dependency on this error with an instanceof check
 */
export declare class MongoNetworkTimeoutError extends MongoNetworkError {
    constructor(message: string, options?: MongoNetworkTimeoutErrorOptions);
    readonly name: string;
}
/** @public */
export declare interface MongoNetworkTimeoutErrorOptions {
    /** Indicates the timeout happened before a connection handshake completed */
    beforeHandshake: boolean;
}
/**
 * Mongo Client Options
 * @public
 */
export declare interface MongoOptions extends Required<Pick<MongoClientOptions, 'autoEncryption' | 'compressors' | 'connectTimeoutMS' | 'directConnection' | 'driverInfo' | 'forceServerObjectId' | 'minHeartbeatFrequencyMS' | 'heartbeatFrequencyMS' | 'keepAlive' | 'keepAliveInitialDelay' | 'localThresholdMS' | 'logger' | 'maxIdleTimeMS' | 'maxPoolSize' | 'minPoolSize' | 'monitorCommands' | 'noDelay' | 'pkFactory' | 'promiseLibrary' | 'raw' | 'replicaSet' | 'retryReads' | 'retryWrites' | 'serverSelectionTimeoutMS' | 'socketTimeoutMS' | 'tlsAllowInvalidCertificates' | 'tlsAllowInvalidHostnames' | 'tlsInsecure' | 'waitQueueTimeoutMS' | 'zlibCompressionLevel'>>, SupportedNodeConnectionOptions {
    hosts: HostAddress[];
    srvHost?: string;
    credentials?: MongoCredentials;
    readPreference: ReadPreference;
    readConcern: ReadConcern;
    serverApi: ServerApi;
    writeConcern: WriteConcern;
    dbName: string;
    metadata: ClientMetadata;
    autoEncrypter?: AutoEncrypter;
    /* Excluded from this release type: connectionType */
    /* Excluded from this release type: encrypter */
    /* Excluded from this release type: userSpecifiedAuthSource */
    /* Excluded from this release type: userSpecifiedReplicaSet */
    /**
     * # NOTE ABOUT TLS Options
     *
     * If set TLS enabled, equivalent to setting the ssl option.
     *
     * ### Additional options:
     *
     * |    nodejs option     | MongoDB equivalent                                       | type                                   |
     * |:---------------------|--------------------------------------------------------- |:---------------------------------------|
     * | `ca`                 | `sslCA`, `tlsCAFile`                                     | `string \| Buffer \| Buffer[]`         |
     * | `crl`                | `sslCRL`                                                 | `string \| Buffer \| Buffer[]`         |
     * | `cert`               | `sslCert`, `tlsCertificateFile`, `tlsCertificateKeyFile` | `string \| Buffer \| Buffer[]`         |
     * | `key`                | `sslKey`, `tlsCertificateKeyFile`                        | `string \| Buffer \| KeyObject[]`      |
     * | `passphrase`         | `sslPass`, `tlsCertificateKeyFilePassword`               | `string`                               |
     * | `rejectUnauthorized` | `sslValidate`                                            | `boolean`                              |
     *
     */
    tls: boolean;
    /**
     * Turn these options into a reusable connection URI
     */
    toURI(): string;
}
/**
 * An error used when attempting to parse a value (like a connection string)
 * @public
 * @category Error
 */
export declare class MongoParseError extends MongoDriverError {
    constructor(message: string);
    readonly name: string;
}
/**
 * An error coming from the mongo server
 *
 * @public
 * @category Error
 */
export declare class MongoServerError extends MongoError {
    code?: number;
    codeName?: string;
    writeConcernError?: Document;
    constructor(message: Error | ErrorDescription);
    readonly name: string;
}
/**
 * An error signifying a client-side server selection error
 * @public
 * @category Error
 */
export declare class MongoServerSelectionError extends MongoSystemError {
    constructor(message: string, reason: TopologyDescription);
    readonly name: string;
}
/**
 * An error signifying a general system issue
 * @public
 * @category Error
 */
export declare class MongoSystemError extends MongoError {
    /** An optional reason context, such as an error saved during flow of monitoring and selecting servers */
    reason?: TopologyDescription;
    constructor(message: string, reason: TopologyDescription);
    readonly name: string;
}
/**
 * An error thrown when the server reports a writeConcernError
 * @public
 * @category Error
 */
export declare class MongoWriteConcernError extends MongoServerError {
    /** The result document (provided if ok: 1) */
    result?: Document;
    constructor(message: ErrorDescription, result: Document);
    readonly name: string;
}
/* Excluded from this release type: Monitor */
/** @public */
export declare type MonitorEvents = {
    serverHeartbeatStarted(event: ServerHeartbeatStartedEvent): void;
    serverHeartbeatSucceeded(event: ServerHeartbeatSucceededEvent): void;
    serverHeartbeatFailed(event: ServerHeartbeatFailedEvent): void;
    resetServer(error?: Error): void;
    resetConnectionPool(): void;
    close(): void;
} & EventEmitterWithState;
/** @public */
export declare interface MonitorOptions extends Pick<ConnectionOptions, Exclude<keyof ConnectionOptions, 'id' | 'generation' | 'hostAddress'>> {
    connectTimeoutMS: number;
    heartbeatFrequencyMS: number;
    minHeartbeatFrequencyMS: number;
}
/* Excluded from this release type: MonitorPrivate */
/* Excluded from this release type: Msg */
/** It avoids using fields with not acceptable types @public */
export declare type NotAcceptedFields<TSchema, FieldType> = {
    readonly [key in KeysOfOtherType<TSchema, FieldType>]?: never;
};
/** @public */
export declare type NumericType = IntegerType | Decimal128 | Double;
export { ObjectId };
/** @public */
export declare type OneOrMore<T> = T | T[];
/** @public */
export declare type OnlyFieldsOfType<TSchema, FieldType = any, AssignableType = FieldType> = IsAny<TSchema[keyof TSchema], Record<string, FieldType>, AcceptedFields<TSchema, FieldType, AssignableType> & NotAcceptedFields<TSchema, FieldType> & Record<string, AssignableType>>;
/* Excluded from this release type: OperationDescription */
/** @public */
export declare interface OperationOptions extends BSONSerializeOptions {
    /** Specify ClientSession for this command */
    session?: ClientSession;
    willRetryWrites?: boolean;
    /** The preferred read preference (ReadPreference.primary, ReadPreference.primary_preferred, ReadPreference.secondary, ReadPreference.secondary_preferred, ReadPreference.nearest). */
    readPreference?: ReadPreferenceLike;
}
/* Excluded from this release type: OperationParent */
/**
 * Represents a specific point in time on a server. Can be retrieved by using {@link Db#command}
 * @public
 * @remarks
 * See {@link https://docs.mongodb.com/manual/reference/method/db.runCommand/#response| Run Command Response}
 */
export declare type OperationTime = Timestamp;
/* Excluded from this release type: OpGetMoreOptions */
/* Excluded from this release type: OpQueryOptions */
/**
 * Add an optional _id field to an object shaped type
 * @public
 *
 * @privateRemarks
 * `ObjectId extends TSchema['_id']` is a confusing ordering at first glance. Rather than ask
 * `TSchema['_id'] extends ObjectId` which translated to "Is the _id property ObjectId?"
 * we instead ask "Does ObjectId look like (have the same shape) as the _id?"
 */
export declare type OptionalId<TSchema extends {
    _id?: any;
}> = ObjectId extends TSchema['_id'] ? EnhancedOmit<TSchema, '_id'> & {
    _id?: InferIdType<TSchema>;
} : WithId<TSchema>;
/** @public */
export declare class OrderedBulkOperation extends BulkOperationBase {
    constructor(collection: Collection, options: BulkWriteOptions);
    addToOperationsList(batchType: BatchType, document: Document | UpdateStatement | DeleteStatement): this;
}
/** @public */
export declare interface PipeOptions {
    end?: boolean;
}
/** @public */
export declare interface PkFactory {
    createPk(): any;
}
/** @public */
export declare const ProfilingLevel: Readonly<{
    readonly off: "off";
    readonly slowOnly: "slow_only";
    readonly all: "all";
}>;
/** @public */
export declare type ProfilingLevel = typeof ProfilingLevel[keyof typeof ProfilingLevel];
/** @public */
export declare type ProfilingLevelOptions = CommandOperationOptions;
/** @public */
export declare type Projection<TSchema> = {
    [Key in keyof TSchema]?: ProjectionOperators | 0 | 1 | boolean;
} & Partial<Record<string, ProjectionOperators | 0 | 1 | boolean>>;
/** @public */
export declare interface ProjectionOperators extends Document {
    $elemMatch?: Document;
    $slice?: number | [
        number,
        number
    ];
    $meta?: string;
    /** @deprecated Since MongoDB 3.2, Use FindCursor#max */
    $max?: any;
}
/**
 * Global promise store allowing user-provided promises
 * @public
 */
declare class Promise_2 {
    /** Validates the passed in promise library */
    static validate(lib: unknown): lib is PromiseConstructor;
    /** Sets the promise library */
    static set(lib: PromiseConstructor): void;
    /** Get the stored promise library, or resolves passed in */
    static get(): PromiseConstructor;
}
export { Promise_2 as Promise };
/** @public */
export declare type PullAllOperator<TSchema> = ({
    readonly [key in KeysOfAType<TSchema, ReadonlyArray<any>>]?: TSchema[key];
} & NotAcceptedFields<TSchema, ReadonlyArray<any>>) & {
    readonly [key: string]: any[];
};
/** @public */
export declare type PullOperator<TSchema> = ({
    readonly [key in KeysOfAType<TSchema, ReadonlyArray<any>>]?: Partial<Flatten<TSchema[key]>> | FilterOperations<Flatten<TSchema[key]>>;
} & NotAcceptedFields<TSchema, ReadonlyArray<any>>) & {
    readonly [key: string]: FilterOperators<any> | any;
};
/** @public */
export declare type PushOperator<TSchema> = ({
    readonly [key in KeysOfAType<TSchema, ReadonlyArray<any>>]?: Flatten<TSchema[key]> | ArrayOperator<Array<Flatten<TSchema[key]>>>;
} & NotAcceptedFields<TSchema, ReadonlyArray<any>>) & {
    readonly [key: string]: ArrayOperator<any> | any;
};
/* Excluded from this release type: Query */
/* Excluded from this release type: QueryOptions */
/**
 * The MongoDB ReadConcern, which allows for control of the consistency and isolation properties
 * of the data read from replica sets and replica set shards.
 * @public
 *
 * @see https://docs.mongodb.com/manual/reference/read-concern/index.html
 */
export declare class ReadConcern {
    level: ReadConcernLevel | string;
    /** Constructs a ReadConcern from the read concern level.*/
    constructor(level: ReadConcernLevel);
    /**
     * Construct a ReadConcern given an options object.
     *
     * @param options - The options object from which to extract the write concern.
     */
    static fromOptions(options?: {
        readConcern?: ReadConcernLike;
        level?: ReadConcernLevel;
    }): ReadConcern | undefined;
    static readonly MAJORITY: 'majority';
    static readonly AVAILABLE: 'available';
    static readonly LINEARIZABLE: 'linearizable';
    static readonly SNAPSHOT: 'snapshot';
    toJSON(): Document;
}
/** @public */
export declare const ReadConcernLevel: Readonly<{
    readonly local: "local";
    readonly majority: "majority";
    readonly linearizable: "linearizable";
    readonly available: "available";
    readonly snapshot: "snapshot";
}>;
/** @public */
export declare type ReadConcernLevel = typeof ReadConcernLevel[keyof typeof ReadConcernLevel];
/** @public */
export declare type ReadConcernLike = ReadConcern | {
    level: ReadConcernLevel;
} | ReadConcernLevel;
/**
 * The **ReadPreference** class is a class that represents a MongoDB ReadPreference and is
 * used to construct connections.
 * @public
 *
 * @see https://docs.mongodb.com/manual/core/read-preference/
 */
export declare class ReadPreference {
    mode: ReadPreferenceMode;
    tags?: TagSet[];
    hedge?: HedgeOptions;
    maxStalenessSeconds?: number;
    minWireVersion?: number;
    static PRIMARY: "primary";
    static PRIMARY_PREFERRED: "primaryPreferred";
    static SECONDARY: "secondary";
    static SECONDARY_PREFERRED: "secondaryPreferred";
    static NEAREST: "nearest";
    static primary: ReadPreference;
    static primaryPreferred: ReadPreference;
    static secondary: ReadPreference;
    static secondaryPreferred: ReadPreference;
    static nearest: ReadPreference;
    /**
     * @param mode - A string describing the read preference mode (primary|primaryPreferred|secondary|secondaryPreferred|nearest)
     * @param tags - A tag set used to target reads to members with the specified tag(s). tagSet is not available if using read preference mode primary.
     * @param options - Additional read preference options
     */
    constructor(mode: ReadPreferenceMode, tags?: TagSet[], options?: ReadPreferenceOptions);
    readonly preference: ReadPreferenceMode;
    static fromString(mode: string): ReadPreference;
    /**
     * Construct a ReadPreference given an options object.
     *
     * @param options - The options object from which to extract the read preference.
     */
    static fromOptions(options?: ReadPreferenceFromOptions): ReadPreference | undefined;
    /**
     * Replaces options.readPreference with a ReadPreference instance
     */
    static translate(options: ReadPreferenceLikeOptions): ReadPreferenceLikeOptions;
    /**
     * Validate if a mode is legal
     *
     * @param mode - The string representing the read preference mode.
     */
    static isValid(mode: string): boolean;
    /**
     * Validate if a mode is legal
     *
     * @param mode - The string representing the read preference mode.
     */
    isValid(mode?: string): boolean;
    /**
     * Indicates that this readPreference needs the "slaveOk" bit when sent over the wire
     *
     * @see https://docs.mongodb.com/manual/reference/mongodb-wire-protocol/#op-query
     */
    slaveOk(): boolean;
    /**
     * Check if the two ReadPreferences are equivalent
     *
     * @param readPreference - The read preference with which to check equality
     */
    equals(readPreference: ReadPreference): boolean;
    /** Return JSON representation */
    toJSON(): Document;
}
/** @public */
export declare interface ReadPreferenceFromOptions extends ReadPreferenceLikeOptions {
    session?: ClientSession;
    readPreferenceTags?: TagSet[];
    hedge?: HedgeOptions;
}
/** @public */
export declare type ReadPreferenceLike = ReadPreference | ReadPreferenceMode;
/** @public */
export declare interface ReadPreferenceLikeOptions extends ReadPreferenceOptions {
    readPreference?: ReadPreferenceLike | {
        mode?: ReadPreferenceMode;
        preference?: ReadPreferenceMode;
        tags?: TagSet[];
        maxStalenessSeconds?: number;
    };
}
/** @public */
export declare const ReadPreferenceMode: Readonly<{
    readonly primary: "primary";
    readonly primaryPreferred: "primaryPreferred";
    readonly secondary: "secondary";
    readonly secondaryPreferred: "secondaryPreferred";
    readonly nearest: "nearest";
}>;
/** @public */
export declare type ReadPreferenceMode = typeof ReadPreferenceMode[keyof typeof ReadPreferenceMode];
/** @public */
export declare interface ReadPreferenceOptions {
    /** Max secondary read staleness in seconds, Minimum value is 90 seconds.*/
    maxStalenessSeconds?: number;
    /** Server mode in which the same query is dispatched in parallel to multiple replica set members. */
    hedge?: HedgeOptions;
}
/** @public */
export declare type ReduceFunction<TKey = ObjectId, TValue = any> = (key: TKey, values: TValue[]) => TValue;
/** @public */
export declare type RegExpOrString<T> = T extends string ? BSONRegExp | RegExp | T : T;
/** @public */
export declare type RemoveUserOptions = CommandOperationOptions;
/** @public */
export declare interface RenameOptions extends CommandOperationOptions {
    /** Drop the target name collection if it previously exists. */
    dropTarget?: boolean;
    /** Unclear */
    new_collection?: boolean;
}
/** @public */
export declare interface ReplaceOneModel<TSchema extends Document = Document> {
    /** The filter to limit the replaced document. */
    filter: Filter<TSchema>;
    /** The document with which to replace the matched document. */
    replacement: TSchema;
    /** Specifies a collation. */
    collation?: CollationOptions;
    /** The index to use. If specified, then the query system will only consider plans using the hinted index. */
    hint?: Hint;
    /** When true, creates a new document if no document matches the query. */
    upsert?: boolean;
}
/** @public */
export declare interface ReplaceOptions extends CommandOperationOptions {
    /** If true, allows the write to opt-out of document level validation */
    bypassDocumentValidation?: boolean;
    /** Specifies a collation */
    collation?: CollationOptions;
    /** Specify that the update query should only consider plans using the hinted index */
    hint?: string | Document;
    /** When true, creates a new document if no document matches the query */
    upsert?: boolean;
}
/** @public */
export declare interface ResumeOptions {
    startAtOperationTime?: Timestamp;
    batchSize?: number;
    maxAwaitTimeMS?: number;
    collation?: CollationOptions;
    readPreference?: ReadPreference;
}
/**
 * Represents the logical starting point for a new or resuming {@link https://docs.mongodb.com/master/changeStreams/#change-stream-resume-token| Change Stream} on the server.
 * @public
 */
export declare type ResumeToken = unknown;
/** @public */
export declare const ReturnDocument: Readonly<{
    readonly BEFORE: "before";
    readonly AFTER: "after";
}>;
/** @public */
export declare type ReturnDocument = typeof ReturnDocument[keyof typeof ReturnDocument];
/** @public */
export declare interface RoleSpecification {
    /**
     * A role grants privileges to perform sets of actions on defined resources.
     * A given role applies to the database on which it is defined and can grant access down to a collection level of granularity.
     */
    role: string;
    /** The database this user's role should effect. */
    db: string;
}
/** @public */
export declare interface RootFilterOperators<TSchema> extends Document {
    $and?: Filter<TSchema>[];
    $nor?: Filter<TSchema>[];
    $or?: Filter<TSchema>[];
    $text?: {
        $search: string;
        $language?: string;
        $caseSensitive?: boolean;
        $diacriticSensitive?: boolean;
    };
    $where?: string | ((this: TSchema) => boolean);
    $comment?: string | Document;
}
/* Excluded from this release type: RTTPinger */
/* Excluded from this release type: RTTPingerOptions */
/** @public */
export declare type RunCommandOptions = CommandOperationOptions;
/** @public */
export declare type SchemaMember<T, V> = {
    [P in keyof T]?: V;
} | {
    [key: string]: V;
};
/** @public */
export declare interface SelectServerOptions {
    readPreference?: ReadPreferenceLike;
    /** How long to block for server selection before throwing an error */
    serverSelectionTimeoutMS?: number;
    session?: ClientSession;
}
/* Excluded from this release type: serialize */
/* Excluded from this release type: Server */
/** @public */
export declare interface ServerApi {
    version: ServerApiVersion;
    strict?: boolean;
    deprecationErrors?: boolean;
}
/** @public */
export declare const ServerApiVersion: Readonly<{
    readonly v1: "1";
}>;
/** @public */
export declare type ServerApiVersion = typeof ServerApiVersion[keyof typeof ServerApiVersion];
/** @public */
export declare class ServerCapabilities {
    maxWireVersion: number;
    minWireVersion: number;
    constructor(ismaster: Document);
    readonly hasAggregationCursor: boolean;
    readonly hasWriteCommands: boolean;
    readonly hasTextSearch: boolean;
    readonly hasAuthCommands: boolean;
    readonly hasListCollectionsCommand: boolean;
    readonly hasListIndexesCommand: boolean;
    readonly supportsSnapshotReads: boolean;
    readonly commandsTakeWriteConcern: boolean;
    readonly commandsTakeCollation: boolean;
}
/**
 * Emitted when server is closed.
 * @public
 * @category Event
 */
export declare class ServerClosedEvent {
    /** A unique identifier for the topology */
    topologyId: number;
    /** The address (host/port pair) of the server */
    address: string;
}
/**
 * The client's view of a single server, based on the most recent ismaster outcome.
 *
 * Internal type, not meant to be directly instantiated
 * @public
 */
export declare class ServerDescription {
    private _hostAddress;
    address: string;
    type: ServerType;
    hosts: string[];
    passives: string[];
    arbiters: string[];
    tags: TagSet;
    error?: MongoError;
    topologyVersion?: TopologyVersion;
    minWireVersion: number;
    maxWireVersion: number;
    roundTripTime: number;
    lastUpdateTime: number;
    lastWriteDate: number;
    me?: string;
    primary?: string;
    setName?: string;
    setVersion?: number;
    electionId?: ObjectId;
    logicalSessionTimeoutMinutes?: number;
    $clusterTime?: ClusterTime;
    /*Excluded from this release type: __constructor */
    readonly hostAddress: HostAddress;
    readonly allHosts: string[];
    /*Is this server available for reads*/
    readonly isReadable: boolean;
    /*Is this server data bearing */
    readonly isDataBearing: boolean;
    /*Is this server available for writes */
    readonly isWritable: boolean;
    readonly host: string;
    readonly port: number;
    /**
     * Determines if another `ServerDescription` is equal to this one per the rules defined
     * in the {@link https://github.com/mongodb/specifications/blob/master/source/server-discovery-and-monitoring/server-discovery-and-monitoring.rst#serverdescription|SDAM spec}
     */
    equals(other: ServerDescription): boolean;
}
/**
 * Emitted when server description changes, but does NOT include changes to the RTT.
 * @public
 * @category Event
 */
export declare class ServerDescriptionChangedEvent {
    /** A unique identifier for the topology */
    topologyId: number;
    /** The address (host/port pair) of the server */
    address: string;
    /** The previous server description */
    previousDescription: ServerDescription;
    /** The new server description */
    newDescription: ServerDescription;
}
/* Excluded from this release type: ServerDescriptionOptions */
/** @public */
export declare type ServerEvents = {
    serverHeartbeatStarted(event: ServerHeartbeatStartedEvent): void;
    serverHeartbeatSucceeded(event: ServerHeartbeatSucceededEvent): void;
    serverHeartbeatFailed(event: ServerHeartbeatFailedEvent): void;
    /* Excluded from this release type: connect */
    descriptionReceived(description: ServerDescription): void;
    closed(): void;
    ended(): void;
} & ConnectionPoolEvents & EventEmitterWithState;
/**
 * Emitted when the server monitor’s ismaster fails, either with an “ok: 0” or a socket exception.
 * @public
 * @category Event
 */
export declare class ServerHeartbeatFailedEvent {
    /** The connection id for the command */
    connectionId: string;
    /** The execution time of the event in ms */
    duration: number;
    /** The command failure */
    failure: Error;
}
/**
 * Emitted when the server monitor’s ismaster command is started - immediately before
 * the ismaster command is serialized into raw BSON and written to the socket.
 *
 * @public
 * @category Event
 */
export declare class ServerHeartbeatStartedEvent {
    /** The connection id for the command */
    connectionId: string;
}
/**
 * Emitted when the server monitor’s ismaster succeeds.
 * @public
 * @category Event
 */
export declare class ServerHeartbeatSucceededEvent {
    /** The connection id for the command */
    connectionId: string;
    /** The execution time of the event in ms */
    duration: number;
    /** The command reply */
    reply: Document;
}
/**
 * Emitted when server is initialized.
 * @public
 * @category Event
 */
export declare class ServerOpeningEvent {
    /** A unique identifier for the topology */
    topologyId: number;
    /** The address (host/port pair) of the server */
    address: string;
}
/** @public */
export declare type ServerOptions = Pick<ConnectionPoolOptions, Exclude<keyof ConnectionPoolOptions, 'id' | 'generation' | 'hostAddress'>> & MonitorOptions;
/* Excluded from this release type: ServerPrivate */
/* Excluded from this release type: ServerSelectionCallback */
/* Excluded from this release type: ServerSelectionRequest */
/** @public */
export declare type ServerSelector = (topologyDescription: TopologyDescription, servers: ServerDescription[]) => ServerDescription[];
/**
 * Reflects the existence of a session on the server. Can be reused by the session pool.
 * WARNING: not meant to be instantiated directly. For internal use only.
 * @public
 */
export declare class ServerSession {
    id: ServerSessionId;
    lastUse: number;
    txnNumber: number;
    isDirty: boolean;
    /* Excluded from this release type: __constructor */
    /**
     * Determines if the server session has timed out.
     *
     * @param sessionTimeoutMinutes - The server's "logicalSessionTimeoutMinutes"
     */
    hasTimedOut(sessionTimeoutMinutes: number): boolean;
}
/** @public */
export declare type ServerSessionId = {
    id: Binary;
};
/* Excluded from this release type: ServerSessionPool */
/**
 * An enumeration of server types we know about
 * @public
 */
export declare const ServerType: Readonly<{
    readonly Standalone: "Standalone";
    readonly Mongos: "Mongos";
    readonly PossiblePrimary: "PossiblePrimary";
    readonly RSPrimary: "RSPrimary";
    readonly RSSecondary: "RSSecondary";
    readonly RSArbiter: "RSArbiter";
    readonly RSOther: "RSOther";
    readonly RSGhost: "RSGhost";
    readonly Unknown: "Unknown";
}>;
/** @public */
export declare type ServerType = typeof ServerType[keyof typeof ServerType];
/** @public */
export declare type SetFields<TSchema> = ({
    readonly [key in KeysOfAType<TSchema, ReadonlyArray<any> | undefined>]?: OptionalId<Flatten<TSchema[key]>> | AddToSetOperators<Array<OptionalId<Flatten<TSchema[key]>>>>;
} & NotAcceptedFields<TSchema, ReadonlyArray<any> | undefined>) & {
    readonly [key: string]: AddToSetOperators<any> | any;
};
/** @public */
export declare type SetProfilingLevelOptions = CommandOperationOptions;
/** @public */
export declare type Sort = string | Exclude<SortDirection, {
    $meta: string;
}> | string[] | {
    [key: string]: SortDirection;
} | Map<string, SortDirection> | [
    string,
    SortDirection
][] | [
    string,
    SortDirection
];
/** @public */
export declare type SortDirection = 1 | -1 | 'asc' | 'desc' | 'ascending' | 'descending' | {
    $meta: string;
};
/* Excluded from this release type: SortDirectionForCmd */
/* Excluded from this release type: SortForCmd */
/* Excluded from this release type: SrvPoller */
/* Excluded from this release type: SrvPollerEvents */
/* Excluded from this release type: SrvPollerOptions */
/* Excluded from this release type: SrvPollingEvent */
/** @public */
export declare type Stream = Socket | TLSSocket;
/** @public */
export declare class StreamDescription {
    address: string;
    type: string;
    minWireVersion?: number;
    maxWireVersion?: number;
    maxBsonObjectSize: number;
    maxMessageSizeBytes: number;
    maxWriteBatchSize: number;
    compressors: CompressorName[];
    compressor?: CompressorName;
    logicalSessionTimeoutMinutes?: number;
    __nodejs_mock_server__?: boolean;
    zlibCompressionLevel?: number;
    constructor(address: string, options?: StreamDescriptionOptions);
    receiveResponse(response: Document): void;
}
/** @public */
export declare interface StreamDescriptionOptions {
    compressors?: CompressorName[];
}
/** @public */
export declare type SupportedNodeConnectionOptions = SupportedTLSConnectionOptions & SupportedTLSSocketOptions & SupportedSocketOptions;
/** @public */
export declare type SupportedSocketOptions = Pick<TcpNetConnectOpts, typeof LEGAL_TCP_SOCKET_OPTIONS[number]>;
/** @public */
export declare type SupportedTLSConnectionOptions = Pick<ConnectionOptions_2, Extract<keyof ConnectionOptions_2, typeof LEGAL_TLS_SOCKET_OPTIONS[number]>>;
/** @public */
export declare type SupportedTLSSocketOptions = Pick<TLSSocketOptions, Extract<keyof TLSSocketOptions, typeof LEGAL_TLS_SOCKET_OPTIONS[number]>>;
/** @public */
export declare type TagSet = {
    [key: string]: string;
};
/* Excluded from this release type: TimerQueue */
/** @public
 * Configuration options for timeseries collections
 * @see https://docs.mongodb.com/manual/core/timeseries-collections/
 */
export declare interface TimeSeriesCollectionOptions extends Document {
    timeField: string;
    metaField?: string;
    granularity?: string;
}
export { Timestamp };
/* Excluded from this release type: Topology */
/**
 * Emitted when topology is closed.
 * @public
 * @category Event
 */
export declare class TopologyClosedEvent {
    /** A unique identifier for the topology */
    topologyId: number;
}
/**
 * Representation of a deployment of servers
 * @public
 */
export declare class TopologyDescription {
    type: TopologyType;
    setName?: string;
    maxSetVersion?: number;
    maxElectionId?: ObjectId;
    servers: Map<string, ServerDescription>;
    stale: boolean;
    compatible: boolean;
    compatibilityError?: string;
    logicalSessionTimeoutMinutes?: number;
    heartbeatFrequencyMS: number;
    localThresholdMS: number;
    commonWireVersion?: number;
    /**
     * Create a TopologyDescription
     */
    constructor(topologyType: TopologyType, serverDescriptions?: Map<string, ServerDescription>, setName?: string, maxSetVersion?: number, maxElectionId?: ObjectId, commonWireVersion?: number, options?: TopologyDescriptionOptions);
    /*Excluded from this release type: updateFromSrvPollingEvent
    Excluded from this release type: update */
    readonly error: MongoError | undefined;
    /*
    * Determines if the topology description has any known servers
    */
    readonly hasKnownServers: boolean;
    /*
    * Determines if this topology description has a data-bearing server available.
    */
    readonly hasDataBearingServers: boolean;
}
/**
 * Emitted when topology description changes.
 * @public
 * @category Event
 */
export declare class TopologyDescriptionChangedEvent {
    /** A unique identifier for the topology */
    topologyId: number;
    /** The old topology description */
    previousDescription: TopologyDescription;
    /** The new topology description */
    newDescription: TopologyDescription;
}
/** @public */
export declare interface TopologyDescriptionOptions {
    heartbeatFrequencyMS?: number;
    localThresholdMS?: number;
}
/** @public */
export declare type TopologyEvents = {
    /* Excluded from this release type: connect */
    serverOpening(event: ServerOpeningEvent): void;
    serverClosed(event: ServerClosedEvent): void;
    serverDescriptionChanged(event: ServerDescriptionChangedEvent): void;
    topologyClosed(event: TopologyClosedEvent): void;
    topologyOpening(event: TopologyOpeningEvent): void;
    topologyDescriptionChanged(event: TopologyDescriptionChangedEvent): void;
    error(error: Error): void;
    /* Excluded from this release type: open */
    close(): void;
    timeout(): void;
} & Pick<ServerEvents, Exclude<keyof ServerEvents, 'connect'>> & ConnectionPoolEvents & ConnectionEvents & EventEmitterWithState;
/**
 * Emitted when topology is initialized.
 * @public
 * @category Event
 */
export declare class TopologyOpeningEvent {
    /** A unique identifier for the topology */
    topologyId: number;
}
/** @public */
export declare interface TopologyOptions extends BSONSerializeOptions, ServerOptions {
    hosts: HostAddress[];
    retryWrites: boolean;
    retryReads: boolean;
    /** How long to block for server selection before throwing an error */
    serverSelectionTimeoutMS: number;
    /** The name of the replica set to connect to */
    replicaSet?: string;
    srvHost?: string;
    /* Excluded from this release type: srvPoller */
    /** Indicates that a client should directly connect to a node without attempting to discover its topology type */
    directConnection: boolean;
    metadata: ClientMetadata;
    /** MongoDB server API version */
    serverApi?: ServerApi;
}
/* Excluded from this release type: TopologyPrivate */
/**
 * An enumeration of topology types we know about
 * @public
 */
export declare const TopologyType: Readonly<{
    readonly Single: "Single";
    readonly ReplicaSetNoPrimary: "ReplicaSetNoPrimary";
    readonly ReplicaSetWithPrimary: "ReplicaSetWithPrimary";
    readonly Sharded: "Sharded";
    readonly Unknown: "Unknown";
}>;
/** @public */
export declare type TopologyType = typeof TopologyType[keyof typeof TopologyType];
/** @public */
export declare interface TopologyVersion {
    processId: ObjectId;
    counter: Long;
}
/**
 * @public
 * A class maintaining state related to a server transaction. Internal Only
 */
export declare class Transaction {
    /* Excluded from this release type: state */
    options: TransactionOptions;
    /*Excluded from this release type: _pinnedServer
    Excluded from this release type: _recoveryToken
    Excluded from this release type: __constructor
    Excluded from this release type: server */
    readonly recoveryToken: Document | undefined;
    readonly isPinned: boolean;
    /*@returns Whether the transaction has started */
    readonly isStarting: boolean;
    /*
    * @returns Whether this session is presently in a transaction
    */
    readonly isActive: boolean;
}
/**
 * Configuration options for a transaction.
 * @public
 */
export declare interface TransactionOptions extends CommandOperationOptions {
    /** A default read concern for commands in this transaction */
    readConcern?: ReadConcern;
    /** A default writeConcern for commands in this transaction */
    writeConcern?: WriteConcern;
    /** A default read preference for commands in this transaction */
    readPreference?: ReadPreference;
    maxCommitTimeMS?: number;
}
/* Excluded from this release type: TxnState */
/**
 * Typescript type safe event emitter
 * @public
 */
export declare interface TypedEventEmitter<Events extends EventsDescription> extends EventEmitter {
    addListener<EventKey extends keyof Events>(event: EventKey, listener: Events[EventKey]): this;
    addListener(event: CommonEvents, listener: (eventName: string | symbol, listener: GenericListener) => void): this;
    addListener(event: string | symbol, listener: GenericListener): this;
    on<EventKey extends keyof Events>(event: EventKey, listener: Events[EventKey]): this;
    on(event: CommonEvents, listener: (eventName: string | symbol, listener: GenericListener) => void): this;
    on(event: string | symbol, listener: GenericListener): this;
    once<EventKey extends keyof Events>(event: EventKey, listener: Events[EventKey]): this;
    once(event: CommonEvents, listener: (eventName: string | symbol, listener: GenericListener) => void): this;
    once(event: string | symbol, listener: GenericListener): this;
    removeListener<EventKey extends keyof Events>(event: EventKey, listener: Events[EventKey]): this;
    removeListener(event: CommonEvents, listener: (eventName: string | symbol, listener: GenericListener) => void): this;
    removeListener(event: string | symbol, listener: GenericListener): this;
    off<EventKey extends keyof Events>(event: EventKey, listener: Events[EventKey]): this;
    off(event: CommonEvents, listener: (eventName: string | symbol, listener: GenericListener) => void): this;
    off(event: string | symbol, listener: GenericListener): this;
    removeAllListeners<EventKey extends keyof Events>(event?: EventKey | CommonEvents | symbol | string): this;
    listeners<EventKey extends keyof Events>(event: EventKey | CommonEvents | symbol | string): Events[EventKey][];
    rawListeners<EventKey extends keyof Events>(event: EventKey | CommonEvents | symbol | string): Events[EventKey][];
    emit<EventKey extends keyof Events>(event: EventKey | symbol, ...args: Parameters<Events[EventKey]>): boolean;
    listenerCount<EventKey extends keyof Events>(type: EventKey | CommonEvents | symbol | string): number;
    prependListener<EventKey extends keyof Events>(event: EventKey, listener: Events[EventKey]): this;
    prependListener(event: CommonEvents, listener: (eventName: string | symbol, listener: GenericListener) => void): this;
    prependListener(event: string | symbol, listener: GenericListener): this;
    prependOnceListener<EventKey extends keyof Events>(event: EventKey, listener: Events[EventKey]): this;
    prependOnceListener(event: CommonEvents, listener: (eventName: string | symbol, listener: GenericListener) => void): this;
    prependOnceListener(event: string | symbol, listener: GenericListener): this;
    eventNames(): string[];
    getMaxListeners(): number;
    setMaxListeners(n: number): this;
}
/**
 * Typescript type safe event emitter
 * @public
 */
export declare class TypedEventEmitter<Events extends EventsDescription> extends EventEmitter {
}
/** @public */
export declare class UnorderedBulkOperation extends BulkOperationBase {
    constructor(collection: Collection, options: BulkWriteOptions);
    handleWriteError(callback: Callback, writeResult: BulkWriteResult): boolean | undefined;
    addToOperationsList(batchType: BatchType, document: Document | UpdateStatement | DeleteStatement): this;
}
/** @public */
export declare interface UpdateDescription<TSchema extends Document = Document> {
    /**
     * A document containing key:value pairs of names of the fields that were
     * changed, and the new value for those fields.
     */
    updatedFields: Partial<TSchema>;
    /**
     * An array of field names that were removed from the document.
     */
    removedFields: string[];
}
/** @public */
export declare type UpdateFilter<TSchema> = {
    $currentDate?: OnlyFieldsOfType<TSchema, Date | Timestamp, true | {
        $type: 'date' | 'timestamp';
    }>;
    $inc?: OnlyFieldsOfType<TSchema, NumericType | undefined>;
    $min?: MatchKeysAndValues<TSchema>;
    $max?: MatchKeysAndValues<TSchema>;
    $mul?: OnlyFieldsOfType<TSchema, NumericType | undefined>;
    $rename?: Record<string, string>;
    $set?: MatchKeysAndValues<TSchema>;
    $setOnInsert?: MatchKeysAndValues<TSchema>;
    $unset?: OnlyFieldsOfType<TSchema, any, '' | true | 1>;
    $addToSet?: SetFields<TSchema>;
    $pop?: OnlyFieldsOfType<TSchema, ReadonlyArray<any>, 1 | -1>;
    $pull?: PullOperator<TSchema>;
    $push?: PushOperator<TSchema>;
    $pullAll?: PullAllOperator<TSchema>;
    $bit?: OnlyFieldsOfType<TSchema, NumericType | undefined, {
        and: IntegerType;
    } | {
        or: IntegerType;
    } | {
        xor: IntegerType;
    }>;
} & Document;
/** @public */
export declare interface UpdateManyModel<TSchema extends Document = Document> {
    /** The filter to limit the updated documents. */
    filter: Filter<TSchema>;
    /** A document or pipeline containing update operators. */
    update: UpdateFilter<TSchema> | UpdateFilter<TSchema>[];
    /** A set of filters specifying to which array elements an update should apply. */
    arrayFilters?: Document[];
    /** Specifies a collation. */
    collation?: CollationOptions;
    /** The index to use. If specified, then the query system will only consider plans using the hinted index. */
    hint?: Hint;
    /** When true, creates a new document if no document matches the query. */
    upsert?: boolean;
}
/** @public */
export declare interface UpdateOneModel<TSchema extends Document = Document> {
    /** The filter to limit the updated documents. */
    filter: Filter<TSchema>;
    /** A document or pipeline containing update operators. */
    update: UpdateFilter<TSchema> | UpdateFilter<TSchema>[];
    /** A set of filters specifying to which array elements an update should apply. */
    arrayFilters?: Document[];
    /** Specifies a collation. */
    collation?: CollationOptions;
    /** The index to use. If specified, then the query system will only consider plans using the hinted index. */
    hint?: Hint;
    /** When true, creates a new document if no document matches the query. */
    upsert?: boolean;
}
/** @public */
export declare interface UpdateOptions extends CommandOperationOptions {
    /** A set of filters specifying to which array elements an update should apply */
    arrayFilters?: Document[];
    /** If true, allows the write to opt-out of document level validation */
    bypassDocumentValidation?: boolean;
    /** Specifies a collation */
    collation?: CollationOptions;
    /** Specify that the update query should only consider plans using the hinted index */
    hint?: string | Document;
    /** When true, creates a new document if no document matches the query */
    upsert?: boolean;
    /** Map of parameter names and values that can be accessed using $$var (requires MongoDB 5.0). */
    let?: Document;
}
/** @public */
export declare interface UpdateResult {
    /** Indicates whether this write result was acknowledged. If not, then all other members of this result will be undefined */
    acknowledged: boolean;
    /** The number of documents that matched the filter */
    matchedCount: number;
    /** The number of documents that were modified */
    modifiedCount: number;
    /** The number of documents that were upserted */
    upsertedCount: number;
    /** The identifier of the inserted document if an upsert took place */
    upsertedId: ObjectId;
}
/** @public */
export declare interface UpdateStatement {
    /** The query that matches documents to update. */
    q: Document;
    /** The modifications to apply. */
    u: Document | Document[];
    /**  If true, perform an insert if no documents match the query. */
    upsert?: boolean;
    /** If true, updates all documents that meet the query criteria. */
    multi?: boolean;
    /** Specifies the collation to use for the operation. */
    collation?: CollationOptions;
    /** An array of filter documents that determines which array elements to modify for an update operation on an array field. */
    arrayFilters?: Document[];
    /** A document or string that specifies the index to use to support the query predicate. */
    hint?: Hint;
}
/** @public */
export declare interface ValidateCollectionOptions extends CommandOperationOptions {
    /** Validates a collection in the background, without interrupting read or write traffic (only in MongoDB 4.4+) */
    background?: boolean;
}
/** @public */
export declare type W = number | 'majority';
/* Excluded from this release type: WaitQueueMember */
/** @public */
export declare interface WiredTigerData extends Document {
    LSM: {
        'bloom filter false positives': number;
        'bloom filter hits': number;
        'bloom filter misses': number;
        'bloom filter pages evicted from cache': number;
        'bloom filter pages read into cache': number;
        'bloom filters in the LSM tree': number;
        'chunks in the LSM tree': number;
        'highest merge generation in the LSM tree': number;
        'queries that could have benefited from a Bloom filter that did not exist': number;
        'sleep for LSM checkpoint throttle': number;
        'sleep for LSM merge throttle': number;
        'total size of bloom filters': number;
    } & Document;
    'block-manager': {
        'allocations requiring file extension': number;
        'blocks allocated': number;
        'blocks freed': number;
        'checkpoint size': number;
        'file allocation unit size': number;
        'file bytes available for reuse': number;
        'file magic number': number;
        'file major version number': number;
        'file size in bytes': number;
        'minor version number': number;
    };
    btree: {
        'btree checkpoint generation': number;
        'column-store fixed-size leaf pages': number;
        'column-store internal pages': number;
        'column-store variable-size RLE encoded values': number;
        'column-store variable-size deleted values': number;
        'column-store variable-size leaf pages': number;
        'fixed-record size': number;
        'maximum internal page key size': number;
        'maximum internal page size': number;
        'maximum leaf page key size': number;
        'maximum leaf page size': number;
        'maximum leaf page value size': number;
        'maximum tree depth': number;
        'number of key/value pairs': number;
        'overflow pages': number;
        'pages rewritten by compaction': number;
        'row-store internal pages': number;
        'row-store leaf pages': number;
    } & Document;
    cache: {
        'bytes currently in the cache': number;
        'bytes read into cache': number;
        'bytes written from cache': number;
        'checkpoint blocked page eviction': number;
        'data source pages selected for eviction unable to be evicted': number;
        'hazard pointer blocked page eviction': number;
        'in-memory page passed criteria to be split': number;
        'in-memory page splits': number;
        'internal pages evicted': number;
        'internal pages split during eviction': number;
        'leaf pages split during eviction': number;
        'modified pages evicted': number;
        'overflow pages read into cache': number;
        'overflow values cached in memory': number;
        'page split during eviction deepened the tree': number;
        'page written requiring lookaside records': number;
        'pages read into cache': number;
        'pages read into cache requiring lookaside entries': number;
        'pages requested from the cache': number;
        'pages written from cache': number;
        'pages written requiring in-memory restoration': number;
        'tracked dirty bytes in the cache': number;
        'unmodified pages evicted': number;
    } & Document;
    cache_walk: {
        'Average difference between current eviction generation when the page was last considered': number;
        'Average on-disk page image size seen': number;
        'Clean pages currently in cache': number;
        'Current eviction generation': number;
        'Dirty pages currently in cache': number;
        'Entries in the root page': number;
        'Internal pages currently in cache': number;
        'Leaf pages currently in cache': number;
        'Maximum difference between current eviction generation when the page was last considered': number;
        'Maximum page size seen': number;
        'Minimum on-disk page image size seen': number;
        'On-disk page image sizes smaller than a single allocation unit': number;
        'Pages created in memory and never written': number;
        'Pages currently queued for eviction': number;
        'Pages that could not be queued for eviction': number;
        'Refs skipped during cache traversal': number;
        'Size of the root page': number;
        'Total number of pages currently in cache': number;
    } & Document;
    compression: {
        'compressed pages read': number;
        'compressed pages written': number;
        'page written failed to compress': number;
        'page written was too small to compress': number;
        'raw compression call failed, additional data available': number;
        'raw compression call failed, no additional data available': number;
        'raw compression call succeeded': number;
    } & Document;
    cursor: {
        'bulk-loaded cursor-insert calls': number;
        'create calls': number;
        'cursor-insert key and value bytes inserted': number;
        'cursor-remove key bytes removed': number;
        'cursor-update value bytes updated': number;
        'insert calls': number;
        'next calls': number;
        'prev calls': number;
        'remove calls': number;
        'reset calls': number;
        'restarted searches': number;
        'search calls': number;
        'search near calls': number;
        'truncate calls': number;
        'update calls': number;
    };
    reconciliation: {
        'dictionary matches': number;
        'fast-path pages deleted': number;
        'internal page key bytes discarded using suffix compression': number;
        'internal page multi-block writes': number;
        'internal-page overflow keys': number;
        'leaf page key bytes discarded using prefix compression': number;
        'leaf page multi-block writes': number;
        'leaf-page overflow keys': number;
        'maximum blocks required for a page': number;
        'overflow values written': number;
        'page checksum matches': number;
        'page reconciliation calls': number;
        'page reconciliation calls for eviction': number;
        'pages deleted': number;
    } & Document;
}
/* Excluded from this release type: WithConnectionCallback */
/** Add an _id field to an object shaped type @public */
export declare type WithId<TSchema> = EnhancedOmit<TSchema, '_id'> & {
    _id: InferIdType<TSchema>;
};
/** Remove the _id field from an object shaped type @public */
export declare type WithoutId<TSchema> = Pick<TSchema, Exclude<keyof TSchema, '_id'>>;
/** @public */
export declare type WithSessionCallback = (session: ClientSession) => Promise<any> | void;
/** @public */
export declare type WithTransactionCallback<T = void> = (session: ClientSession) => Promise<T>;
/**
 * A MongoDB WriteConcern, which describes the level of acknowledgement
 * requested from MongoDB for write operations.
 * @public
 *
 * @see https://docs.mongodb.com/manual/reference/write-concern/
 */
export declare class WriteConcern {
    /** request acknowledgment that the write operation has propagated to a specified number of mongod instances or to mongod instances with specified tags. */
    w?: W;
    /** specify a time limit to prevent write operations from blocking indefinitely */
    wtimeout?: number;
    /** request acknowledgment that the write operation has been written to the on-disk journal */
    j?: boolean;
    /** equivalent to the j option */
    fsync?: boolean | 1;
    /**
     * Constructs a WriteConcern from the write concern properties.
     * @param w - request acknowledgment that the write operation has propagated to a specified number of mongod instances or to mongod instances with specified tags.
     * @param wtimeout - specify a time limit to prevent write operations from blocking indefinitely
     * @param j - request acknowledgment that the write operation has been written to the on-disk journal
     * @param fsync - equivalent to the j option
     */
    constructor(w?: W, wtimeout?: number, j?: boolean, fsync?: boolean | 1);
    /** Construct a WriteConcern given an options object. */
    static fromOptions(options?: WriteConcernOptions | WriteConcern | W, inherit?: WriteConcernOptions | WriteConcern): WriteConcern | undefined;
}
/**
 * An error representing a failure by the server to apply the requested write concern to the bulk operation.
 * @public
 * @category Error
 */
export declare class WriteConcernError {
    err: MongoServerError;
    constructor(err: MongoServerError);
    /*Write concern error code. */
    readonly code: number | undefined;
    /*Write concern error message. */
    readonly errmsg: string;
    toJSON(): {
        code?: number;
        errmsg: string;
    };
    toString(): string;
}
/** @public */
export declare interface WriteConcernOptions {
    /** Write Concern as an object */
    writeConcern?: WriteConcern | WriteConcernSettings;
}
/** @public */
export declare interface WriteConcernSettings {
    /** The write concern */
    w?: W;
    /** The write concern timeout */
    wtimeoutMS?: number;
    /** The journal write concern */
    journal?: boolean;
    /** The journal write concern */
    j?: boolean;
    /** The write concern timeout */
    wtimeout?: number;
    /** The file sync write concern */
    fsync?: boolean | 1;
}
/**
 * An error that occurred during a BulkWrite on the server.
 * @public
 * @category Error
 */
export declare class WriteError {
    err: BulkWriteOperationError;
    constructor(err: BulkWriteOperationError);
    /*WriteError code. */
    readonly code: number;
    /*WriteError original bulk operation index. */
    readonly index: number;
    /*WriteError message. */
    readonly errmsg: string | undefined;
    /** Returns the underlying operation that caused the error */
    getOperation(): Document;
    toJSON(): {
        code: number;
        index: number;
        errmsg?: string;
        op: Document;
    };
    toString(): string;
}
/* Excluded from this release type: WriteProtocolMessageType */
export {};