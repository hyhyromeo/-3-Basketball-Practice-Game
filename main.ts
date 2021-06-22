import grant from "grant";
import { createHttpTerminator } from "http-terminator";
import express from "express";
import util from "util";
import fs from "fs";
import expressExpress from "express-session";
import path from "path";
import { format } from "fecha";
import dotenv from "dotenv";
import http from "http";
import socketIO from "socket.io";
import { env } from "./env";
import { setSocketIO } from "./socketio";
import { knex } from "./db";
import { isLoggedIn } from "./guards";
import { createRouter } from "./routes";
import multer from "multer";
import { UserService } from "./services/user-service";
import { UserController } from "./controllers/user-controller";
import { EventController } from "./controllers/event-controller";
import { EventService } from "./services/event-service";

dotenv.config();

let app = express();
let server = http.createServer(app);
let io = new socketIO.Server(server);
setSocketIO(io);

const httpTerminator = createHttpTerminator({ server });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let sessionMiddleware = expressExpress({
  secret: "HANG HAU CURRY",
  saveUninitialized: true,
  resave: true,
});
app.use(sessionMiddleware);

const grantExpress = grant.express({
  defaults: {
    origin: env.ORIGIN,
    transport: "session",
    state: true,
  },
  google: {
    key: env.GOOGLE_CLIENT_ID || "",
    secret: env.GOOGLE_CLIENT_SECRET || "",
    scope: ["profile", "email"],
    callback: "/login/google",
  },
});

app.use(grantExpress as express.RequestHandler);

app.use((req, res, next) => {
  let counter = req.session["counter"] || 0;
  counter++;
  req.session["counter"] = counter;
  // console.log(counter);
  next();
});

app.use((req, res, next) => {
  let date = new Date();
  let text = format(date, "YYYY-MM-DD hh:mm:ss");
  console.log(`[${text}]`, req.method, req.url);
  next();
});

app.use(express.static("public"));
// app.use(express.static('uploads'))
app.use("/admin", isLoggedIn, express.static("protected"));

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    let filename = file.fieldname + "-" + Date.now() + "-" + file.originalname;
    cb(null, filename);
  },
});
let upload = multer({ storage });

let userService = new UserService(knex);
let eventService = new EventService(knex);

let userController = new UserController(userService);
let eventController = new EventController(eventService);

let router = createRouter({
  upload,
  userController,
  eventController,
});
app.use(router);

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "public", "404.html"));
});

export async function main(PORT: number) {
  if (!fs.existsSync("uploads")) {
    fs.mkdirSync("uploads");
  }
  await new Promise<void>((resolve, reject) => {
    server.listen(PORT, () => {
      console.log(`listening on http://localhost:${PORT}`);
      resolve();
    });
    server.on("error", reject);
  });
  async function close() {
    console.debug("close io server");
    await util.promisify(io.close.bind(io))();

    console.debug("close knex clint");
    await knex.destroy();

    console.debug("close http server");
    await httpTerminator.terminate();

    console.debug("closed all");
  }
  return { server, close };
}
