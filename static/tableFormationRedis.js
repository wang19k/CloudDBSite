    //var projectID = "";
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

    redisClient.zadd("NatalieHighScore", new Date().getTime(), '10');
    redisClient.zadd("NatalieHighScore", new Date().getTime(), '12');
    redisClient.zadd("KatherineHighScore", new Date().getTime(), '12');

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
    calc = function() {
        var logFiles = [];
        var completed = 0;
        redisClient.keys('*', function (err, dataLog) {
            if (err) return (err);
            for (var i = 0; i < dataLog.length; i++){
                var projectid = dataLog[i];
                var value, updated;
        // NEW var multi = redisClient.multi();
        // NEW var keys = Object.keys(dataLog);
        // NEW var i = 0;
            redisClient.zrange(dataLog[i], 0, -1, "WITHSCORES", function(err, members) {
                completed++;
                if (err){
                    return console.log(err);
                }
                for (var j = 0 ; j < members.length ; j += 2) {
                    //console.log(i);
                    logFiles.push({"projectid": projectid, "tag": "High Score", "value": members[j], "updated": members[j+1], "type": "Integer"});
                }
                if (completed == dataLog.length){
                    console.log(logFiles);
                }
            });
        }
    });
    };

        /*keys.forEach(function (i) {
            console.log("weee" + dataLog[i])
            redisClient.zrange(dataLog[i], 0, -1, "WITHSCORES", function(e, members) {
                i++;
                console.log("Here");
                if (e) {console.log(e)} else {
                    for (var j = 0 ; j < members.length ; j += 2) {
                        logFiles.push({"projectid": dataLog[i], "tag": "High Score", "value": members[j], "updated": members[j+1], "type": "Integer"});
                    }
                }

                if (i == keys.length) {
                    //res.render('logger/list', {logs:logFiles});
                    return logFiles;
                }
            });
            console.log(i);

        }); //}
    });
    return logFiles;
};*/

//console.log(calc())

/*function rank(game, cb) {  
  redis.zrange(game, 0, -1, "WITHSCORES", function(err, ret) {
    if (err) {
      cb(err);
    }
    else {
      var rank = [];
      for (var i = 0 ; i < ret.length ; i += 2) {
        rank.push({player: ret[i], score: ret[i+1]});
      }
      cb(null, rank);
    }
  });
}*/


