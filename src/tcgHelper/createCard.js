const sharp = require('sharp')

module.exports = {
    async createCard(comboID, cardURL, filledBorderURL, borderURL, newWidth, newLength) {
        // Calculate the padding needed and new file name
        const lengthPad = Math.ceil((540 - newLength) / 2);
        const widthPad = Math.ceil((360 - newWidth) / 2);
        const finalOutput = __dirname + comboID;

        // Resize card image based on the frame's new width and height
        const resizedImg = await sharp(cardURL)
            .resize({
                fit: sharp.fit.contain,
                withoutEnlargement: true,
                width: newWidth,
                height: newLength,
            })
            .extend({
                // Pad the image w/ invisible pixels on all sides until its the same size as before
                top: lengthPad,
                bottom: lengthPad,
                left: widthPad,
                right: widthPad,
                background: { r: 0, g: 0, b: 0, alpha: 0 }
            })
            // .toFile(`cardCombos/${comboID}-resized`);
            .toBuffer()
            .catch(err => {
                console.log("Error: ", err);
            });

        // Apply an overlay to get the card in the shape of the filled frame
        await sharp(filledBorderURL)
            .toBuffer({ resolveWithObject: true })
            .then(({ data, info }) => {
                sharp(resizedImg.data)
                    .composite([{
                        input: data,
                        blend: "dest-atop"
                    }])
                    .toFile(`${__dirname}/composite.png`, function(err) {
                        console.log("Error: ", err)
                    });
                console.log(info);
            })
            .catch(err => {
                console.log("Error: ", err);
            });

        // Apply an overlay to frame-shaped card to add the actual frame on top
        await sharp(`${__dirname}/composite.png`)
            .resize(512, 512)
            .composite([
                {
                    input: `${__dirname}/Golden_Luxurious_Card_Front.png`,
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

