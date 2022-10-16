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

function CreateWindow(Data){
    var App = new WinBox({
        border: "0px",
        url: Data.URL,
        title: Data.Title,
        background: "#212125",
        x: "center",
        y: "center",
        bottom: "63px",
        root: document.body,
        icon: Data.Icon
    });
}

localforage.setDriver(localforage.INDEXEDDB);

var Softwares = localforage.createInstance({
    name: "Softwares"
});

function InstallSoftware(Data){
    Softwares[Data.ID] = Data
}

for( Item in Softwares.keys()){
    document.getElementById("StartMenu").innerHTML = document.getElementById("StartMenu").innerHTML + `
    <div class="Tile" onclick="CreateWindow({'Title':${Item.Title},'URL':${Item.URL},'Icon':${Item.Icon}})">
        <p class="Title">${Item.Start.Title}</p>
        <p class="Subtitle">${Item.Start.Author}'s Software</p>
    </div>
    `
}

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