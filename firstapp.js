//To import file system
const fs = require("fs");
//Write file async to write in file
fs.writeFileSync("hello.txt", "Hello world");
//   console.log("Method" + req.method, "Url", req.url, "header", req.headers);

//Request listener function takes 2 params=> request:Incoming msg and response:serverResponse
// function rqListener(req, res) {}
//To create server, needs param request-listener/ request-listener executes on every request
const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;
  if (url === "/") {
    res.setHeader("Content-type", "text/html");
    res.write("<h1>Hola</h1>");
    res.write(
      '<p><form action="/message" method="POST"><input type="text" name="msg"><button type="Submit">Send</button></p>'
    );
    return res.end();
  }
  if (url === "/message" && method === "POST") {
    const body = [];
    //Data in streams
    req.on("data", (chunk) => {
      console.log(chunk);
      body.push(chunk);
    });
    req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      const message = parsedBody.split("=")[1];
      fs.writeFile("message.txt", message, (err) => {
        res.statusCode = 302;
        res.setHeader("Location", "/");
        return res.end();
      });
    });
  } else {
    res.setHeader("Content-type", "text/html");
    res.write("<h1>hi there from node.js</h1>");
    res.write("<p><H3>Message page and post request</H3></p>");
    res.end();
  }
  //To quit the server
  //   process.exit();
});
