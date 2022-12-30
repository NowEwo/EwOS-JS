function LinkCheck(url) {
  try{
    http = new XMLHttpRequest();
    http.open("GET", url, false);
    http.send();
    return http.status != 404;
  }catch(Errors){
    console.info("File "+url+" don't exist !");
  }
}

var CommandsDescriptions = {};

function Process(CommandStringBase) {
  for (Item in CommandStringBase.split(" && ")) {
    var CommandString = CommandStringBase.split(" && ")[Item];
    // Get the base command and the arguments !
    delete BashCommand;
    var BashCommand = {
      Base: CommandString.split(" ")[0],
      Arguments: [],
      SubCommands: [],
    };
    for (Item in CommandString.split(" ")) {
      if (Item != 0) {
        if (CommandString.split(" ")[Item].slice(0, 1) == "-") {
          BashCommand.Arguments.push(
            CommandString.split(" ")[Item].replace("-", "")
          );
        } else {
          BashCommand.SubCommands.push(CommandString.split(" ")[Item]);
        }
      }
    }
    // Process the command !
    switch (BashCommand["Base"]) {
      // Bash Commands !
      default:
        if (FileSystem.fileExists("/bin/" + BashCommand["Base"])) {
          eval(FileSystem.getFileContent("/bin/" + BashCommand["Base"]).result);
        } else {
          if (LinkCheck("SBash/Commands/" + BashCommand["Base"] + ".js")) {
            http = new XMLHttpRequest();
            http.open("GET", "SBash/Commands/" + BashCommand["Base"] + ".js", false);
            http.send();
            var RequestResponse = new Function("var BashCommand = "+JSON.stringify(BashCommand)+" ; "+http.responseText);
            RequestResponse();
          } else {
            Terminal.echo(BashCommand["Base"] + " : Commande introuvable");
          }
        }
        break;
      case "help":
        Terminal.echo(`
List of integrated commands !

help , cd , ls , nano , cat , touch , mkdir , rm , rmdir , echo , clear , selaria , ssc

(
  ssc :
   ssc shell
   ssc boot
)

(
  selaria :
   selaria test
   selaria confs
)

        `)
        break;
      case "cd":
        if (BashCommand["SubCommands"] != []) {
          FileSystem.changeDir(BashCommand["SubCommands"][0]);
        } else {
          Terminal.echo(FileSystem.CWD());
        }
        break;
      case "ls":
        if (CommandString == "ls") {
          BashCommand["SubCommands"][0] = "./";
        }
        var Content = FileSystem.getDirContent(
          BashCommand["SubCommands"][0]
        ).result;
        ContentOfFolder = []
        for (FileSystemObject in Content) {
          ContentOfFolder.push(Content[FileSystemObject].name)
        }
        Terminal.echo(ContentOfFolder.join("     "));
        break;
      case "nano":
        var TextEditor = parent.CreateWindow({
          Name: "TextEditor",
          Title:
            "Text Editor : " +
            FileSystem.CWD() +
            "/" +
            BashCommand["SubCommands"][0],
          Icon: "/System/Assets/Softwares/TextEditor/Icon.svg",
          Arguments:
            "FileURL=" + FileSystem.CWD() + "/" + BashCommand["SubCommands"][0],
          NoMenu: "",
        });
        TextEditor.Controller.FileSystem = new FFS(FileSystem.Partition);
        break;
      case "mkdir":
        FileSystem.createDir(FileSystem.CWD(), BashCommand["SubCommands"][0]);
        break;
      case "touch":
        FileSystem.createFile(
          FileSystem.CWD(),
          BashCommand["SubCommands"][0],
          ""
        );
        break;
      case "cat":
        Terminal.echo(
          FileSystem.getFileContent(BashCommand["SubCommands"][0]).result
        );
        break;
      case "rm":
        FileSystem.delete(BashCommand["SubCommands"][0]);
        break;
      case "rmdir":
        FileSystem.delete(BashCommand["SubCommands"][0]);
        break;
      case "echo":
        Terminal.echo(CommandString.replace("echo ", ""));
        break;
      case "clear":
        Terminal.clear();
        break;
      // Selaria commands !
      case "selaria":
        switch (BashCommand["SubCommands"][0]) {
          case "test":
            Terminal.echo("Selaria MountainRange Test !");
            break;
          case "conf":
            switch (BashCommand["SubCommands"][1]) {
              case "reload":
                Shell.ReloadConfig();
            }
            break;
        }
        break;
    }
  }
}
