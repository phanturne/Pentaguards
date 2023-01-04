const { Schema, model } = require("mongoose");

const profileSchema = new Schema({
    _id: Schema.Types.ObjectId,
    id: String,
    name: String,
    dateJoined: String,
    guild: String,
    silver: Number,
    gold: Number,
    diamond: Number,
    dust: Number,
    wishlist: [String],
    cardsList: [String]
})

module.exports = model("Profile", profileSchema);