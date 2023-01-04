const { Schema, model } = require("mongoose");

const uniqueIDSchema = new Schema({
    _id: Schema.Types.ObjectId,
    id: String,
    cardID: String,
    printNumber: Number,
    ownerID: String,
    ownerName: String,
    condition: String,
    frameID: String,
})

module.exports = model("UniqueID", uniqueIDSchema);