import redis from "../redis";
import Token from "../token";

export default async (ctx, next) => {
  const start = Date.now();

  ctx.status = 401;

  const { authorization } = ctx.headers;

  if (authorization || authorization.match(/^Bearer\s/)) {
    const accessToken = authorization.replace(/^Bearer\s/, "");

    const { username } = await Token.getPayload(accessToken);

    const userString = await redis.getAsync(`${username}`);

    const user = JSON.parse(userString);
 
    if (user !== null) {

      const cursor = user.sessions.map(function (session) { return session.tokens.accessToken.token; }).indexOf(accessToken);
      const objectFound = user.sessions[cursor];
      const correctAccessToken = objectFound.tokens.accessToken.token

      if (accessToken == correctAccessToken) {
        const { username } = await Token.getPayload(correctAccessToken);
        if (username) {
          console.log("Start ", start);
          ctx.status = 200;
          await next();
        }
      }
    }

  } else {
    ctx.status = 404;
    await next();
  }
};
