import Router from "koa-router";
import bodyParser from "koa-bodyparser";
import User from "./user";
import Token from "./token";
import Auth from "../middleware/Auth";
const router = new Router();

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

router.post("/auth/refreshToken", bodyParser(), async ctx => {
  ctx.status = 200;
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

router.use(Auth);
router.get("/api", bodyParser(), async ctx => {
  ctx.status = 200;
  ctx.body = {
    message: "Hello"
  };
});

export default router;
