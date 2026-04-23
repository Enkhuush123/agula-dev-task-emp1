const app = require("./app");

const PORT = Number(process.env.PORT) || 5050;
const HOST = process.env.HOST || "127.0.0.1";

const server = app.listen(PORT, HOST, () => {
  console.log(`Server is running at http://${HOST}:${PORT}`);
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is already in use. Try PORT=5051 npm start.`);
  } else {
    console.error("Failed to start server", error);
  }

  process.exit(1);
});
