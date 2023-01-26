const { readdirSync } = require('node:fs');

// Process events
module.exports = (client) => {
	client.handleComponents = async () => {
		const componentPath = `${__dirname}/../../components`;
		const componentFolders = readdirSync(componentPath);
		for (const folder of componentFolders) {
			const componentFiles = readdirSync(`${componentPath}/${folder}`)
				.filter((file) => file.endsWith('.js'));

			const { buttons, selectMenus, modals } = client;
			switch (folder) {
			case 'buttons':
				for (const file of componentFiles) {
					const button = require(`${componentPath}/${folder}/${file}`);
					buttons.set(button.data.name, button);
				}
				break;
			case 'selectMenus':
				for (const file of componentFiles) {
					const menu = require(`${componentPath}/${folder}/${file}`);
					selectMenus.set(menu.data.name, menu);
				}
				break;
			case 'modals':
				for (const file of componentFiles) {
					const modal = require(`${componentPath}/${folder}/${file}`);
					modals.set(modal.data.name, modal);
				}
				break;
			default:
				break;
			}
		}
	};
};
