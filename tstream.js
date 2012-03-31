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

    var url = require('url');
    var parsedUrl  = url.parse(redisUrl);
    var parsedAuth = (parsedUrl.auth || '').split(':');
    console.log('parsed url host: ' + parsedUrl.host);
    console.log('parsed url port: ' + parsedUrl.port);
    console.log('parsed url auth: ' + parsedAuth);

	//var redis = require('redis-url').createClient(redisUrl);
  
    var redis = require('redis').createClient(parsedUrl.port, parsedUrl.hostname); 
    var redisAuth = function() { 
        if (redisAuth) {
            redis.auth(parsedAuth); 
        }
    }

	//redis.addListener('connected', redisAuth);
	//redis.addListener('reconnected', redisAuth);
	//redisAuth();

	redis.on("message", function (channel, message) {
		process.send(message);
	});

	redis.subscribe("tweets");
}


