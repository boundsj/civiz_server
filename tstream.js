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

	var redis = require('redis-url').createClient(redisUrl);

	redis.on("message", function (channel, message) {
		process.send(message);
	});

	redis.subscribe("tweets");
}


