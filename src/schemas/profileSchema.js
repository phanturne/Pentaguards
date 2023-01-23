const { Schema, model } = require("mongoose");

const profileSchema = new Schema({
    _id: Schema.Types.ObjectId,
    id: String,
    name: String,
    dateJoined: String,
    guild: { type: String, default: "N/A" },
    silver: { type: Number, default: 0 },
    gold: { type: Number, default: 0 },
    diamond: { type: Number, default: 0 },
    shards: { type: Number, default: 0 },
    wishlist: { type: [String], default: [] },
    cardsList: { type: [String], default: [] },
    decks: { type: [[String]], default: [] },
})

module.exports = model("Profile", profileSchema);