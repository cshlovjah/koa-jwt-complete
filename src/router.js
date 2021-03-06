import Router from "koa-router";
import bodyParser from "koa-bodyparser";
import User from "./user";
import Token from "./token";
import Authorization from "./middleware/Authorization";
import redis from "./redis";
import jwt from "jsonwebtoken";
import deviceType from "device-type";
import UpdateToken from "./UpdateToken";
import uaparserjs from "ua-parser-js";


const router = new Router();

router.get("/", bodyParser(), async ctx => {
  ctx.status = 200;
  ctx.body = {
    message: "Welcome to great auth api!"
  };
});

router.post("/auth/login", bodyParser(), async ctx => {
  console.log(ctx.request.body);
  const isAuthorized = await User.isAuthorized(ctx.request.body);
  if (isAuthorized) {
    //Обновляем ключ
    const session = {
      ua: uaparserjs(ctx.request.header["user-agent"]),
      clientip: ctx.request.ip,
    };

    const updateToken = await UpdateToken(ctx.request.body, session);
    console.log("Авторизован");
    ctx.status = 200;
    ctx.body = updateToken;
  }
});

router.post("/auth/register", bodyParser(), async ctx => {
  const user = await User.register(ctx.request);
  if (user) {
    ctx.status = 200;
    ctx.body = {
      message: user
    };
  } else {
    ctx.status = 409;
    ctx.body = {
      message: false
    };
  }
});

//Если истекло клиент отправляет на auth/refresh-token URL refresh token
router.post("/auth/refresh-token", bodyParser(), async ctx => {
  ctx.status = 401;
  const { authorization } = ctx.headers;

  if (!authorization || !authorization.match(/^Bearer\s/)) return;

  const refreshToken = authorization.replace(/^Bearer\s/, "");

  //Сервер берет user_id из payload'a refresh token'a по нему ищет в БД запись данного юзера и достает из него refresh token

  const { username } = await Token.getPayload(refreshToken);
  console.log("username ", username);
  const user = JSON.parse(await redis.getAsync(`${username}`));

  const cursor = user.sessions
    .map(function(session) {
      return session.tokens.refreshToken.token;
    })
    .indexOf(refreshToken);
  console.log("Cursor ", cursor);
  const objectFound = user.sessions[cursor];
  console.log("objectFound", objectFound);
  //Сравнивает refresh token клиента с refresh token'ом найденным в БД
  //Проверяет валидность и срок действия refresh token'а
  const currentDate = Math.floor(Date.now() / 1000);
  const expiresIn = jwt.decode(refreshToken).exp;

  if (
    objectFound.tokens.refreshToken.token == refreshToken &&
    currentDate < expiresIn
  ) {
    const tokens = await Token.generatePair(username);
   
    const modifyUser = user => ({
      ...user,
      tokens: tokens,
      updatedAt: new Date()
    });
    console.log("***");
    const modifiedSession = modifyUser(user.sessions[cursor]);

    user.sessions[cursor] = modifiedSession;

    await redis.setAsync(`${username}`, JSON.stringify(user));
    ctx.status = 200;
    ctx.body = tokens;
  }
});

router.use(Authorization);
router.post("/api", bodyParser(), async ctx => {
  ctx.status = 200;
  ctx.body = {
    message: "Hello"
  };
});

export default router;
