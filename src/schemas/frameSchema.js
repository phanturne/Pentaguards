const { Schema, model } = require("mongoose");

const frameSchema = new Schema({
    _id: Schema.Types.ObjectId,
    id: String,
    name: String,
    rarity: String,
    orientation: String,
    artist: String,
    aiModel: String,
    url: String,
    filledURL: String,
    dateAdded: String,
    left: Number,
    right: Number,
    top: Number,
    bottom: Number,
    width: Number,
    length: Number,
    scale: Number,
    newWidth: Number,
    newLength: Number,
    lengthShift: Number,
    widthShift: Number,
})

module.exports = model("Frame", frameSchema);