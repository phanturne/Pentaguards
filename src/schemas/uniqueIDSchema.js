const { Schema, model } = require("mongoose");

const uniqueIDSchema = new Schema({
    _id: Schema.Types.ObjectId,
    id: String,
    cardID: String,
    printNumber: Number,
    condition: String,
    frame: String,
})

module.exports = model("UniqueID", uniqueIDSchema);