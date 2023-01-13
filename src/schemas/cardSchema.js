const { Schema, model } = require("mongoose");

const cardSchema = new Schema({
    _id: Schema.Types.ObjectId,
    id: String,
    name: String,
    rarity: String,
    style: String,
    category: String,
    group: { type: String, default: "N/A" },
    artist: String,
    artistID: String,
    aiModel: { type: String, default: "Unknown" },
    url: String,
    fullArt: String,
    dateAdded: String,
    dropCount: { type: Number, default: 0 },
    claimCount: { type: Number, default: 0 },
    wishlistCount: { type: Number, default: 0 },
    scrapCount: { type: Number, default: 0 },
})

module.exports = model("Card", cardSchema);