const fs = require('node:fs');

// Process events
module.exports = (client) => {
    client.handleEvents = async () => {
        const eventPath = `${__dirname}/../../events`
        const eventFolders = fs.readdirSync(eventPath)
        for (const folder of eventFolders) {
            const eventFiles = fs
                .readdirSync(`${eventPath}/${folder}`)
                .filter((file) => file.endsWith(".js"))

            switch (folder) {
                case "client":
                    for (const file of eventFiles) {
                        const event = require(`${eventPath}/${folder}/${file}`);
                        if (event.once) {
                            client.once(event.name, (...args) => event.execute(...args, client));
                        } else {
                            client.on(event.name, (...args) => event.execute(...args, client));
                        }
                    }
                    break;
                default:
                    break;
            }
        }
    }
}
