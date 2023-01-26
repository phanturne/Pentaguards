const { Schema, model } = require('mongoose');

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
	finalWidth: Number,
	finalLength: Number,
	lengthShift: Number,
	widthShift: Number,
	cardRatio: Number,
	finalRatio: Number,
});

module.exports = model('Frame', frameSchema);