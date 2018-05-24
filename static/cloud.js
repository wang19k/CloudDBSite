var project_ids = [];
// for more permanent do localStorage
if (sessionStorage.project_ids) {
    project_ids = JSON.parse(sessionStorage.getItem("project_ids"));
} else {
    sessionStorage.setItem("project_ids", JSON.stringify(project_ids));
}
var tags= {};
if (sessionStorage.tags){
    tags = JSON.parse(sessionStorage.getItem("tags"));
} else{
    sessionStorage.setItem("tags", JSON.stringify(tags));
}

function setCurrent(string){
    document.getElementById("debug").innerHTML = string;
}

function createCloudFromEventStream(e){
  var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric'};
  if (e.data != "1"){
    var dataList = JSON.parse(e.data);
    var date = new Date();
    var timeline = document.getElementById("timeline");
    var newDiv = document.createElement("div");
    document.getElementById('lastUpdated').innerHTML = 'Log was last updated ' + date.toLocaleString("en-US", options);
    tags[dataList.tag.toString()] = dataList.value.toString();
    sessionStorage.setItem("tags", JSON.stringify(tags));
    if (timeline.childElementCount > 0 && timeline.firstChild.className == 'container right'){
        newDiv.setAttribute('class', 'container left');
        var content = document.createElement("div");
        content.setAttribute('class', 'content');
        var p = document.createElement('p');
        var header = document.createElement("h5");
        //p.innerHTML = "Project ID: " + logFile.projectid.toString() + ", Tag: " + logFile.tag.toString() + ", Value: " + logFile.value.toString() + "\n" + ", Type: " + logFile.type.toString();
        date.setTime(dataList.updated);
        header.innerHTML = date.toLocaleString("en-US", options);
        p.innerHTML = "Tag (Description): " + "<strong> " + dataList.tag.toString() + "</strong>"+ ", Value (Data): [" + dataList.value.toString() + "], Type: " + dataList.type.toString();
        content.appendChild(header);
        content.appendChild(p);
        newDiv.appendChild(content);
    }
    else{
        newDiv.setAttribute('class', 'container right');
        var content = document.createElement("div");
        content.setAttribute('class', 'content');
        var p = document.createElement('p');
        var header = document.createElement("h5");
        p.innerHTML = "Tag (Description): " + "<strong> " + dataList.tag.toString() + "</strong>"+ ", Value (Data): [" + dataList.value.toString() + "], Type: " + dataList.type.toString();
        date.setTime(dataList.updated);
        header.innerHTML = date.toLocaleString("en-US", options);
        content.appendChild(header);
        content.appendChild(p);
        newDiv.appendChild(content);
    }
    timeline.insertBefore(newDiv, timeline.firstChild);
  }

}

function createCloudBlock(logFile, isLeft){

}

function viewCurrentTags(){
    // something about last updated?
    var tagString = "";
    var valueString = "";
    /*if(tags.length > 0){
        for (i = 0; i < tags.length; i++){
            tagString += "<p><strong>" + tags[i] + "</strong></p>";
            valueString += "<p>"+ values[i] + "</p>";
        }
    }*/
    for(var key in tags){
        var value = tags[key];
        tagString += "<p><strong>" + key.toString() + "</strong></p>";
        valueString += "<p>"+ value.toString() + "</p>";
    }
    document.getElementById("tags").innerHTML = tagString;
    document.getElementById("values").innerHTML = valueString;

}

function setupProjects(){
    var dropdown = document.getElementById("projectDropdown");
    for (i = 0; i < project_ids.length; i++){

      var inj= document.createElement('p');
      var id = "project" + i.toString();

      inj.id = id;
      inj.innerHTML = project_ids[i];
      inj.onclick = function (num) {
            return function () {
                /*if (num == "project1") {
                  window.location.href = "#";
                } else {
                  window.location.href = "#";
                }*/
                setProject(num);
            };
        }(id);
      dropdown.appendChild(inj);
      }
      var iadd= document.createElement('button');
      iadd.id = "iadd";
      iadd.innerHTML = "&#x2b;"
      iadd.onclick = function() {
        document.getElementById('projectModal').style.display = "block";
        document.getElementById("newProject").focus();
      }
      dropdown.appendChild(iadd);
      setProject("project0");
}

function setUpModal(){
  document.getElementById('newProject').value='';
  var modal = document.getElementById('projectModal');
  var span = document.getElementsByClassName("close")[0]; 
  document.getElementById("newProject").focus();
  var newProject=document.getElementById("newProject").value;
  //$("#submit-button").on("click", setProject(newProject));

  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
      modal.style.display = "none";
      document.getElementById('newProject').value='';
  }

  window.onclick = function(event) {
    if (event.target == modal) {
        // When the user clicks anywhere outside of the modal, close it
        modal.style.display = "none";
        document.getElementById('newProject').value='';
    }
    if (!event.target.matches('.dropbtn')) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
      document.getElementById('newProject').value='';
    }
  }
}


function selectProject() {
    document.getElementById("projectDropdown").classList.toggle("show");
}

function setProject(project){
    document.getElementById("dropbtn").innerHTML =  document.getElementById(project).innerHTML + '<i class="fa fa-sort-down" style="font-size:24px"></i>';
    //document.getElementById("projectDropdown").classList.toggle("show");
}

function addProject(){
    var newProject = document.getElementById("newProject").value;
    if(newProject != ""){
        var dropdown = document.getElementById("projectDropdown");
        var inj= document.createElement('p');
        var id = "project" + project_ids.length.toString();
        inj.id = id;
        inj.innerHTML = newProject;
        inj.onclick = function (num) {
            return function () {
                setProject(num);
            };
        }(id);
      dropdown.insertBefore(inj, dropdown.childNodes[project_ids.length]);
      project_ids.push(newProject);
      sessionStorage.setItem("project_ids", JSON.stringify(project_ids));
      setProject(id);
    }
    document.getElementById('projectModal').style.display = "none";
}


// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {

    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}