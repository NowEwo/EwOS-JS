var InBIOS = false;
if (localStorage["BootArguments"] == undefined) {
  localStorage["BootArguments"] = JSON.stringify({
    Shell: "MountainDesktop",
  });
}
var FSHandler = new FFS("SelariaHD");

function CreateUser(Name , Password , Config){
  FSHandler.createDir("/etc/user" , Name);
  FSHandler.writeFile("/etc/user"+Name+"/private/passwd" , Password);
  FSHandler.writeFile("/etc/user"+Name+"/sul.conf" , JSON.stringify(Config));
}

function ConnectUser(Name , Password){
  if(Password == FSHandler.getFileContent("/etc/user"+Name+"/private/passwd").result){
    var User = {
      "Name" : Name ,
      "Config" : JSON.parse(FSHandler.getFileContent("/etc/user"+Name+"/sul.conf").result)
    }
  }
}

if(FSHandler.fileExists("/bin/#.fs") == false){
  FSHandler.delete("/");
  FSHandler.createDir("/" , "bin");
  FSHandler.writeFile("/bin/#.fs" , "");
  FSHandler.createDir("/" , "boot");
  FSHandler.createDir("/" , "etc");
  FSHandler.createDir("/etc" , "user")
  FSHandler.writeFile("/etc/jsv.conf" , "Kernel.JsConfLoaded = true");
  FSHandler.createDir("/" , "tmp");
  FSHandler.createDir("/" , "usr");
  CreateUser("Selaria" , "Selaria" , {"Admin" : true});
  ConnectUser("Selaria" , "Selaria");
}

var BootArguments = JSON.parse(localStorage["BootArguments"]);
var Video = document.getElementById("StartingAnimation");
Video.addEventListener("click", function () {
  Video.play();
});
Video.addEventListener("ended", function () {
  if (!InBIOS) {
    document.getElementById("VideoContainer").style.display = "none";
    SetShell(BootArguments["Shell"]);
  }
});
Video.addEventListener("contextmenu", (event) => {
  event.preventDefault();
  document.getElementById("DE").src = "System/BIOS.html";
  document.getElementById("VideoContainer").style.display = "none";
  InBIOS = true;
});
function KernelFetch(URL) {
  var IFrame = document.createElement("iframe");
  IFrame.src = URL;
  // IFrame.style.display = "none";
  document.body.appendChild(IFrame);
  IFrame.onload = () => {
    Content = IFrame.contentWindow;
    document.body.removeChild(IFrame);
    delete IFrame;
    return Content;
  }
}
function LoadBIOS() {
  document.getElementById("DE").src = "System/BIOS.html";
  document.getElementById("VideoContainer").style.display = "none";
  InBIOS = true;
}
function SetShell(Path) {
  document.getElementById("DE").src = "System/Programs/" + Path + "/Shell.html";
  console.info("New shell : " + Path);
}
function CreateMainApp(ApplicationName) {
  Iframe = document.createElement("iframe");
  Iframe.style.display = "none";
  Iframe.src = "System/Programs/" + ApplicationName;
}
function ExecuteFile(Path) {
  eval(FileSystem.getFileContent(Path).result);
}
document.addEventListener("dragover", (event) => {
  event.preventDefault();
});
document.addEventListener("drop", (Event) => {
  Event.preventDefault();
  Shell.DropEvent(Event.dataTransfer.getData("text/plain"));
});
function ReloadShell() {
  document.getElementById("DE").src = document.getElementById("DE").src;
}
function Reload() {
  document.location.href = "/";
}
var ShellElement = document.getElementById("DE");
var Shell = document.getElementById("DE").contentWindow;
var FileSystem = FSHandler;
var Kernel = this;