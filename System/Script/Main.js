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

var Windows = {}
function open_app(path){
    var app = new WinBox({
        class: ["win"],
        border: "0.15em",
        url: path,
        title: path,
        background: "#212125",
        x: "center",
        y: "center",
        bottom: "63px",
        root: document.body
    });
}

open_app("../Index.html");