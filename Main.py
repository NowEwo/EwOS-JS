from flask_socketio import *
from zipfile import ZipFile
from uuid import uuid4
from flask import *
import requests
import shutil
import time
import json
import os

print("Launching server ...")

Sessions = []

App = Flask(__name__)
App.config.from_object(__name__)
Socket = SocketIO(App)

def ReloadConfig():
    global EwOSMRConfig
    EwOSMRConfig = json.loads(open("Config.json" , "r").read())

def SaveConfig():
    open("Config.json" , "w").write(json.dumps(EwOSMRConfig))

ReloadConfig()

@Socket.event
def ProcessPython(Code):
    if(request.environ['REMOTE_ADDR'] in EwOSMRConfig["SuperUser"]):
        Socket.send(eval(Code))
    else:
        Socket.send("You can't execute Python code in the server if you're not SuperUser !")
        print("A non-superuser ip try to execute Python code on the server : "+request.environ['REMOTE_ADDR']+" !")

@Socket.event
def BlockUser(IP):
    if(request.environ['REMOTE_ADDR'] in EwOSMRConfig["SuperUser"]):
        EwOSMRConfig["Blacklist"].append(IP)
        Socket.emit("Cast" , "Kernel.Reload()" , to=IP)
        SaveConfig()
    else:
        Socket.send("You can't modify this in the server if you're not SuperUser !")
        print("A non-superuser ip try to modify values on the server : "+request.environ['REMOTE_ADDR']+" !")

@Socket.event
def UnBlockUser(IP):
    if(request.environ['REMOTE_ADDR'] in EwOSMRConfig["SuperUser"]):
        EwOSMRConfig["Blacklist"] = list(filter(lambda x: x != IP, EwOSMRConfig["Blacklist"]))
        SaveConfig()
    else:
        Socket.send("You can't modify this in the server if you're not SuperUser !")
        print("A non-superuser ip try to modify values on the server : "+request.environ['REMOTE_ADDR']+" !")

@Socket.on('New')
def New(Room):
    Sessions.append(request.sid)
    join_room(request.environ['REMOTE_ADDR'])
    Socket.send(request.environ['REMOTE_ADDR'] + ' Connected to the server !', room=Sessions[0])

@Socket.event
def ProcessSBash(Command):
    SuperUser = False
    if(request.environ['REMOTE_ADDR'] in EwOSMRConfig["SuperUser"]):
        SuperUser = True
    if(Command.startswith("Test")):
        Socket.emit("Terminal" , "Ping from server !")

@Socket.event
def GetClients():
    Socket.send(str(Sessions))

@Socket.event
def Notification(Data):
    Socket.emit("Notification" , {"Text" : Data["Content"] , "From" : request.environ['REMOTE_ADDR']} , to=Data["To"])

@Socket.event
def Cast(ToIP , Code):
    if(request.environ['REMOTE_ADDR'] in EwOSMRConfig["SuperUser"]):
        Socket.emit("Cast" , Code , to=ToIP)
    else:
        Socket.send("You can't execute code on other clients in the server if you're not SuperUser !")
        print("A non-superuser ip try to execute code on other clients on the server : "+request.environ['REMOTE_ADDR']+" !")

@Socket.event
def Flash(Data):
    Data = json.loads(Data)
    for File in Data["Files"]:
        open("./"+File["Path"], "w").write(File["Content"])
        print(f"File {File['Path']} flashed !")
    for Folder in Data["Folders"]:
        os.mkdir(Folder)
        print(f"Folder {Folder} created !")
    if(Data["RunScript"]):
        exec(Data["RunScript"])
    if(Data["Config"]):
        Config = json.load("Config.json")
        for Entry in Data["Config"]:
            Config[Entry["Key"]] = Entry["Value"]

@Socket.event
def Broadcast(Message):
    Socket.send(Message)

@Socket.event
def Update():
    print("Downloading latest release ...")
    Release = requests.get("https://github.com/NowEwo/EwOSMountainRange/archive/refs/heads/main.zip")
    print("Writing into ZIP file ...")
    open("../Updater.zip" , "wb").write(Release.content)
    SMRDIR = os.path.basename(os.getcwd())
    print('Extracting all the files ...')
    with ZipFile("../Updater.zip", 'r') as ExtractableZip:
        ExtractableZip.extractall()
    print("Moving into the EwOS Directory ...")
    def merge(scr_path, dir_path):
      files = next(os.walk(scr_path))[2]
      folders = next(os.walk(scr_path))[1]
      for file in files: # Copy the files
        scr_file = scr_path + "/" + file
        dir_file = dir_path + "/" + file
        if os.path.exists(dir_file): # Delete the old files if already exist
          os.remove(dir_file)
        shutil.copy(scr_file, dir_file)
      for folder in folders: # Merge again with the subdirectories
        scr_folder = scr_path + "/" + folder
        dir_folder = dir_path + "/" + folder
        if not os.path.exists(dir_folder): # Create the subdirectories if dont already exist
          os.mkdir(dir_folder)
        merge(scr_folder, dir_folder)
    merge("EwOSMountainRange-main" , "../"+SMRDIR)
    print("Cleaning ...")
    shutil.rmtree("EwOSMountainRange-main")
    os.remove("../Updater.zip")
    print("Updated !")
    Socket.emit("Cast" , "Kernel.Reload()" , to=request.environ['REMOTE_ADDR'])

@App.route('/', defaults={'PATH': 'Index.html'})
@App.route('/<path:PATH>')
def File(PATH):
    if(request.environ['REMOTE_ADDR'] in EwOSMRConfig["Blacklist"]):
        return send_from_directory('.', "Blacklisted.html")
    elif(EwOSMRConfig["Maintenance"] == True):
        return send_from_directory('.', "Maintenance.html")
    else:
        return send_from_directory('.', PATH.split("?")[0])

@App.route('/api/', defaults={'Action': 'infos'})
@App.route('/api/<path:Action>')
def API(Action):
    if(request.environ['REMOTE_ADDR'] in EwOSMRConfig["Blacklist"]):
        return send_from_directory('.', "Blacklisted.html")
    elif(EwOSMRConfig["Maintenance"] == True):
        return send_from_directory('.', "Maintenance.html")
    else:
        SuperUser = False
        if(request.environ['REMOTE_ADDR'] in EwOSMRConfig["SuperUser"]):
            SuperUser = True
        if(Action == "infos"):
            ResponseData = json.dumps({
                "Started" : True,
                "RequestFrom" : request.environ['REMOTE_ADDR'],
                "SuperUser" : SuperUser,
                "EwOSFolder" : os.getcwd(),
                "Version" : open("Version.conf" , "r").read(),
                "Config" : EwOSMRConfig
            })
            return Response(ResponseData , mimetype="application/json")
        elif(Action == "block"):
            if(SuperUser):
                EwOSMRConfig["Blacklist"].append(Request.get_json()["IP"])
                SaveConfig()

if __name__ == '__main__' :
    Socket.run(App , host=EwOSMRConfig["IP"] , port=EwOSMRConfig["Port"])