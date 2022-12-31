switch(BashCommand["SubCommands"][0]){
    case "shell":
        if(BashCommand["Arguments"].indexOf("g") == -1){
            if(BashCommand["Arguments"].indexOf("d") == -1){
                if(BashCommand["Arguments"].indexOf("s") > -1){
                    var NewBootArguments = JSON.parse(localStorage["BootArguments"]);
                    NewBootArguments["Shell"] = BashCommand["SubCommands"][1];
                    localStorage["BootArguments"] = JSON.stringify(NewBootArguments);
                }
                if(BashCommand["Arguments"].indexOf("r") > -1){
                    Kernel.Reload();
                }
                Kernel.SetShell(BashCommand["SubCommands"][1]);
            }else{
                var JsonBootArguments = JSON.parse(localStorage["BootArguments"]);
                Kernel.SetShell(JsonBootArguments["Shell"]);
            }
        }else{
            return "Current shell : "+Kernel.CurrentShellString;
        }
            break;
    case "boot":
            try{
                var BootArgumentsVariable = JSON.parse(localStorage["BootArguments"]) ;
                if(BashCommand["Arguments"].indexOf("g") > -1){
                    if(BashCommand["SubCommands"][1] != "*"){
                        return BashCommand["SubCommands"][1]+" : "+BootArgumentsVariable[BashCommand["SubCommands"][1]];
                    }else{
                        for(Value in BootArgumentsVariable){
                            return Value+" : "+BootArgumentsVariable[Value];
                        }
                    }
                }else{
                    BootArgumentsVariable[BashCommand["SubCommands"][1]] = BashCommand["SubCommands"][2] ;
                    localStorage["BootArguments"] = JSON.stringify(BootArgumentsVariable);
                }
            }catch(Error){
                if(BashCommand["Arguments"].indexOf("d") > -1){
                    Terminal.error("Error while changing the value : "+Error+" !");
                }else{
                    return "Error while changing the value !";
                }
            }
            break;
    case "bios":
        Kernel.LoadBIOS();
        break;
}