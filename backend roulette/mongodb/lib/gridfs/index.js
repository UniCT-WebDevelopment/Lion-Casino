"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridFSBucket = void 0;
const error_1 = require("../error");
const download_1 = require("./download");
const upload_1 = require("./upload");
const utils_1 = require("../utils");
const write_concern_1 = require("../write_concern");
const mongo_types_1 = require("../mongo_types");
const DEFAULT_GRIDFS_BUCKET_OPTIONS = {
    bucketName: 'fs',
    chunkSizeBytes: 255 * 1024
};
/**
 * Constructor for a streaming GridFS interface
 * @public
 */
class GridFSBucket extends mongo_types_1.TypedEventEmitter {
    constructor(db, options) {
        super();
        this.setMaxListeners(0);
        const privateOptions = {
            ...DEFAULT_GRIDFS_BUCKET_OPTIONS,
            ...options,
            writeConcern: write_concern_1.WriteConcern.fromOptions(options)
        };
        this.s = {
            db,
            options: privateOptions,
            _chunksCollection: db.collection(privateOptions.bucketName + '.chunks'),
            _filesCollection: db.collection(privateOptions.bucketName + '.files'),
            checkedIndexes: false,
            calledOpenUploadStream: false
        };
    }
    /**
     * Returns a writable stream (GridFSBucketWriteStream) for writing
     * buffers to GridFS. The stream's 'id' property contains the resulting
     * file's id.
     *
     * @param filename - The value of the 'filename' key in the files doc
     * @param options - Optional settings.
     */
    openUploadStream(filename, options) {
        return new upload_1.GridFSBucketWriteStream(this, filename, options);
    }
    /**
     * Returns a writable stream (GridFSBucketWriteStream) for writing
     * buffers to GridFS for a custom file id. The stream's 'id' property contains the resulting
     * file's id.
     */
    openUploadStreamWithId(id, filename, options) {
        return new upload_1.GridFSBucketWriteStream(this, filename, { ...options, id });
    }
    /** Returns a readable stream (GridFSBucketReadStream) for streaming file data from GridFS. */
    openDownloadStream(id, options) {
        return new download_1.GridFSBucketReadStream(this.s._chunksCollection, this.s._filesCollection, this.s.options.readPreference, { _id: id }, options);
    }
    delete(id, callback) {
        return utils_1.executeLegacyOperation(utils_1.getTopology(this.s.db), _delete, [this, id, callback], {
            skipSessions: true
        });
    }
    /** Convenience wrapper around find on the files collection */
    find(filter, options) {
        filter !== null && filter !== void 0 ? filter : (filter = {});
        options = options !== null && options !== void 0 ? options : {};
        return this.s._filesCollection.find(filter, options);
    }
    /**
     * Returns a readable stream (GridFSBucketReadStream) for streaming the
     * file with the given name from GridFS. If there are multiple files with
     * the same name, this will stream the most recent file with the given name
     * (as determined by the `uploadDate` field). You can set the `revision`
     * option to change this behavior.
     */
    openDownloadStreamByName(filename, options) {
        let sort = { uploadDate: -1 };
        let skip = undefined;
        if (options && options.revision != null) {
            if (options.revision >= 0) {
                sort = { uploadDate: 1 };
                skip = options.revision;
            }
            else {
                skip = -options.revision - 1;
            }
        }
        return new download_1.GridFSBucketReadStream(this.s._chunksCollection, this.s._filesCollection, this.s.options.readPreference, { filename }, { ...options, sort, skip });
    }
    rename(id, filename, callback) {
        return utils_1.executeLegacyOperation(utils_1.getTopology(this.s.db), _rename, [this, id, filename, callback], {
            skipSessions: true
        });
    }
    drop(callback) {
        return utils_1.executeLegacyOperation(utils_1.getTopology(this.s.db), _drop, [this, callback], {
            skipSessions: true
        });
    }
    /** Get the Db scoped logger. */
    getLogger() {
        return this.s.db.s.logger;
    }
}
exports.GridFSBucket = GridFSBucket;
/**
 * When the first call to openUploadStream is made, the upload stream will
 * check to see if it needs to create the proper indexes on the chunks and
 * files collections. This event is fired either when 1) it determines that
 * no index creation is necessary, 2) when it successfully creates the
 * necessary indexes.
 * @event
 */
GridFSBucket.INDEX = 'index';
function _delete(bucket, id, callback) {
    return bucket.s._filesCollection.deleteOne({ _id: id }, (error, res) => {
        if (error) {
            return callback(error);
        }
        return bucket.s._chunksCollection.deleteMany({ files_id: id }, error => {
            if (error) {
                return callback(error);
            }
            // Delete orphaned chunks before returning FileNotFound
            if (!(res === null || res === void 0 ? void 0 : res.deletedCount)) {
                const errmsg = 'FileNotFound: no file with id ' + id + ' found';
                return callback(new error_1.MongoDriverError(errmsg));
            }
            return callback();
        });
    });
}
function _rename(bucket, id, filename, callback) {
    const filter = { _id: id };
    const update = { $set: { filename } };
    return bucket.s._filesCollection.updateOne(filter, update, (error, res) => {
        if (error) {
            return callback(error);
        }
        if (!(res === null || res === void 0 ? void 0 : res.matchedCount)) {
            return callback(new error_1.MongoDriverError(`File with id ${id} not found`));
        }
        return callback();
    });
}
function _drop(bucket, callback) {
    return bucket.s._filesCollection.drop((error) => {
        if (error) {
            return callback(error);
        }
        return bucket.s._chunksCollection.drop((error) => {
            if (error) {
                return callback(error);
            }
            return callback();
        });
    });
}
//# sourceMappingURL=index.js.map