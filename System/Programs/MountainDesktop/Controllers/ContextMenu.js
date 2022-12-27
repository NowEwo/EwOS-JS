Shell.SetContextMenuContent([
    {
        "Text" : "<strong>Shell utilities !</strong>",
        "Event" : ""
    },
    {
        "Text" : "Reload the configuration !",
        "Event" : "Shell.ReloadConfig();"
    },
    {
        "Text" : "Reload the Shell !",
        "Event" : "Shell.Reload();"
    },
    {
        "Text" : "<strong>Kernel utilities !</strong>",
        "Event" : ""
    },
    {
        "Text" : "Reload the Kernel !",
        "Event" : "Kernel.Reload();"
    },
    {
        "Text" : "<strong>Workspace utilities !</strong>",
        "Event" : ""
    },
    {
        "Text" : "Previous workspace !",
        "Event" : "Shell.ChangeWorkspace(Shell.Workspace - 1);"
    },
    {
        "Text" : "Next workspace !",
        "Event" : "Shell.ChangeWorkspace(Shell.Workspace + 1);"
    }
]);