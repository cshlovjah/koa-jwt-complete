import redis from "../redis";
import Token from "../token";

export default async (ctx, next) => {
  const start = Date.now();

  ctx.status = 401;
  const { authorization } = ctx.headers;

  if (authorization || authorization.match(/^Bearer\s/)) {
    const accessToken = authorization.replace(/^Bearer\s/, "");

    const { username } = await Token.getPayload(accessToken);
    const correctAccessToken = await redis.getAsync(`${username}_access_token`);
  
    if (accessToken == correctAccessToken) {
      const { username } = await Token.getPayload(correctAccessToken);
      if (username) {
        console.log("Start ", start);
        ctx.status = 200;
        await next();
      }
    }
  } else {
    ctx.status = 404;
    await next();
  }
};
