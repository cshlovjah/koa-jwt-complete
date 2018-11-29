import redis from "../src/redis";
import Token from "../src/token";

export default async (ctx, next) => {
  const start = Date.now();

  ctx.status = 401;
  const { authorization } = ctx.headers;

  if (authorization || authorization.match(/^Bearer\s/)) {
    console.log("authorization ", authorization);
    //const { username } = await Token.getPayload(refreshToken);
    const accessToken = authorization.replace(/^Bearer\s/, "");

    const { username } = await Token.getPayload(accessToken);
    if (username) {
      console.log(username);
      console.log("Start ", start);
      ctx.status = 200;
      await next();
    }
  }

  // const { username } = await Token.getPayload(accessToken);
  // if(username) {
  //   const accessT = await redis.getAsync(`${username}_access_token`);
  //   console.log("accessT ", accessT)
  // }
};
