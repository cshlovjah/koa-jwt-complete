import Router from "koa-router";
import bodyParser from "koa-bodyparser";
import User from "./user";
import Token from "./token";
import Authorization from "./middleware/Authorization";
import redis from "./redis";
import jwt from "jsonwebtoken";
const router = new Router();

router.post("/auth/login", bodyParser(), async ctx => {
  console.log(ctx.request.body);
  const isAuthorized = await User.isAuthorized(ctx.request.body);
  if (isAuthorized) {
    const tokens = await Token.generatePair(ctx.request.body.username);
    console.log("Авторизован");
    ctx.status = 200;
    ctx.body = tokens;
  }
});

router.post("/auth/register", bodyParser(), async ctx => {

  const user = await User.register(ctx.request.body)
  if (!user) {
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
  const correctRefreshToken = await redis.getAsync(`${username}_refresh_token`);

  //Сравнивает refresh token клиента с refresh token'ом найденным в БД
  //Проверяет валидность и срок действия refresh token'а
  const currentDate = Math.floor(Date.now() / 1000);
  const expiresIn = jwt.decode(refreshToken).exp;

  if (correctRefreshToken == refreshToken && currentDate < expiresIn) {
    console.log("refresh expiresIn ", expiresIn);
    const tokens = await Token.generatePair(username);
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
