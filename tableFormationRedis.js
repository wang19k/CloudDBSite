    // TODO I'll uncomment this out when I fix this
    var projectID = "";
	var Redis = require("redis");
    //var redisClient = Redis.createClient({host : 'localhost', port : '8888'});
    var redisClient = Redis.createClient();
    redisClient.on('ready',function() {
    console.log("Redis is ready");
    });
    redisClient.on('connect', function() {
    console.log('connected');
    });

    redisClient.on('error', function(err){
    console.log('Something went wrong ', err)
    });

    redisClient.zadd("Natalie@"+ "High Score", new Date().getTime(), 10);
    redisClient.zadd("Natalie@"+ "High Score", new Date().getTime(), 12);
    redisClient.zadd("Katherine@" + "High Score", new Date().getTime(), 12);

	/*var fs = require("fs");
	var ping = function(e) {
	var result = client.ping()
    	.then(function(e) {
        	console.log(client);
        	console.log('Connected!');
    	})
    	.catch(function(e) {
        	console.log('Error:', e);
    	})
    	.finally(function() {
        	client.quit();
    	});
	};

	try {
		var client = new Redis({
    		host: 'localhost',
    		port: 8888,
    		tls: {
        		ca: fs.readFileSync('ca.crt') // fix this with ca certfile
    		}
		});

			ping();
	}
	catch (e) {
		console.log('Error: ', e);
	}*/
    var logFiles = [];
    redisClient.keys('*', function (err, keys) {
        if (err) return console.log(err);

        for(var i = 0, len = keys.length; i < len; i++) {
            redisClient.zrange(keys[i], 0, -1, "WITHSCORES", function(err, members) {
                if (err){
                    return console.log(err);
                }
                else{
                for (var i = 0 ; i < members.length ; i += 2) {
                    logFiles.push({"projectid": keys[i], "tag": "High Score", "value": members[i], "updates": members[i+1], "type": "Integer"});
                }
                return console.log(logFiles);

            }
        });
        }
    });
    