import redis from "../src/redis";
import Token from "../src/token";

export default async (ctx, next) => {
  const start = Date.now();

  ctx.status = 401;
  const { authorization } = ctx.headers;

  if (authorization || authorization.match(/^Bearer\s/)) {
    const accessToken = authorization.replace(/^Bearer\s/, "");

    const { username } = await Token.getPayload(accessToken);
    const t = await redis.getAsync(`${username}_access_token`);
  
    if (accessToken == t) {
      const { username } = await Token.getPayload(t);
      if (username) {
        console.log("Start ", start);
        ctx.status = 200;
        await next();
      }
    }
  }
};
