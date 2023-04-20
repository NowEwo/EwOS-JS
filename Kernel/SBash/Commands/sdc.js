if(BashCommand["SubCommands"][0] == "create-base-package"){
    FileSystem.createDir("/bin/" , BashCommand["SubCommands"][2]);
    if(BashCommand["Arguments"].indexOf("-Shell") > -1){
        FileSystem.writeFile("/bin/"+BashCommand["SubCommands"][2]+"/Shell.html" , "");
    }
    if(BashCommand["Arguments"].indexOf("-NoSoftware") == -1){
        FileSystem.writeFile("/bin/"+BashCommand["SubCommands"][2]+"/App.html" , "");
    }
}
if(BashCommand["SubCommands"][0] == "create-bin-package"){
    FileSystem.createDir("/bin/" , BashCommand["SubCommands"][2]);
    FileSystem.writeFile("/bin/"+BashCommand["SubCommands"][2]+"/"+BashCommand["SubCommands"][2] , "");
}