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
function CreateWindow(Data){
    WindowsUniqueId = GenerateUniqueId();
    Windows[WindowsUniqueId] = new WinBox({
        url: Data.URL,
        title: Data.Title,
        x: "center",
        y: "center",
        bottom: "63px",
        id: WindowsUniqueId
    });
}

CreateWindow({
    "Title": "Hey !!!",
    "URL": "../Index.html",
    "Icon": "Assets/Cursor.png"
});