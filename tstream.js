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
    var parsed_url  = url.parse(redisUrl || process.env.REDIS_URL || 'redis://localhost:6379');
    var parsed_auth = (parsed_url.auth || '').split(':');
    var redis = require('redis').createClient(parsed_url.port, parsed_url.hostname);

    if (password = parsed_auth[1]) {
        redis.auth(password, function(err) {
            if (err) throw err;
        });
    }

    /*
    if (database = parsed_auth[0]) {
      redis.select(database);
      redis.on('connect', function() {
        redis.send_anyways = true
        redis.select(database);
        redis.send_anyways = false;
      });
    }
    */

	redis.subscribe("tweets");

	redis.on("message", function (channel, message) {
		process.send(message);
	});
}
