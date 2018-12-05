import Koa from "koa";
import logger from "koa-morgan";
import helmet from "koa-helmet";
import env from "dotenv";
import router from "./router";
import IO from "koa-socket-2";
import cors from "@koa/cors";
import winston from "koa2-winston";
env.config();

const port = process.env.PORT;
const server = new Koa();
const io = new IO();
io.attach(server);

io.on("connection", (ctx, data) => {
  console.log("Connection ", ctx.socket.id);
  setInterval(() => {
    ctx.socket.emit("HelloWorld", {
      data: "HelloWorld"
    });
  }, 2000);

  //console.log('client sent data to message endpoint', data);
});

server
  .use(cors())
  .use(helmet())
  .use(logger("tiny"))
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(port, () => {
    console.log("Auth");
  });
