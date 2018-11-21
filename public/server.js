'use strict';

const express = require('express');
const path = require('path');

const app = express();

//const indexName = __filename.split('\\').pop().split('/').pop();
const indexName = __filename.split(path.sep).pop();
app.use(`/${indexName}`, (req, res) => {
	res.status(403).end('403 Forbidden');
});

app.use(express.static(__dirname));

app.get('*', (req, res) => {
	const fileName = path.join(__dirname, '/index.html');
	res.status(200).sendFile(fileName);
});


const server = app.listen(process.env.PORT || 3000, () => {
	const port = server.address().port;
	console.log(`App listening on port ${port}`);
});

module.exports = app;