const sharp = require('sharp')

module.exports = {
    async createCard(comboID, cardId, borderId, newWidth, newLength) {
        // Calculate the file names
        const cardPath = `${__dirname}/../../assets/cards/${cardId}.png`;
        const borderPath = `${__dirname}/../../assets/frames/${borderId}.png`;
        const filledBorderPath = `${__dirname}/../../assets/filledFrames/${borderId}.png`;
        const finalOutput = `${__dirname}/${comboID}.png`;

        // Resize card image based on the frame's new width and height
        const resizedImg = await sharp(cardPath)
            .resize({
                fit: sharp.fit.contain,
                withoutEnlargement: true,
                width: newWidth,
                height: newLength,
            })
            .extend({
                // Pad the image w/ invisible pixels on all sides until its the same size as before
                top: Math.ceil((540 - newLength) / 2),
                bottom: Math.floor((540 - newLength) / 2),
                left: Math.ceil((360 - newWidth) / 2),
                right: Math.floor((360 - newWidth) / 2),
                background: { r: 0, g: 0, b: 0, alpha: 0 }
            })
            // .toFile(`cardCombos/${comboID}-resized`)
            .toBuffer()
            .catch(err => {
                console.log("Error: ", err);
            });

        // Apply an overlay to get the card in the shape of the filled frame
        let composite = await sharp(resizedImg)
            .composite([{
                input: filledBorderPath,
                blend: "dest-atop"
            }])
            .toBuffer();

        // await sharp(filledBorderPath)
        //     .toBuffer({ resolveWithObject: true })
        //     .then(({ data, info }) => {
        //         composite = sharp(resizedImg)
        //             .composite([{
        //                 input: data,
        //                 blend: "dest-atop"
        //             }])
        //             .toBuffer();
        //             // .toFile(`${__dirname}/temp/composite.png`, function(err) {
        //             //     console.log("Error: ", err)
        //             // });
        //         console.log(info);
        //     })
        //     .catch(err => {
        //         console.log("Error: ", err);
        //     });

        // Apply an overlay to frame-shaped card to add the actual frame on top
        await sharp(composite)
            .composite([
                {
                    input: borderPath,
                    top: 0,
                    left: 0,
                },
            ])
            .toFile(finalOutput);

        return finalOutput;
    },

    async combineCards() {
        return 0;
    }
}

