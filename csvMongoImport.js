// Source: https://www.bezkoder.com/node-js-csv-mongodb-collection/
const mongodb = require("mongodb").MongoClient;
const csvtojson = require("csvtojson");

// Allow access to the environment variables of the running node process
require("dotenv").config();
const { databaseToken } = process.env

csvtojson()
    .fromFile("Pentaguards Database - Artists.csv")
    .then(csvData => {
        console.log(csvData);

        mongodb.connect(
            databaseToken,
            { useNewUrlParser: true, useUnifiedTopology: true },
            (err, client) => {
                if (err) throw err;

                client
                    .db("TCG")
                    .collection("artists")
                    .insertMany(csvData, (err, res) => {
                        if (err) throw err;

                        console.log(`Inserted: ${res.insertedCount} rows`);
                        client.close();
                    });
            }
        );
    });