const { Schema, model } = require("mongoose");

const cardSchema = new Schema({
    _id: Schema.Types.ObjectId,
    id: String,
    name: String,
    rarity: String,
    style: String,
    category: String,
    group: String,
    artist: String,
    aiModel: String,
    url: String,
    fullArt: String,
    dateAdded: String,
})

module.exports = model("Card", cardSchema);