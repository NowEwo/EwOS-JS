ContextWindow.fullscreen();
var TabContainer = document.getElementById("Container");
var TabNumber = 1;
var Username = "";
var Dock = "";
TabContainer.innerHTML = document.getElementById("Tab"+TabNumber).innerHTML;
function Next(){
    TabNumber = TabNumber + 1;
    TabContainer.innerHTML = document.getElementById("Tab"+TabNumber).innerHTML;
    if(TabNumber == 4){
        setTimeout(() => {
            var Terminal = Shell.CreateWindow({"Name" : "Terminal" , "NoMenu" : ""});
            if(Dock){
                Terminal.Controller.eval('Kernel.Process("apt install DockTTB");');
                Terminal.Controller.eval('Kernel.Process("Dock");');
            }
            if(Username != ""){
                Terminal.Controller.eval('Kernel.Process("apt install usr");');
                Terminal.Controller.eval('Kernel.Process("usr -s "+Username);');
            }
            ContextWindow.close();
        } , 1509);
    }
}