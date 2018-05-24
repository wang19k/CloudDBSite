var token = "";
var project_ids = [];
// for more permanent do localStorage
/*if (sessionStorage.project_ids) {
    project_ids = JSON.parse(sessionStorage.getItem("project_ids"));
} else {
    sessionStorage.setItem("project_ids", JSON.stringify(project_ids));
}*/
if (sessionStorage.token){
	token = sessionStorage.getItem("token");
}
else{
	sessionStorage.setItem("token", token);
}
function submitProject(){
	if (document.getElementById('token').value != ""){
		token = document.getElementById('token').value;
	}
	else{
		document.getElementById("token").classList.add("invalid");
	}
	if (document.getElementById('projectid').value != ""){
		var newPID = document.getElementById('projectid').value;
		project_ids.push(newPID);
	}
	else{
		document.getElementById("projectid").classList.add("invalid");
	}
	sessionStorage.setItem("project_ids", JSON.stringify(project_ids));
}