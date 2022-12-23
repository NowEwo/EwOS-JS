var InBIOS = false;
if (localStorage["BootArguments"] == undefined) {
  localStorage["BootArguments"] = JSON.stringify({
    Shell: "MountainDesktop",
  });
}
var FSHandler = new FFS("SelariaHD");

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
function LoadBIOS() {
  document.getElementById("DE").src = "System/BIOS.html";
  document.getElementById("VideoContainer").style.display = "none";
  InBIOS = true;
}
function SetShell(Path) {
  document.getElementById("DE").src = "System/Programs/" + Path + "/Shell.html";
  console.warn("New shell : " + Path);
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
