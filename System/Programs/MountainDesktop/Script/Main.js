var ContextMenu = document.getElementById("ContextMenu");
var FileSystem = new FFS("SelariaHD");
var Kernel = parent;
var Software = {};
var Shell = this;

function ToggleStartMenu() {
  var StartMenu = document.getElementById("StartMenu");
  if (StartMenu.style.visibility == "hidden") {
    StartMenu.style.visibility = "visible";
  } else {
    StartMenu.style.visibility = "hidden";
  }
  return true;
}

function GenerateUniqueId() {
  let ID = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  };
  return ID;
}

function CreateWindow(Data) {
  var UID = Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
  if (Data.Name == undefined) {
    var URL = Data.URL + "?" + Data.Arguments;
  } else {
    var URL = "/System/Programs/" + Data.Name + "/App.html?" + Data.Arguments;
  }
  Software[UID] = new WinBox({
    border: "0px",
    url: URL,
    title: Data.Title,
    x: "center",
    y: "center",
    bottom: "63px",
    root: document.body,
    icon: "/System/Assets/Softwares/"+Data.Name+"/Icon.svg",
    id: UID,
    onclose: function(){
      delete Software[UID];
      ReloadTaskbar();
    },
    onminimize: function(){
      this.restore();
      this.hide();
      ReloadTaskbar();
    },
    onfocus: function(){
      ReloadTaskbar();
    },
    onblur: function(){
      ReloadTaskbar();
    }
  });
  if(Data.Icon != undefined){
    Software[UID].setIcon(Data.Icon);
    Software[UID].Icon = Data.Icon;
  }else{
    Software[UID].Icon = "/System/Assets/Softwares/"+Data.Name+"/Icon.svg" ;
  }
  Software[UID].UID = UID;
  Software[UID].Controller = document
    .getElementById(UID)
    .querySelectorAll("iframe")[0].contentWindow;
  Software[UID].SetBlank = () => {
    Software[UID].Controller.document.location.href = "about:blank";
  };
  Software[UID].Controller.document.body.onload = function () {
    Software[UID].setTitle(Software[UID].Controller.document.title);
  };
  Software[UID].Controller.ContextWindow = Shell.Software[UID];
  Software[UID].Controller.Kernel = Kernel;
  Software[UID].Controller.Shell = Shell;
  Software[UID].SecondaryWindow = (WindowObject) => {
    WindowObject.addClass("no-close").addClass("no-min");
    Software[UID].onminimize = () => {
      WindowObject.minimize();
    };
    Software[UID].onrestore = () => {
      WindowObject.restore();
    };
  };
  if (Data.NoMenu == undefined) {
    ToggleStartMenu();
  }
  ReloadTaskbar();
  console.warn(
    "New window : " +
      Data.Name +
      " as " +
      Data.Title +
      " ... Attributed Uid : " +
      UID
  );
  return Software[UID];
}

/*{
  "Name/URL" : ... ,    
  "Title" : ... ,
  "Icon" : ... ,
  "Arguments" : ...
}*/

function ReloadTaskbar() {
  Button = {} ;
  document.getElementById("TaskbarSoftwares").innerHTML = "" ;
  for (Process in Shell.Software) {
    Button[Process] = document.createElement("button");
    Button[Process].Process = Process ;
    Button[Process].innerHTML = "<img src='"+Shell.Software[this.Process].Icon+"'>";
    Button[this.Process].setAttribute("Minimized" , new String(Shell.Software[this.Process].hidden));
    Button[this.Process].setAttribute("Focused" , new String(Shell.Software[this.Process].focused));
    Button[Process].addEventListener("click", function () {
      if(Shell.Software[this.Process].focused || Shell.Software[this.Process].hidden){
        Shell.Software[this.Process].show(Shell.Software[this.Process].hidden);
        Button[this.Process].setAttribute("Minimized" , new String(Shell.Software[this.Process].hidden));
      }
      Shell.Software[this.Process].focus();
      if(Shell.Software[this.Process].hidden){
        Shell.Software[this.Process].blur();
        Button[this.Process].setAttribute("Focused" , new String(Shell.Software[this.Process].focused));
      }
    });
    document.getElementById("TaskbarSoftwares").appendChild(Button[Process]);
  }
}

function SetContextMenuContent(Content) {
  ContextMenu.innerHTML = "";
  for (ContextButton in Content) {
    var Element = document.createElement("button");
    Element.className = "CtxMenuElement";
    Element.innerHTML = Content[ContextButton].Text;
    Element.addEventListener(
      "click",
      new Function(Content[ContextButton].Event)
    );
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

document.addEventListener("contextmenu", (event) => {
  event.preventDefault();
  if (event.target.id != "Grab") {
    var ContextMenu = document.getElementById("ContextMenu");
    ContextMenu.style.left = event.clientX + "px";
    ContextMenu.style.top = event.clientY + "px";
    ContextMenu.style.display = "block";
  }
});

document.addEventListener("click", function (Event) {
  if (document.getElementById("ContextMenu").style.display == "block") {
    ContextMenu.style.display = "none";
  }
});

/*
for( Item in Softwares.keys()){
    document.getElementById("StartMenu").innerHTML = document.getElementById("StartMenu").innerHTML + `
    <div class="Tile" onclick="CreateWindow({'Title':${Item.Title},'URL':${Item.URL},'Icon':${Item.Icon}})">
        <p class="Title">${Item.Start.Title}</p>
        <p class="Subtitle">${Item.Start.Author}'s Software</p>
    </div>    
    `
}    
*/

function ShowNotification(Data) {
  notification_to_execute = Data.Event;
  document.getElementById("Notification").style.textAlign = "center";
  document.getElementById("NotificationTitle").style.fontWeight = "bold";
  document.getElementById("NotificationTitle").innerHTML = Data.Title;
  document.getElementById("Notification").style.visibility = "visible";
  document.getElementById("NotificationMessage").style.fontWeight = "normal";
  document.getElementById("NotificationMessage").innerHTML = Data.Text;
  setTimeout(function () {
    document.getElementById("Notification").style.visibility = "hidden";
    document.getElementById("Notification").style.textAlign = "left";
  }, 5000);
}

function DropEvent(Data) {
  CreateWindow({
    URL: Data,
    Title: "",
    Icon: "",
  });
}

function Reload() {
  document.location.href = document.location.href;
}

document.getElementById("StartMenu").style.zIndex = "13";

var HideState = true;

document.getElementById("Grab").addEventListener("click", function () {
  for (ID in Software) {
    Software[ID].minimize(HideState);
  }
  HideState = !HideState;
});

document.getElementById("Grab").addEventListener("contextmenu", (Event) => {
  Event.preventDefault();
  for (ID in Software) {
    Software[ID].close();
  }
  ContextMenu.style.display = "none";
});

function BootScripts(){
  if (FileSystem.fileExists("/System/OnBoot.json")) {
    var OnBoot = JSON.parse(
      FileSystem.getFileContent("/System/OnBoot.json").result
    );
    for (Script in OnBoot.Scripts) {
      Kernel.eval(FileSystem.getFileContent(OnBoot.Scripts[Script]).result);
      console.warn(
        "The script on the path " + OnBoot.Scripts[Script] + " is executed !"
      );
    }
  }
}

function ReloadConfig(){
  if (FileSystem.fileExists("/System/Config.json")) {
    var Config = JSON.parse(
      FileSystem.getFileContent("/System/Config.json").result
    );
    for(Value in Config.Kernel){
      Kernel.eval(Value+" = `"+Config.Kernel[Value]+"` ;");
    };
    for(Value in Config.Shell){
      Shell.eval(Value+" = `"+Config.Shell[Value]+"` ;");
    };
  }
}

BootScripts();
ReloadConfig();

Shell.document.title = Shell.document.location.href;

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
