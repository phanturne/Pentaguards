const { Schema, model } = require("mongoose");

const cardSchema = new Schema({
    _id: Schema.Types.ObjectId,
    id: String,
    artworkID: String,
    printNumber: Number,
    ownerID: String,
    ownerName: String,
    condition: String,
    dropCount: { type: Number, default: 0 },
    claimCount: { type: Number, default: 0 },
    wishlistCount: { type: Number, default: 0 },
    scrapCount: { type: Number, default: 0 },
})

module.exports = model("Card", cardSchema);