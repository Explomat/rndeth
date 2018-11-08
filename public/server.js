'use strict';

const express = require('express');
var path = require('path');

const app = express();

app.get('/', (req, res) => {
	const fileName = path.join(__dirname, '/index.html');
	res.status(200).sendFile(fileName);
});

if (module === require.main) {
	const server = app.listen(process.env.PORT || 8080, () => {
		const port = server.address().port;
		console.log(`App listening on port ${port}`);
	});
}

module.exports = app;