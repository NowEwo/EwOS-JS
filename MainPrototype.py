from flask import *
import json

App = Flask(__name__)
App.config.from_object(__name__)

SelariaMRConfig = json.loads(open("Config.json" , "r").read())

@App.route('/', defaults={'PATH': 'Index.html'})
@App.route('/<path:PATH>')
def File(PATH):
    return send_from_directory('.', PATH.split("?")[0])

@App.route('/api/', defaults={'Action': 'Infos'})
@App.route('/api/<path:Action>')
def API(Action):
    if(Action == "Infos"):
        SuperUser = False
        if(str(Request.host) in SelariaMRConfig["SuperUser"]):
            SuperUser = True
        ResponseData = json.dumps({
            "Started" : True,
            "SuperUser" : SuperUser
        })
        return Response(ResponseData , mimetype="application/json")

if __name__ == '__main__' :
    App.run(host="localhost" , port=49530)