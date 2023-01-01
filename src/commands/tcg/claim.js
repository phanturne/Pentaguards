


// Get one random document from the mycoll collection.
db.mycoll.aggregate([{ $sample: { size: 1 } }])