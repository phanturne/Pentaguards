module.exports = {
    async generateRandomID(length) {
        let randomID;
        while (true) {
            randomID = Math.random().toString(36).substring(0, length).toUpperCase();
            const existingCard = Card.findOne( { id: randomID } );
            if (!existingCard) break;
        }
        return randomID;
    }
}