var FileSystem = new FFS("SelariaHD");

FileSystem.changeDir("/");

var CommandsDescriptions = {} ;

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
    Term.write("\r\n");
    switch (BashCommand["Base"]) {
      // Bash Commands !
      default:
        Term.write(BashCommand["Base"]+" : Commande introuvable");
        break;
      case "cd":
        if (BashCommand["SubCommands"] != []) {
          FileSystem.changeDir(BashCommand["SubCommands"][0]);
        } else {
          Term.write(FileSystem.CWD());
        }
        break;
      case "ls":
        if (BashCommand["SubCommands"] == []) {
          BashCommand["SubCommands"][0] = "./";
        }
        var Content = FileSystem.getDirContent(
          BashCommand["SubCommands"][0]
        ).result;
        for (FileSystemObject in Content) {
          Term.write(Content[FileSystemObject].name + "     ");
        }
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
        Term.write(FileSystem.getFileContent(BashCommand["SubCommands"][0]).result);
        break;
      case "rm":
      case "rmdir":
        FileSystem.delete(BashCommand["SubCommands"][0]);
        break;
      case "echo":
        Term.write(CommandString.replace("echo ", ""));
        break;
      case "clear":
        Term.clear();
        break;
      // Selaria commands !
      case "selaria":
        switch (BashCommand["SubCommands"][0]) {
          case "test":
            Term.write("Selaria MountainRange Test !");
            break;
          case "conf":
            switch(BashCommand["SubCommands"][1]){
              case "reload":
                Shell.ReloadConfig();
            }
            break;
          case "user":
            switch(BashCommand["SubCommands"][1]){
              case "connect":
                Kernel.ConnectUser(BashCommand["SubCommands"][2] , BashCommand["SubCommands"][3])
                break;
            }
        }
        break;
    }
  }
}