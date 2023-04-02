SetShell(BootArguments["Shell"]);

console.info("Loading the file system : SelariaHD ...");
var SystemPartition = new FFS("System");
var FSHandler = new FFS("SelariaHD");

console.info("Checking if the file system is functionnal ...");
if (FSHandler.fileExists("/bin/#.fs") == false) {
  console.info("Installing a file system !");
  FSHandler.delete("/");
  FSHandler.createDir("/", "bin");
  FSHandler.writeFile("/bin/#.fs", "");
  FSHandler.createDir("/bin", "MountainDesktop");
  FSHandler.createDir("/bin/MountainDesktop", "StartMenu");
  FSHandler.writeFile("/bin/MountainDesktop/Config.conf", JSON.stringify({"Style":{"Taskbar":{"TaskbarOnTop":false ,"CompactTaskbar":false}},"Shell":{}}));
  FSHandler.createDir("/", "boot");
  FSHandler.createDir("/", "etc");
  console.info("Writing '/etc/jsv.conf' ...");
  FSHandler.writeFile("/etc/jsv.conf", JSON.stringify({ 'Config': 'Loaded' , 'OOBE' : false}));
  FSHandler.writeFile("/etc/repositories.conf", "WolfyGreyWolf/SelariaMountainRange-Repository\n")
  FSHandler.createDir("/", "root");
  FSHandler.createDir("/", "home");
  FSHandler.createDir("/", "tmp");
  FSHandler.createDir("/", "usr");
}

console.info("Removing content of the 'tmp' folder ...");
FSHandler.delete("/tmp");
FSHandler.createDir("/", "tmp");

var BootArguments = JSON.parse(localStorage["BootArguments"]);
var Jsv = JSON.parse(FSHandler.getFileContent("/etc/jsv.conf").result);
var SyncJsv = () => {
  FileSystem.writeFile("/etc/jsv.conf", JSON.stringify(Jsv));
}

function SaveBootArguments() {
  localStorage["BootArguments"] = JSON.stringify(BootArguments)
}

function LoadBootArguments() {
  var BootArguments = JSON.parse(localStorage["BootArguments"]);
}

console.info("Loading the user name !")
var User = {
  Name: BootArguments["User"]
};

console.info("Checking if the '" + User["Name"] + "' home folder exist ...");
if (!FSHandler.fileExists("/home/" + User["Name"])) {
  console.info("Creating the '/home/" + User["Name"] + "' folder ...");
  FSHandler.createDir("/home", User["Name"]);
  FSHandler.createDir("/home/" + User["Name"], "documents");
  FSHandler.createDir("/home/" + User["Name"], "desktop");
  FSHandler.createDir("/home/" + User["Name"], "public");
}

function ReloadUser() {
  var BootArguments = JSON.parse(localStorage["BootArguments"]);
  console.info("Loading the user name !")
  User = {
    Name: BootArguments["User"]
  };
  console.info("Checking if the '" + User["Name"] + "' home folder exist ...");
  if (!FSHandler.fileExists("/home/" + User["Name"])) {
    console.info("Creating the '/home/" + User["Name"] + "' folder ...");
    FSHandler.createDir("/home", User["Name"]);
    FSHandler.createDir("/home/" + User["Name"], "documents");
    FSHandler.createDir("/home/" + User["Name"], "desktop");
    FSHandler.createDir("/home/" + User["Name"], "public");
  }
}

function Fetch(URL) {
  http = new XMLHttpRequest();
  http.open("GET", URL, false);
  http.send();
  return http.responseText;
}

var CurrentShellString = "";

function SetShell(Path) {
  document.getElementById("DE").src = "System/Programs/" + Path + "/Shell.html";
  console.info("New shell : " + Path);
  CurrentShellString = Path;
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

for (Script in BootArguments["KernelScripts"]) {
  var KernelScript = document.createElement("script");
  KernelScript.innerHTML = FSHandler.getFileContent(BootArguments["KernelScripts"][Script]).result;
  document.appendChild("KernelScripts");
}
var ShellElement = document.getElementById("DE");
var Shell = document.getElementById("DE").contentWindow;
var FileSystem = FSHandler;
var Kernel = this;