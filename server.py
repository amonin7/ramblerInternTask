from http.server import HTTPServer, BaseHTTPRequestHandler


class Serv(BaseHTTPRequestHandler):

    def do_GET(self):
        if self.path == '/':
            self.path = '/urlurl.html'
        try:
            fileToOpen = open(self.path[1:]).read()
            self.send_response(200)
        except:
            fileToOpen = "File not found"
            self.send_response(404)
        self.end_headers()
        self.wfile.write(bytes(fileToOpen, 'utf-8'))


# host = int(input())

httpd = HTTPServer(('localhost', 8080), Serv)
httpd.serve_forever()

