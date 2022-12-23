var FileSystem = new FFS("SelariaHD");

var Buttons = [];

function ViewFile(Path){
    document.getElementById("PathInput").value = FileSystem.CWD();
    document.getElementById("ManagerView").innerText = "" ;
    for(File in FileSystem.getDirContent(Path).result){
        if(FileSystem.isRegularFile(FileSystem.getDirContent(Path).result[File].name)){
            var Type = "File" ;
        }else{
            var Type = "Folder" ;
        }
        var Color = "white" ;
        Buttons[File] = document.createElement("button");
        if(FileSystem.getDirContent(Path).result[File].name.slice(0 , 1) == "#"){
            Buttons[File].style.display = "none" ;
            var Color = "grey" ;
        }
        Buttons[File].innerHTML = `
<p style="color:${Color}">${FileSystem.getDirContent(Path).result[File].name}</p>
<p style="color:grey">${Type}</p>
        ` ;
        Buttons[File].addEventListener("click" , (event) => {
            FileSystem.changeDir(event.target.innerHTML);
            Buttons = [];
            ViewFile(FileSystem.CWD());
        });
        Buttons[File].FileName = FileSystem.getDirContent(Path).result[File].name ;
        Buttons[File].className = "ObjectButton";
        Buttons[File].addEventListener("click" , (event) => {
            if(FileSystem.isRegularFile(event.target.innerHTML)){
                parent.CreateWindow({
                    "Name" : "TextEditor" ,
                    "Title" : "Text Editor : "+FileSystem.CWD()+"/"+event.target.innerHTML ,
                    "Icon" : "/System/Assets/Softwares/TextEditor/Icon.svg" ,
                    "Arguments" : "FileURL="+FileSystem.CWD()+"/"+event.target.innerHTML ,
                    "NoMenu" : ""
                });
            }
        })
        document.getElementById("ManagerView").appendChild(Buttons[File]);
    }
}

function ShowHiddenFiles(){
    for(Element in Buttons){
        if(Buttons[Element].style.display = "none"){
            Buttons[Element].style.display = "inline" ;
        }
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
        try{
            var FileName = event.target.FileName ;
            FileSystem.delete(FileName);
            ViewFile(FileSystem.CWD());
        }catch(Errors){
            
        }
    });
    document.getElementById("RenameButton").addEventListener("click" , () => {
        try{
            var FileName = event.target.FileName ;
            var NewName = prompt("New name ?");
            FileSystem.move(FileName , NewName);
            ViewFile(FileSystem.CWD());
        }catch(Errors){

        }
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