var FileSystem = new FFS("SelariaHD");
var $_GET = [];
var parts = window.location.search.substr(1).split("&");
for (var i = 0; i < parts.length; i++){
    var temp = parts[i].split("=");
    $_GET[decodeURIComponent(temp[0])] = decodeURIComponent(temp[1]);
}

var FilePath = ""

function Save(){
    if(FilePath != ""){
        FileSystem.writeFile(FilePath, document.getElementById("EditorArea").value);
        Shell.ShowNotification({
            "Title" : "File saved !" ,
            "Text" : "Your file is saved at : "+FilePath+" !" ,
            "Event" : ""
        });
    }else{
        SaveAs();
    }
}

function SaveAs(){
    FilePath = prompt("Where to save file ?");
    FileSystem.writeFile(FilePath, document.getElementById("EditorArea").value);
    Shell.ShowNotification({
        "Title" : "File saved !" ,
        "Text" : "Your file is saved at : "+FilePath+" !" ,
        "Event" : ""
    });
}

function New(){
    document.getElementById('EditorArea').value = "";
}

function Open(){
    FilePath = prompt("Where is the file ?");
    document.getElementById('EditorArea').value = FileSystem.getFileContent(FilePath).result;
}

if($_GET["FileURL"] != undefined){
    document.getElementById("EditorArea").value = FileSystem.getFileContent($_GET["FileURL"]).result;
    var FilePath = $_GET["FileURL"];
}