var ContextMenu = document.getElementById("ContextMenu");
var Software = {};

function ToggleStartMenu(){
    var StartMenu = document.getElementById("StartMenu");
        if(StartMenu.style.visibility=="hidden")
            {
                StartMenu.style.visibility="visible";
            }
        else
            {
                StartMenu.style.visibility="hidden";
            }
        return true;
}

function GenerateUniqueId(){
    let ID = () => {
      return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
    }
    return ID;
}

function CreateWindow(Data){
    var UID = Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    if(Data.Name == undefined){
        var URL = Data.URL + "?ID=" + UID;
    }else{
        var URL = "/System/Programs/" + Data.Name + "/App.html?ID=" + UID;
    }
    var App = new WinBox({
        border: "0px",
        url: "/System/Programs/" + Data.Name + "/App.html?ID=" + UID + "&" + Data.Arguments,
        title: Data.Title,
        x: "center",
        y: "center",
        bottom: "63px",
        root: document.body,
        icon: Data.Icon,
        id: UID
    });
    Software[UID] = document.getElementById(UID).querySelectorAll("iframe")[0].contentWindow;
    ToggleStartMenu();
    console.warn("New window : " + Data.Name + " as " + Data.Title + " ... Attributed Uid : " + UID);
}

/*{
"Name/URL" : ... ,
"Title" : ... ,
"Icon" : ... ,
"Arguments" : ...
}*/

function SetContextMenuContent(Content){
    ContextMenu.innerHTML = "" ;
    for(ContextButton in Content){
        var Element = document.createElement("button");
        Element.className = "CtxMenuElement";
        Element.innerHTML = ContextButton.Text;
        Element.addEventListener("click" , eval(ContextButton.Event));
        ContextMenu.appendChild(Element);
    }
}

/*
[
    {
        "Text" : "Example element !",
        "Event" : "parent.SetShell('SelariaDesktop');"
    },
    {
        "Text" : "Other element !",
        "Event" : "parent.document.location.href='/';"
    }
]
*/

document.addEventListener("contextmenu" , (event) => {
    event.preventDefault();
    var ContextMenu = document.getElementById("ContextMenu");
    ContextMenu.style.left = event.clientX+"px";
    ContextMenu.style.top = event.clientY+"px";
    ContextMenu.style.display = "block";
});

document.addEventListener("click" , function(){
    if(document.getElementById("ContextMenu").style.display == "block"){
        ContextMenu.style.display = "none";
    }
});

//FIX ME !

localforage.setDriver(localforage.INDEXEDDB);

var Softwares = localforage.createInstance({
    name: "Softwares"
});

function InstallSoftware(Data){
    Softwares[Data.ID] = Data
}

for( Item in Softwares.keys()){
    document.getElementById("StartMenu").innerHTML = document.getElementById("StartMenu").innerHTML + `
    <div class="Tile" onclick="CreateWindow({'Title':${Item.Title},'URL':${Item.URL},'Icon':${Item.Icon}})">
        <p class="Title">${Item.Start.Title}</p>
        <p class="Subtitle">${Item.Start.Author}'s Software</p>
    </div>
    `
}

function ShowNotification(Data){
    notification_to_execute = Data.Event;
    document.getElementById("Notification").style.textAlign = "center";
    document.getElementById("NotificationTitle").style.fontWeight = "bold";
    document.getElementById("NotificationTitle").innerHTML = Data.Title;
    document.getElementById("Notification").style.visibility = "visible";
    document.getElementById("NotificationMessage").style.fontWeight = "normal";
    document.getElementById("NotificationMessage").innerHTML = Data.Text;
    setTimeout(function(){
        document.getElementById("Notification").style.visibility = "hidden";
        document.getElementById("Notification").style.textAlign = "left";
    }, 5000);
}

function DropEvent(Data){
    CreateWindow({
        "URL" : Data,
        "Title" : "",
        "Icon" : "",
    })
}

function Reload(){
    document.location.href = document.location.href ;
}

// Have to add a security when called !
var Kernel = parent;
var Shell = this;

/*{
    'ID' : Identifiant ,
    'Title' : Software title ,
    'URL' : Software URL ( path ) ,
    'Icon' : Software icon ,
    'Start' : {
        'Title' : Start menu entry title ,
        'Author' : Software author
    }
}*/