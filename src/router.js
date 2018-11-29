import Router from "koa-router";
import bodyParser from "koa-bodyparser";
import User from "./user";
import Token from "./token";

const router = new Router();

router.get("/api", bodyParser(), async ctx => {
  ctx.status = 401;

  const { authorization } = ctx.headers;

  if (!authorization || !authorization.match(/^Bearer\s/)) return;

  const accessToken = authorization.replace(/^Bearer\s/, "");

  await Token.isAuthAccessToken(accessToken);

  ctx.status = 200;
  ctx.body = {
    message: "Hello"
  };
});

router.post("/auth", bodyParser(), async ctx => {
  console.log(ctx.request.body);
  const isAuthorized = await User.isAuthorized(ctx.request.body);
  if (isAuthorized) {
    const tokens = await Token.generatePair(ctx.request.body.username);
    console.log("Авторизован");
    ctx.status = 200;
    ctx.body = tokens;
  }
});

router.get("/auth", async ctx => {
  ctx.status = 401;
  const { authorization } = ctx.headers;

  if (!authorization || !authorization.match(/^Bearer\s/)) return;

  const refreshToken = authorization.replace(/^Bearer\s/, "");

  const { username } = await Token.getPayload(refreshToken);

  const hasValidRefreshToken = await User.hasValidRefreshToken(refreshToken);

  if (hasValidRefreshToken) {
    const tokens = await Token.generatePair(username);

    ctx.status = 200;
    ctx.body = tokens;
  }
});

export default router;
