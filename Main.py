from http.server import HTTPServer, BaseHTTPRequestHandler
import webbrowser

class web_server(BaseHTTPRequestHandler):

    def do_GET(self):
        if self.path == '/':
            self.path = '/index.html'
        try:
            file_to_open = open(self.path[1:]).read()
            self.send_response(200)
        except:
            file_to_open = "File not found"
            self.send_response(404)
        
        if self.path.endswith(".js"):
            self.headers.add_header("Content-Type" , "application/javascript")
        
        self.end_headers()
        self.wfile.write(bytes(file_to_open, 'utf-8'))


httpd = HTTPServer(('localhost', 49350), web_server)
webbrowser.open("http://localhost:49350")
httpd.serve_forever()

# ---Backup---
# import http.server
# import socketserver
# 
# 
# PORT = 49350
# Handler = http.server.SimpleHTTPRequestHandler
# with socketserver.TCPServer(("", PORT), Handler) as http:
#     print("serving at port", PORT)
#     webbrowser.open("http://localhost:49350")
#     http.serve_forever()