const sharp = require('sharp')

module.exports = {
    async createCard(comboID, cardId, borderId, newWidth, newLength, lengthShift, widthShift) {
        const padTop = Math.ceil((540 - newLength) / 2 - lengthShift);
        const padBottom = Math.floor((540 - newLength) / 2 + lengthShift);
        const padLeft = Math.ceil((360 - newWidth) / 2 - widthShift);
        const padRight = Math.floor((360 - newWidth) / 2 + widthShift);

        // Calculate the file names
        const cardPath = `${__dirname}/../../assets/cards/${cardId}.png`;
        const borderPath = `${__dirname}/../../assets/frames/${borderId}.png`;
        const filledBorderPath = `${__dirname}/../../assets/filledFrames/${borderId}.png`;

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
                input: filledBorderPath,
                blend: "dest-atop",
            }])
            .toBuffer();

        // Apply an overlay to frame-shaped card to add the actual frame on top
        return await sharp(composite)
            .composite([
                {
                    input: borderPath,
                },
            ])
            .toBuffer();
    },

    async combineCards(cardList) {
        // Extend the size of the first card to fit other cards
        // Resize card image based on the frame's new width and height
        let extendedImg = await sharp(cardList[0].attachment)
            .extend({
                // Pad the image w/ invisible pixels on all sides until its the same size as before
                top: 0,
                bottom: 0,
                left: 0,
                right: cardList.length * 400,
                background: { r: 0, g: 0, b: 0, alpha: 0 }
            })
            .toBuffer()
            .catch(err => {
                console.log("Error: ", err);
            });

        // Overlay the other cards on the extended image
        for (let i = 1; i < cardList.length; i++) {
            // Apply an overlay to frame-shaped card to add the actual frame on top
            extendedImg = await sharp(extendedImg)
                .composite([
                    {
                        input: cardList[i].attachment,
                        top: 0,
                        left: 400 * i + 20,
                    },
                ])
                .toBuffer();
        }

        return extendedImg;
    }
}

