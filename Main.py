import socketserver
import http.server
import webbrowser
import websockets
import asyncio
import json

Configuration = json.loads(open("Config.json" , "r").read())

async def WebSocket():
    uri = "ws://localhost:49351"
    async with websockets.connect(uri) as websocket:
        Command = await websocket.recv()
        print(f"<<< {Command}")

if(Configuration["WebSocket"] == "Enabled"):
    asyncio.run(WebSocket())

PORT = 49350
Handler = http.server.SimpleHTTPRequestHandler
with socketserver.TCPServer(("", PORT), Handler) as http:
    print("serving at port", PORT)
    webbrowser.open("http://localhost:49350")
    http.serve_forever()