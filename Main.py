from flask_socketio import *
from zipfile import ZipFile
from uuid import uuid4
from flask import *
import time
import json
import os

print("Launching server ...")

Sessions = []

App = Flask(__name__)
App.config.from_object(__name__)
Socket = SocketIO(App)

def ReloadConfig():
    global SelariaMRConfig
    SelariaMRConfig = json.loads(open("Config.json" , "r").read())

def SaveConfig():
    open("Config.json" , "w").write(json.dumps(SelariaMRConfig))

ReloadConfig()

@Socket.event
def ProcessPython(Code):
    if(request.environ['REMOTE_ADDR'] in SelariaMRConfig["SuperUser"]):
        Socket.send(eval(Code))
    else:
        Socket.send("You can't execute Python code in the server if you're not SuperUser !")
        print("A non-superuser ip try to execute Python code on the server : "+request.environ['REMOTE_ADDR']+" !")

@Socket.event
def BlockUser(IP):
    if(request.environ['REMOTE_ADDR'] in SelariaMRConfig["SuperUser"]):
        SelariaMRConfig["Blacklist"].append(IP)
        Socket.emit("Cast" , "Kernel.Reload()" , to=IP)
        SaveConfig()
    else:
        Socket.send("You can't modify this in the server if you're not SuperUser !")
        print("A non-superuser ip try to modify values on the server : "+request.environ['REMOTE_ADDR']+" !")

@Socket.event
def UnBlockUser(IP):
    if(request.environ['REMOTE_ADDR'] in SelariaMRConfig["SuperUser"]):
        SelariaMRConfig["Blacklist"] = list(filter(lambda x: x != 3, SelariaMRConfig["Blacklist"]))
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
    if(request.environ['REMOTE_ADDR'] in SelariaMRConfig["SuperUser"]):
        SuperUser = True
    if(Command.startswith("Test")):
        Socket.emit("Terminal" , "Ping from server !")

@Socket.event
def GetClients():
    Socket.send(str(Sessions))

@Socket.event
def Notification(Data):
    Socket.emit("Notification" , {"Text" : Data["Content"] , "From" : request.environ['REMOTE_ADDR']} , to=Data["To"])

@App.route('/', defaults={'PATH': 'Index.html'})
@App.route('/<path:PATH>')
def File(PATH):
    if(request.environ['REMOTE_ADDR'] in SelariaMRConfig["Blacklist"]):
        return send_from_directory('.', "Blacklisted.html")
    elif(SelariaMRConfig["Maintenance"] == True):
        return send_from_directory('.', "Maintenance.html")
    else:
        return send_from_directory('.', PATH.split("?")[0])

@App.route('/api/', defaults={'Action': 'infos'})
@App.route('/api/<path:Action>')
def API(Action):
    if(request.environ['REMOTE_ADDR'] in SelariaMRConfig["Blacklist"]):
        return send_from_directory('.', "Blacklisted.html")
    elif(SelariaMRConfig["Maintenance"] == True):
        return send_from_directory('.', "Maintenance.html")
    else:
        SuperUser = False
        if(request.environ['REMOTE_ADDR'] in SelariaMRConfig["SuperUser"]):
            SuperUser = True
        if(Action == "infos"):
            ResponseData = json.dumps({
                "Started" : True,
                "RequestFrom" : request.environ['REMOTE_ADDR'],
                "SuperUser" : SuperUser,
                "SelariaFolder" : os.getcwd(),
                "Version" : open("Version.conf" , "r").read(),
                "Config" : SelariaMRConfig
            })
            return Response(ResponseData , mimetype="application/json")
        elif(Action == "block"):
            if(SuperUser):
                SelariaMRConfig["Blacklist"].append(Request.get_json()["IP"])
                SaveConfig()

if __name__ == '__main__' :
    Socket.run(App , host=SelariaMRConfig["IP"] , port=SelariaMRConfig["Port"])