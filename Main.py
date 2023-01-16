from flask import *
import requests
import json
import os

print("Updating ...")

CurrentVersion = open("Version.conf" , "r").read()

print("Launching server ...")

App = Flask(__name__)
App.config.from_object(__name__)

def ReloadConfig():
    global SelariaMRConfig
    SelariaMRConfig = json.loads(open("Config.json" , "r").read())

def SaveConfig():
    open("Config.json" , "w").write(json.dumps(SelariaMRConfig))

ReloadConfig()

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
                "Config" : SelariaMRConfig
            })
            return Response(ResponseData , mimetype="application/json")
        elif(Action == "block"):
            if(SuperUser):
                SelariaMRConfig["Blacklist"].append(Request.get_json()["IP"])
                ReloadConfig()

if __name__ == '__main__' :
    App.run(host=SelariaMRConfig["IP"] , port=SelariaMRConfig["Port"] , debug=True)