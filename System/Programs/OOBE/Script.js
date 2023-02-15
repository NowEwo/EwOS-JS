var TabContainer = document.getElementById("Container");
var TabNumber = 1;
var Username = "";
var Dock = "";
TabContainer.innerHTML = document.getElementById("Tab"+TabNumber).innerHTML;
Kernel.SetShell("OOBE");
var Kernel = parent
function Next(){
    TabNumber = TabNumber + 1;
    TabContainer.innerHTML = document.getElementById("Tab"+TabNumber).innerHTML;
    if(TabNumber == 4){
        setTimeout(() => {
            if(Dock){
                Kernel.Process("apt install DockTTB");
            }
            if(Username != ""){
                Kernel.Process("apt install usr");
                Kernel.Process("usr -s "+Username);
            }
            Kernel.Jsv["OOBE"] = true;
            Kernel.SyncJsv();
            Kernel.Reload();
        } , 1509);
    }
}