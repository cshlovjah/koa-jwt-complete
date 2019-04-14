import jwt from "jsonwebtoken";
import bluebird from "bluebird";
import env from "dotenv";
import redis from "./redis";

bluebird.promisifyAll(jwt);
env.config();

const key = process.env.KEY;
async function generatePair(username) {
  const accessToken = jwt.sign({ username }, key, { expiresIn: "1m" });
  const refreshToken = jwt.sign({ username }, key, { expiresIn: "30d" });

  const tokens = {
    accessToken,
    refreshToken,
    expiresIn: jwt.decode(accessToken).exp
  };

  const user = {
    username: username,
    tokens: {
      access: {
        token: accessToken,
        expiresIn: jwt.decode(accessToken).exp
      },
      refresh: {
        token: refreshToken,
        expiresIn: jwt.decode(refreshToken).exp
      },
    }
  }


  await redis.setAsync(`${username}`, JSON.stringify(user));
  await redis.setAsync(`${username}_access_token`, accessToken);
  await redis.setAsync(`${username}_refresh_token`, refreshToken);

  return tokens;
}

async function getPayload(token) {
  try {
    const payload = await jwt.verifyAsync(token, key);
    return payload;
  } catch (error) {
    console.log("Cannot verify token: ", token);
  }

  return {};
}

export default { generatePair, getPayload };
