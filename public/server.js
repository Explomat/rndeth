'use strict';

const express = require('express');
var path = require('path');

const app = express();
const staticOptions = {
	dotfiles: 'ignore',
	etag: false,
	extensions: [ 'html' ],
	index: false,
	maxAge: '1d'
};

app.use(
	express.static(__dirname, Object.assign(staticOptions, {
	extensions: [ 'html', 'ico', 'json' ]
})));
app.use(
	express.static(
		path.join(__dirname, '/static'), Object.assign(staticOptions, {
		extensions: [ 'css', 'js', 'map', 'woff2', 'svg', 'ttf', 'eot', 'woff' ]
	}))
);

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