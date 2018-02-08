var MongoClient = require('mongodb').MongoClient,
    assert = require("assert");

var connectionUrl = "mongodb://localhost:27017/dbName

function createConnection(connectionUrl) {
    return new Promise((resolve, reject) => {
        MongoClient.connect(connectionUrl, function(error, db) {
            if (error) {
                reject(false);
            }
            if (db) {
                resolve(db);
            }
        });
    });
}

function find(req) {
    return new Promise((resolve, reject) => {
        try {
            var options = req;
            /** check documents limit */
            if (options.limit == undefined)
                options.limit = '';
            /** check documents projection. In this we can get particular fields from collection */
            if (options.projection == undefined)
                options.projection = '';
            /** sort documents in ascendeing or descending order */
            if (options.sort == undefined)
                options.sort = {};
            createConnection(connectionUrl).then(function(db) {
                if (req.findType == undefined || req.findType == "many") {
                    db.collection(options.collection).find(options.query, options.projection, { limit: options.limit }).sort(options.sort).toArray(function(error, data) {
                        if (error) {
                            reject(false);
                        }
                        if (data) {
                            resolve(data);
                        }
                    });
                }
                if (req.findType == "one") {
                    db.collection(options.collection).findOne(options.query, options.projection).toArray(function(error, data) {
                        if (error) {
                            reject(false);
                        }
                        if (data) {
                            resolve(data);
                        }
                    });
                }
            });

        } catch (error) {
            console.log(error);
        }
    });
}

function insert(req) {
    return new Promise((resolve, reject) => {
        try {
            createConnection(connectionUrl).then(function(db) {
                /** insert multiple records */
                if (req.insertType == undefined || req.insertType == "many") {
                    db.collection(req.collection).insertMany(req.query, function(error, response) {
                        if (error)
                            reject(false);
                        if (response)
                            resolve(true);
                    })
                }
                /** insert single records */
                else if (req.insertType == "one") {
                    db.collection(req.collection).insertOne(req.query, function(error, response) {
                        if (error)
                            reject(false);
                        if (response)
                            resolve(true);
                    });
                };
            });
        } catch (error) {
            console.log(error);
        }
    });
}

function update(req) {
    return new Promise((resolve, reject) => {
        createConnection(connectionUrl).then(function(db) {
            /** update multiple records */
            if (req.updateType == undefined || req.updateType == "many") {
                db.collection(req.collection).updateMany(req.query.find, req.query.set, function(error, data) {
                    if (error)
                        reject(false);
                    if (data)
                        resolve(true);
                });
            }
            /** update single records */
            else if (req.updateType == "one") {
                db.collection(req.collection).updateOne(req.query.find, req.query.set, function(error, data) {
                    if (error)
                        reject(false);
                    if (data)
                        resolve(true);
                });
            }
        });
    });
}
