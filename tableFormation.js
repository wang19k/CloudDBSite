
	// TODO Code cleanup
    // TODO I'll uncomment this out when I fix this
	/*var Redis = require("ioredis");
	var fs = require("fs");
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
    		host: 'jis.csail.mit.edu',
    		port: 9001,
    		tls: {
        		ca: fs.readFileSync('path_to_ca_certfile') // fix this with ca certfile
    		}
		});

			ping();
	}
	catch (e) {
		console.log('Error: ', e);
	}
    client.keys('*', function (err, keys) {
        if (err) return console.log(err);

        for(var i = 0, len = keys.length; i < len; i++) {
            //console.log(keys[i]);
            var currentid = keys[i];
            if (!seen.has(currentid)){
            var button = document.createElement('button');
            button.setAttribute('class', 'tablinks');
            button.setAttribute('onclick', "openIDTable(event, \'"+currentid+"\')");
            button.innerHTML = currentid;
            tabs.appendChild(button);

            var newDiv = document.createElement("div");
            newDiv.id = currentid;
            newDiv.setAttribute('class', 'tabcontent');
            // This is so it doesn't show the table data by default
            newDiv.setAttribute('style', "display: none;")
            newDiv.innerHTML = "<h1 id=\"logHeader\" style=\"font-size:160%;\"><b>Log Table for ID: "+ currentid +"</b></h1>";

            var table = document.createElement("table");
            table.id = "logTable" + currentid;
            var row = table.insertRow(0);
                row.insertCell(0).outerHTML = "<th>Tag</th>";
                row.insertCell(1).outerHTML = "<th>Value</th>";
                row.insertCell(2).outerHTML = "<th>Type</th>";
                row.insertCell(3).outerHTML = "<th>Last Accessed</th>";
                row.insertCell(4).outerHTML = "<th>Random</th>"
            newDiv.appendChild(table);
            document.getElementById("container").appendChild(newDiv);
            }
        }
    });*/  
    var logFiles = [{"projectid":"Natalie@","tag":"High Score","value":12,"type":"Integer","updated":1489149847877}, 
    {"projectid":"Natalie@","tag":"High Score","value":10,"type":"Integer","updated":1489143847222}, {"projectid":"Katherine@","tag":"Money Spent","value":179,"type":"Integer","updated":1489153847222}, {"projectid":"Jeff@","tag":"Money Spent","value":179,"type":"Integer","updated":1489153847222},];
    var tabs = document.getElementById("dynamic");
    var seen = new Set();
    // run through to set up and create all the tabs and tables
    for (var i = 0; i < logFiles.length; i++) {
        var logFile = logFiles[i];
        var currentid = logFile.projectid;
        if (!seen.has(currentid)){
        var button = document.createElement('button');
        button.setAttribute('class', 'tablinks');
        button.setAttribute('onclick', "openIDTable(event, \'"+currentid+"\')");
        button.innerHTML = currentid;
        tabs.appendChild(button);

        var newDiv = document.createElement("div");
        newDiv.id = currentid;
        newDiv.setAttribute('class', 'tabcontent');
        // This is so it doesn't show the table data by default
        newDiv.setAttribute('style', "display: none;")
        newDiv.innerHTML = "<h1 id=\"logHeader\" style=\"font-size:160%;\"><b>Log Table for ID: "+ currentid +"</b></h1>";

        var table = document.createElement("table");
        table.id = "logTable" + currentid;
        var row = table.insertRow(0);
            row.insertCell(0).outerHTML = "<th>Tag</th>";
            row.insertCell(1).outerHTML = "<th>Value</th>";
            row.insertCell(2).outerHTML = "<th>Type</th>";
            row.insertCell(3).outerHTML = "<th>Last Accessed</th>";
            row.insertCell(4).outerHTML = "<th>Random</th>"
        newDiv.appendChild(table);
        document.getElementById("container").appendChild(newDiv);
        seen.add(currentid);}
    }
    // TODO make this dynamic
    var lastUpdated = 1508702040068; //##LASTUPDATED##;
    var date = new Date();
    date.setTime(lastUpdated);
    document.getElementById('lastUpdated').innerHTML = 'Log was last updated ' + date;
    // Most recent to least recent
    logFiles.sort(function (a, b) {
        return b.updated - a.updated;
    });
    //document.getElementById("logHeader").innerHTML = 'Log Table for ' + logFiles[0].projectid;
    // Sets the tables within each of the tabs
    for (var i = 0; i < logFiles.length; i++) {
        var logFile = logFiles[i];
        var dataLogTable = document.getElementById("logTable" + logFile.projectid);
        date.setTime(logFile.updated);
        var row = dataLogTable.insertRow(-1);
        var tagColumn = row.insertCell(0);
        tagColumn.innerHTML = logFile.tag;
        var valueColumn = row.insertCell(1);
        valueColumn.innerHTML = logFile.value.toString();
        var typeColumn = row.insertCell(2);
        typeColumn.innerHTML = logFile.type;
        typeColumn.setAttribute('class', logFile.type);
        var dateColumn = row.insertCell(3);
        dateColumn.innerHTML = date.toString();
        var randomCell = row.insertCell(4);
        randomCell.innerHTML = "Random";
    };