var fs = require('fs');
var settings = {};

var redisUrl = process.env.REDISTOGO_URL;
if (!redisUrl) {
    settings = JSON.parse(fs.readFileSync('development-settings.json', encoding='utf8'));
    redisUrl = settings.redis_url;
} 

var redis = require('redis-url').createClient(redisUrl);

redis.on("message", function (channel, message) {
    process.send(message);
});

redis.subscribe("tweets");

