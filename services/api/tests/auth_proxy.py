"""CI-only fixed loopback proxy matching the /auth/v1 gateway prefix."""

from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

import httpx


class Proxy(BaseHTTPRequestHandler):
    def log_message(self, *args):
        pass

    def do_OPTIONS(self):
        self.send_response(204)
        self._cors()
        self.end_headers()

    def _cors(self):
        self.send_header("Access-Control-Allow-Origin", "http://127.0.0.1:13000")
        self.send_header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS")
        self.send_header(
            "Access-Control-Allow-Headers",
            "apikey,authorization,content-type,x-client-info,x-supabase-api-version",
        )

    def dispatch(self):
        if not self.path.startswith("/auth/v1/"):
            self.send_error(404)
            return
        body = self.rfile.read(int(self.headers.get("Content-Length", "0")))
        headers = {
            key: value
            for key, value in self.headers.items()
            if key.lower() not in {"host", "content-length", "connection"}
        }
        # No cloud gateway here. Only the synthetic publishable key is stripped;
        # actual user bearer JWTs are forwarded to the real Auth server.
        for key, value in list(headers.items()):
            if key.lower() == "authorization" and value.lower().startswith(
                "bearer sb_publishable_ci_"
            ):
                headers.pop(key)
        with httpx.Client(timeout=10, follow_redirects=False) as client:
            response = client.request(
                self.command,
                "http://127.0.0.1:19999" + self.path[len("/auth/v1") :],
                content=body,
                headers=headers,
            )
        self.send_response(response.status_code)
        self._cors()
        self.send_header(
            "Content-Type", response.headers.get("Content-Type", "application/json")
        )
        self.end_headers()
        self.wfile.write(response.content)

    do_GET = dispatch
    do_POST = dispatch
    do_PUT = dispatch
    do_DELETE = dispatch


if __name__ == "__main__":
    ThreadingHTTPServer(("127.0.0.1", 19000), Proxy).serve_forever()
