const connectToDB = require("./config/db");
const http = require("http");
const app = require("./app");

async function startServer() {
  await connectToDB();

  const server = http.createServer(app);

  server.listen(process.env.PORT, () => {
    console.log("Server is up and running!");
  })
}

startServer()
.catch(err => {
  console.error("Error while starting the server: ", err);
  process.exit(1);
});