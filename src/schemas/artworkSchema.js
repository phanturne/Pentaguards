const { Schema, model } = require('mongoose');

const artworkSchema = new Schema({
	_id: Schema.Types.ObjectId,
	id: String,
	name: String,
	rarity: String,
	theme: String,
	category: String,
	style: String,
	group: { type: String, default: 'N/A' },
	artist: String,
	artistID: String,
	aiModel: { type: String, default: 'Unknown' },
	imageUrl: String,
	fullArt: String,
	dateAdded: String,
});

module.exports = model('Artwork', artworkSchema);