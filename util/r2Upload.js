const http = require('http');

// Allow access to the environment variables of the running node process
require('dotenv').config({ path: `${__dirname}/../.env`});
const { R2WorkerSecret } = process.env;

module.exports = {
	async R2Upload(imageBuffer, cloudFilePath) {
		// Specify the options for the request to R2
		const options = {
			hostname: 'pentaguards.phanturne.workers.dev',
			path: cloudFilePath,
			method: 'PUT',
			headers: {
				'Content-Type': 'image/png',
				'Content-Length': imageBuffer.length,
				'X-Custom-Auth-Key': R2WorkerSecret,
			},
		};

		const req = http.request(options, (res) => {
			// Log the status code of the response
			// console.log(`Status Code: ${res.statusCode}`);

			res.on('data', (d) => {
				// process.stdout.write(d);
			});
		});

		req.on('error', (error) => {
			console.error(error);
		});

		// Write the image buffer to the request
		req.write(imageBuffer);
		req.end();
	},
};
