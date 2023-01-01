const { Schema, model } = require("mongoose");

const artistSchema = new Schema({
    _id: Schema.Types.ObjectId,
    id: String,
    artist: String,
    profilePic: String,
    aiModels: String,
    pixiv: String,
    pixivFanbox: String,
    artStation: String,
    deviantArt: String,
    discord: String,
    twitter: String,
    instagram: String,
})

module.exports = model("Artist", artistSchema);