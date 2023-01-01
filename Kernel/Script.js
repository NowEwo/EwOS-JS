var InBIOS = false;

console.info("Check if Boot arguments exists ...");
if (localStorage["BootArguments"] == undefined) {
  console.info("Not founded , creating Boot arguments !");
  localStorage["BootArguments"] = JSON.stringify({
    Shell: "MountainDesktop",
    User : "Selaria" ,
  });
}

console.info("Loading the file system : SelariaHD ...");
var FSHandler = new FFS("SelariaHD");

console.info("Checking if the file system is functionnal ...");
if (FSHandler.fileExists("/bin/#.fs") == false) {
  console.info("Installing a file system !");
  FSHandler.delete("/");
  FSHandler.createDir("/", "bin");
  FSHandler.writeFile("/bin/#.fs", "");
  FSHandler.createDir("/", "boot");
  FSHandler.createDir("/", "etc");
  console.info("Writing '/etc/jsv.conf' ...");
  FSHandler.writeFile("/etc/jsv.conf", JSON.stringify({'Config' : 'Loaded'}));
  FSHandler.writeFile("/etc/repositories.conf" , "WolfyGreyWolf/SelariaMountainRange-Repository\n")
  FSHandler.createDir("/", "home");
  FSHandler.createDir("/", "root");
  FSHandler.createDir("/", "tmp");
  FSHandler.createDir("/", "usr");
}

console.info("Removing content of the 'tmp' folder ...");
FSHandler.delete("/tmp");
FSHandler.createDir("/" , "tmp");

var BootArguments = JSON.parse(localStorage["BootArguments"]);

console.info("Loading the user name !")
var User = {
  Name : BootArguments["User"]
};

function ReloadUser(){
  BootArguments = JSON.parse(localStorage["BootArguments"]);
  User["Name"] = BootArguments["User"];
}

console.info("Checking if the '"+User["Name"]+"' home folder exist ...");
if(!FSHandler.fileExists("/home/"+User["Name"])){
  console.info("Creating the '/home/"+User["Name"]+"' folder ...");
  FSHandler.createDir("/home" , User["Name"]);
  FSHandler.createDir("/home/"+User["Name"] , "documents");
  FSHandler.createDir("/home/"+User["Name"] , "desktop");
  FSHandler.createDir("/home/"+User["Name"] , "public");
}

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
  };
}
function LoadBIOS() {
  console.info("Loading the BIOS ...");
  document.getElementById("DE").src = "System/BIOS.html";
  document.getElementById("VideoContainer").style.display = "none";
  InBIOS = true;
}

var CurrentShellString = "" ;

function SetShell(Path) {
  document.getElementById("DE").src = "System/Programs/" + Path + "/Shell.html";
  console.info("New shell : " + Path);
  CurrentShellString = Path ;
}
function CreateMainApp(ApplicationName) {
  IFrame = document.createElement("iframe");
  IFrame.style.display = "none";
  IFrame.src = "System/Programs/" + ApplicationName;
  document.appendChild(IFrame);
}
document.addEventListener("dragover", (event) => {
  event.preventDefault();
});
document.addEventListener("drop", (Event) => {
  Event.preventDefault();
  Shell.DropEvent(Event.dataTransfer.getData("text/plain"));
});
function ReloadShell() {
  console.info("Reloading the shell ...");
  document.getElementById("DE").src = document.getElementById("DE").src;
}
function Reload() {
  console.info("Raloading the kernel ...");
  document.location.href = "/";
}

var ShellElement = document.getElementById("DE");
var Shell = document.getElementById("DE").contentWindow;
var FileSystem = FSHandler;
var Kernel = this;
