var fs = require('fs');
var settings = {};

process.on('message', function(m) {
    console.log("starting child process...");
    init(m['redisUrl']);
});

function init(redisUrl) {

    if (!redisUrl) {
        settings = JSON.parse(fs.readFileSync('development-settings.json', encoding='utf8'));
		redisUrl = settings.redis_url;
    } 

	console.log("attempting connetion to redis with " + redisUrl);

    var password, database, url = require('url');
    var parsedUrl  = url.parse(redisUrl);
    var parsedAuth = (parsedUrl.auth || '').split(':');
    var redis = require('redis').createClient(parsedUrl.port, parsedUrl.hostname);

    if (password = parsedAuth[1]) {
        redis.auth(password, function(err) {
            if (err) throw err;
        });
    }

	redis.subscribe("tweets");

	redis.on("message", function (channel, message) {
		process.send(message);
	});
}
