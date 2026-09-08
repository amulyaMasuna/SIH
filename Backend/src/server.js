require("dotenv").config();
const connectToDB = require("./config/db");
const http = require("http");
const app = require("./app");

const PORT = process.env.PORT || 5000;

async function startServer() {
  await connectToDB();

  const server = http.createServer(app);

  server.listen(PORT, () => {
    console.log(`SIH26034 Backend Server is up and running on port ${PORT}!`);
  });
}

startServer()
.catch(err => {
  console.error("Error while starting the server: ", err);
  process.exit(1);
});