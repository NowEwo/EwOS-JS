var FileSystem = new FFS("SelariaHD");

var Buttons = [];

function ViewFile(Path){
    document.getElementById("PathInput").value = FileSystem.CWD();
    document.getElementById("ManagerView").innerText = "" ;
    for(File in FileSystem.getDirContent(Path).result){
        Buttons[File] = document.createElement("button");
        Buttons[File].innerHTML = FileSystem.getDirContent(Path).result[File].name;
        Buttons[File].addEventListener("click" , (event) => {
            FileSystem.changeDir(event.target.innerHTML);
            Buttons = [];
            ViewFile(FileSystem.CWD());
        })
        Buttons[File].className = "ObjectButton";
        Buttons[File].addEventListener("click" , (event) => {
            if(FileSystem.isRegularFile(event.target.innerHTML)){
                parent.CreateWindow({
                    "Name" : "TextEditor" ,
                    "Title" : "Text Editor : "+FileSystem.CWD()+event.target.innerHTML ,
                    "Icon" : "" ,
                    "Arguments" : "FileURL="+FileSystem.CWD()+event.target.innerHTML,
                    "NoMenu" : ""
                });
            }
        })
        document.getElementById("ManagerView").appendChild(Buttons[File]);
    }
}

document.addEventListener("contextmenu" , (event) => {
    event.preventDefault();
    if(event.target.className == "ObjectButton"){
        var ContextMenu = document.getElementById("ContextMenuObject");
        document.getElementById("ContextMenuGlobal").style.display = "none";
    }else{
        var ContextMenu = document.getElementById("ContextMenuGlobal");
        document.getElementById("ContextMenuObject").style.display = "none"
    }
    ContextMenu.style.left = event.clientX+"px";
    ContextMenu.style.top = event.clientY+"px";
    ContextMenu.style.display = "block";
    document.getElementById("DeleteButton").addEventListener("click" , () => {
        FileSystem.delete(event.target.innerHTML);
        ViewFile(FileSystem.CWD());
    });
    document.getElementById("RenameButton").addEventListener("click" , () => {
        var NewName = prompt("New name ?");
        FileSystem.move(event.target.innerHTML , NewName);
        ViewFile(FileSystem.CWD());
    });
});

document.addEventListener("click" , function(){
    if(document.getElementById("ContextMenuObject").style.display == "block"){
        var ContextMenu = document.getElementById("ContextMenuObject");
        ContextMenu.style.display = "none";
    }
    if(document.getElementById("ContextMenuGlobal").style.display == "block"){
        var ContextMenu = document.getElementById("ContextMenuGlobal");
        ContextMenu.style.display = "none";
    }
});

ViewFile("/");