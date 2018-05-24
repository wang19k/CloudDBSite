var seen = new Set();
function sse() {
    var source = new EventSource('/stream');
    source.onmessage = function(evt) {
        e = JSON.parse(evt.data);
        //window.location.reload(true);
        if (seen.has(e.projectid)){
            var dataLogTable = document.getElementById("logTable" + e.projectid);
            date.setTime(e.updated);
            var row = dataLogTable.insertRow(-1);
            var tagColumn = row.insertCell(0);
            tagColumn.innerHTML = e.tag;
            var valueColumn = row.insertCell(1);
            valueColumn.innerHTML = e.value.toString();
            var typeColumn = row.insertCell(2);
            typeColumn.innerHTML = e.type;
            var dateColumn = row.insertCell(3);
            dateColumn.innerHTML = date.toLocaleString("en-US", options);
        }
        else{
            window.location.reload(true);
            createTable(e);
        }
    };
}
function openIDTable(evt, projectIDName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(projectIDName).style.display = "block";
    evt.currentTarget.className += " active";
}

// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click();
function refresh(){
	window.location.reload(true);
}

function createTable(e){
    var tabs = document.getElementById("dynamic");
    // run through to set up and create all the tabs and tables
    var currentid = e.projectid;
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
        newDiv.appendChild(table);
        document.getElementById("container").appendChild(newDiv);
        seen.add(currentid);
    }
    var date = new Date();
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric'};
    //document.getElementById('lastUpdated').innerHTML = 'Log was last updated ' + date.toLocaleString("en-US", options);
    //document.getElementById("logHeader").innerHTML = 'Log Table for ' + logFiles[0].projectid;
    // Sets the tables within each of the tabs
        var dataLogTable = document.getElementById("logTable" + e.projectid);
        date.setTime(e.updated);
        var row = dataLogTable.insertRow(-1);
        var tagColumn = row.insertCell(0);
        tagColumn.innerHTML = e.tag;
        var valueColumn = row.insertCell(1);
        valueColumn.innerHTML = e.value.toString();
        var typeColumn = row.insertCell(2);
        typeColumn.innerHTML = e.type;
        var dateColumn = row.insertCell(3);
        dateColumn.innerHTML = date.toLocaleString("en-US", options);
}

//var logFiles = {{ project_data | tojson }};
function createTableAllKeys(logFiles){
    var tabs = document.getElementById("dynamic");
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
            newDiv.appendChild(table);
            document.getElementById("container").appendChild(newDiv);
            seen.add(currentid);}
    }
    var date = new Date();
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric'};
    //document.getElementById('lastUpdated').innerHTML = 'Log was last updated ' + date.toLocaleString("en-US", options);
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
        var dateColumn = row.insertCell(3);
        dateColumn.innerHTML = date.toLocaleString("en-US", options);
    }
}