var InBIOS = false ;
if(localStorage["BootArguments"] == undefined){
    localStorage["BootArguments"] = JSON.stringify({
        "Shell": "MountainDesktop"
    })
}
var BootArguments = JSON.parse(localStorage["BootArguments"]);
var Video = document.getElementById("StartingAnimation");
Video.addEventListener("click", function(){
    Video.play();
})
Video.addEventListener("ended" , function(){
    if(!InBIOS){
        document.getElementById("DE").src = "System/Programs/"+BootArguments["Shell"]+"/Shell.html";
        document.getElementById('VideoContainer').style.display = 'none';
    }
})
Video.addEventListener("contextmenu" , (event) => {
    event.preventDefault()
    document.getElementById("DE").src = "System/BIOS.html";
    document.getElementById("VideoContainer").style.display = "none" ;
    InBIOS = true;
})
function SetShell(Path){
    document.getElementById("DE").src = "System/Programs/"+Path+"/Shell.html"
    console.warn("New shell : " + Path);
}
function CreateMainApp(ApplicationName){
    Iframe = document.createElement("iframe");
    Iframe.style.display = "none";
    Iframe.src = "System/Programs/"+ApplicationName;
}
function ReloadShell(){
    document.getElementById("DE").src = document.getElementById("DE").src;
}
function Reload(){
    document.location.href = "/" ;
}
var ShellElement = document.getElementById("DE");
var Shell = document.getElementById("DE").contentWindow;
var Kernel = this;