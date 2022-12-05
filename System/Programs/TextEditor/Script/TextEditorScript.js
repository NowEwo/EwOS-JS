var $_GET = [];
var parts = window.location.search.substr(1).split("&");
for (var i = 0; i < parts.length; i++){
    var temp = parts[i].split("=");
    $_GET[decodeURIComponent(temp[0])] = decodeURIComponent(temp[1]);
}

document.getElementById("EditorArea").addEventListener("contextmenu" , (event) => {
    event.preventDefault();
    var ContextMenu = document.getElementById("ContextMenu");
    ContextMenu.style.left = event.clientX+"px";
    ContextMenu.style.top = event.clientY+"px";
    ContextMenu.style.display = "block";
});

document.getElementById("EditorArea").addEventListener("click" , function(){
    if(document.getElementById("ContextMenu").style.display == "block"){
        ContextMenu.style.display = "none";
    }
});

if($_GET["FileURL"] != undefined){
    document.getElementById("EditorArea").value = Kernel.FileSystem.getFileContent(Args["FileURL"]);
}