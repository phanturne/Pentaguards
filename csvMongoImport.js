// Source: https://www.bezkoder.com/node-js-csv-mongodb-collection/
const mongodb = require("mongodb").MongoClient;
const csvtojson = require("csvtojson");

// Allow access to the environment variables of the running node process
require("dotenv").config();
const { databaseToken } = process.env

csvtojson()
    // CHOOSE CSV TO UPLOAD (CARDS, FRAMES, ARTISTS)
    // .fromFile("Pentaguards Database - New Artists.csv")
    .fromFile("Pentaguards Database - New Cards.csv")
    .then(csvData => {
        // console.log(csvData);

        mongodb.connect(
            databaseToken,
            { useNewUrlParser: true, useUnifiedTopology: true },
            (err, client) => {
                if (err) throw err;

                client
                    .db("TCG")
                    // CHOOSE COLLECTION TO UPDATE (SHOULD BE THE SAME TYPE AS THE CSV)
                    // .collection("artists")
                    // .collection("frames")
                    .collection("cards")
                    .insertMany(csvData, (err, res) => {
                        if (err) throw err;

                        console.log(`Inserted: ${res.insertedCount} rows`);
                        client.close();
                    });
            }
        );
    });