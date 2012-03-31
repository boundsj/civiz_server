var fs = require('fs');
var settings = {};

console.log("process.env.PATH is " + process.env.PATH);
console.log("process.env.REDISTOGO_URL is " + process.env.REDISTOGO_URL);

var redisUrl = process.env.REDISTOGO_URL;
if (!redisUrl) {
    settings = JSON.parse(fs.readFileSync('development-settings.json', encoding='utf8'));
    redisUrl = settings.redis_url;
} 

console.log("attempting connetion to redis with " + redisUrl);

var redis = require('redis-url').createClient(redisUrl);

redis.on("message", function (channel, message) {
    //process.send(message);
});

redis.subscribe("tweets");
