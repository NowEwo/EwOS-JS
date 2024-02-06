Terminal.echo("Opening Window ...")
var SoftwarePath = BashCommand["SubCommands"][0];
var ContextUID = Math.floor((1 + Math.random()) * 0x10000)
var ReloadTaskbar = () => Shell.ReloadTaskbar();
var ReloadWindows = () => Shell.ReloadWindows();
var ToggleStartMenu = () => Shell.ToggleStartMenu();
var UID = ContextUID;
Shell.Shell.Software[ContextUID] = new Shell.WinBox({
    border: "0px",
    body: "",
    title: "JDW - " + Shell.SoftwarePath,
    x: "center",
    y: "center",
    bottom: "63px",
    root: Shell.WindowsManager,
    icon: "/System/Assets/Softwares/Undefined/Icon.svg",
    id: ContextUID,
    onclose: function () {
      delete Shell.Shell.Software[ContextUID];
      Shell.ReloadTaskbar();
    },
    onminimize: function () {
      this.restore();
      this.hide();
      Shell.ReloadTaskbar();
    },
    onfocus: function () {
      Shell.ReloadTaskbar();
    },
    onblur: function () {
      Shell.ReloadTaskbar();
    }
  });
Shell.Software[ContextUID].Icon = "/System/Assets/Softwares/Undefined/Icon.svg";
Shell.Software[ContextUID].Workspace = Shell.Workspace;
Shell.Software[ContextUID].ContextUID = ContextUID;
Shell.Software[ContextUID].Controller = Controller = Shell.Software[ContextUID].g.querySelector("iframe").contentWindow;
Shell.Software[ContextUID].SetBlank = () => {
    Shell.Software[ContextUID].Controller.document.location.href = "about:blank";
};
Shell.Software[ContextUID].Controller.document.body.onload = function () {
    if (Data.Title == undefined) {
        Shell.Software[ContextUID].setTitle(Shell.Software[UID].Controller.document.title);
    }
};
  Shell.Software[ContextUID].SetWorkspace = (Workspace) => {
    Shell.Software[ContextUID].Workspace = Workspace;
    ReloadWindows();
    ReloadTaskbar();
  }
  Shell.Software[ContextUID].EnableMenu = () => {
    Shell.Software[ContextUID].addControl({
      index: 0,
      class: "wb-menu",
      click: function(event, winbox){
          Shell.Software[UID].Controller.ShellMenuEvent();
      }
    });
  }
  Shell.Software[ContextUID].EnablePackage = () => {
    Shell.Software[ContextUID].addControl({
      index: 0,
      class: "wb-package",
      click: function(event, winbox){
          Shell.Software[UID].Controller.ShellPackageEvent();
      }
    });
  }
  Shell.Software[ContextUID].Controller.ContextWindow = Shell.Shell.Software[UID];
  Shell.Software[ContextUID].Controller.Kernel = Kernel;
  Shell.Software[ContextUID].Controller.Shell = Shell;
  Shell.Software[ContextUID].SecondaryWindow = (WindowObject) => {
    WindowObject.addClass("no-close").addClass("no-min");
    Shell.Software[ContextUID].onminimize = () => {
      WindowObject.minimize();
    };
    Shell.Software[ContextUID].onrestore = () => {
      WindowObject.restore();
    };
  };
  Shell.Software[ContextUID].ShowDialog = (Title, Text) => {
    Shell.Software[ContextUID].Dialog = new WinBox({
      html: `<h1 style="color:white;text-align: center;width : 100%;">${Title}</h1><p style="color:white;text-align: center;width : 100%;">${Text}</p>`,
      modal: true
    });
  }
  if (Data.NoMenu == undefined) {
    ToggleStartMenu();
  }
  if (DesktopConfiguration.Shell.Mobile == true){
    Shell.Software[ContextUID].g.querySelector(".wb-header").style.display = "none";
    Shell.Software[ContextUID].maximize();
  }
  ReloadTaskbar();
