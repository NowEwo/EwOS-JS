from flask import *
import json
import os

App = Flask(__name__)
App.config.from_object(__name__)

SelariaMRConfig = json.loads(open("Config.json" , "r").read())

@App.route('/', defaults={'PATH': 'Index.html'})
@App.route('/<path:PATH>')
def File(PATH):
    if(request.environ['REMOTE_ADDR'] in SelariaMRConfig["Blacklist"]):
        return send_from_directory('.', "Blacklisted.html")
    else:
        return send_from_directory('.', PATH.split("?")[0])

@App.route('/api/', defaults={'Action': 'Infos'})
@App.route('/api/<path:Action>')
def API(Action):
    if(request.environ['REMOTE_ADDR'] in SelariaMRConfig["Blacklist"]):
        return send_from_directory('.', "Blacklisted.html")
    else:
        if(Action == "Infos"):
            SuperUser = False
            if(request.environ['REMOTE_ADDR'] in SelariaMRConfig["SuperUser"]):
                SuperUser = True
            ResponseData = json.dumps({
                "Started" : True,
                "RequestFrom" : request.environ['REMOTE_ADDR'],
                "SuperUser" : SuperUser,
                "SelariaFolder" : os.getcwd(),
                "Config" : SelariaMRConfig
            })
            return Response(ResponseData , mimetype="application/json")

if __name__ == '__main__' :
    App.run(host="localhost" , port=49530)