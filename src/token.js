import jwt from "jsonwebtoken";
import bluebird from "bluebird";
import env from "dotenv";

bluebird.promisifyAll(jwt);
env.config();

const key = process.env.KEY;
async function generatePair(username) {
  const accessToken = jwt.sign({ username }, key, { expiresIn: "30m" });
  const refreshToken = jwt.sign({ username }, key, { expiresIn: "30d" });

  const tokens = {
    accessToken: {
      token: accessToken,
      expiresIn: jwt.decode(accessToken).exp
    },
    refreshToken: {
      token: refreshToken,
      expiresIn: jwt.decode(refreshToken).exp
    }
  };

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
