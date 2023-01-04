const sharp = require('sharp')

module.exports = {
    async createCard(comboID, cardId, frameId, newWidth, newLength, lengthShift, widthShift) {
        const padTop = Math.ceil((540 - newLength) / 2 - lengthShift);
        const padBottom = Math.floor((540 - newLength) / 2 + lengthShift);
        const padLeft = Math.ceil((360 - newWidth) / 2 - widthShift);
        const padRight = Math.floor((360 - newWidth) / 2 + widthShift);

        // Calculate the file names
        const cardPath = `${__dirname}/../../assets/cards/${cardId}.png`;
        const framePath = `${__dirname}/../../assets/frames/${frameId}.png`;
        const filledFramePath = `${__dirname}/../../assets/filledFrames/${frameId}.png`;

        // Resize card image based on the frame's new width and height
        const resizedImg = await sharp(cardPath)
            .resize({
                width: newWidth,
                height: newLength,
            })
            .extend({
                // Pad the image w/ invisible pixels on all sides until its the same size as before
                top: padTop,
                bottom: padBottom,
                left: padLeft,
                right: padRight,
            })
            .toBuffer()
            .catch(err => {
                console.log("Error: ", err);
            });

        // Apply an overlay to get the card in the shape of the filled frame
        let composite = await sharp(resizedImg)
            .composite([{
                input: filledFramePath,
                blend: "dest-atop",
            }])
            .toBuffer();

        // Apply an overlay to frame-shaped card to add the actual frame on top
        return await sharp(composite)
            .composite([
                {
                    input: framePath,
                },
            ])
            .toBuffer();
    },
}

