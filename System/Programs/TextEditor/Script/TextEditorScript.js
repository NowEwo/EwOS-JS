var $_GET = [];
var parts = window.location.search.substr(1).split("&");
for (var i = 0; i < parts.length; i++){
    var temp = parts[i].split("=");
    $_GET[decodeURIComponent(temp[0])] = decodeURIComponent(temp[1]);
}
if($_GET["FileURL"] != undefined){
    var FileURL = $_GET["FileURL"] ;
}else{
    var FileURL = "/" ;
}

function Save(){
    FileSystem.writeFile(FileURL , document.getElementById("EditorArea").value);
    Shell.ShowNotification({
        "Title" : "Text editor : Saved !" ,
        "Text" : "The document "+FileURL+" is saved !" ,
        "Event" : "..."
    });
}

function SaveAs(){
    var FileURL = prompt("Where to save ?");
    FileSystem.writeFile(FileURL , document.getElementById("EditorArea").value);
    Shell.ShowNotification({
        "Title" : "Text editor : Saved !" ,
        "Text" : "The document "+FileURL+" is saved !" ,
        "Event" : "..."
    });
}

if($_GET["FileURL"] != undefined){
    document.getElementById("EditorArea").value = FileSystem.getFileContent($_GET["FileURL"]).result;
}