const { Schema, model } = require("mongoose");

const artistSchema = new Schema({
    _id: Schema.Types.ObjectId,
    id: String,
    name: { type: String, default: "Anonymous" },
    profilePic: String,
    aiModels: String,
    pixiv: String,
    pixivFanbox: String,
    artStation: String,
    deviantArt: String,
    discord: String,
    discordID: String,
    twitter: String,
    instagram: String,
    patreon: String,
    xiaohongshu: String,
})

module.exports = model("Artist", artistSchema);