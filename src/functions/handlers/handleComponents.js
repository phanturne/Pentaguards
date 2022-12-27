const { readdirSync } = require('node:fs');

// Process events
module.exports = (client) => {
    client.handleComponents = async () => {
        const componentPath = `${__dirname}/../../components`
        const componentFolders = readdirSync(componentPath)
        for (const folder of componentFolders) {
            const eventFiles = readdirSync(`${componentPath}/${folder}`)
                .filter((file) => file.endsWith(".js"))

            const { buttons } = client
            switch (folder) {
                case "buttons":
                    for (const file of eventFiles) {
                        const button = require(`${componentPath}/${folder}/${file}`);
                        buttons.set(button.data.name, button)
                    }
                    break;
                default:
                    break;
            }
        }
    }
}
