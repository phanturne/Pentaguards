const { Schema, model } = require("mongoose");

const chestSchema = new Schema({
    _id: Schema.Types.ObjectId,
    name: String,
    maxClaims: Number,
    minSilver: Number,
    maxSilver: Number,
    minGold: Number,
    maxGold: Number,
    minShards: Number,
    maxShards: Number,
    minDiamonds: Number,
    maxDiamonds: Number,
})

module.exports = model("Chest", chestSchema);