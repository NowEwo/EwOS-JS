switch(BashCommand["SubCommands"][0]){
    case "shell":
            if(BashCommand["Arguments"].indexOf("s") > -1){
                var NewBootArguments = JSON.parse(localStorage["BootArguments"])
                NewBootArguments["Shell"] = BashCommand["SubCommands"][1]
                localStorage["BootArguments"] = JSON.stringify(NewBootArguments);
            }
            if(BashCommand["Arguments"].indexOf("r") > -1){
                Kernel.Reload();
            }
            Kernel.SetShell(BashCommand["SubCommands"][1])
            break;
    case "boot":
            try{
                var BootArgumentsVariable = JSON.parse(localStorage["BootArguments"]) ;
                if(BashCommand["Arguments"].indexOf("g") > -1){
                    Terminal.echo(BashCommand["SubCommands"][1]+" : "+BootArgumentsVariable[BashCommand["SubCommands"][1]]);
                }else{
                    BootArgumentsVariable[BashCommand["SubCommands"][1]] = BashCommand["SubCommands"][2] ;
                }
            }catch(Error){
                if(BashCommand["Arguments"].indexOf("d") > -1){
                    Terminal.error("Error while changing the value : "+Error+" !");
                }else{
                    Terminal.echo("Error while changing the value !");
                }
            }
}