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
    console.log("user ", user)
    if (user !== null) {

      var elementPos = user.sessions.map(function (x) { return x.tokens.accessToken.token; }).indexOf(accessToken);
      var objectFound = user.sessions[elementPos];
      console.log(objectFound)

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
