import Joi from "joi";
import schema from "./schema";
import redis from "../redis";
import Token from "../token";
import CreateUser from "../CreateUser";
import uaparserjs from "ua-parser-js";
const bcrypt = require('bcrypt');
const saltRounds = 10;
async function isAuthorized(request) {
  const { error, value } = Joi.validate(request, schema);
  if (error) return false;
  const providedPassword = value.password;
  const user = JSON.parse(await redis.getAsync(value.username));
  const hashPassword = bcrypt.compareSync(providedPassword, user.password);
  return hashPassword;
}

async function hasValidRefreshToken(token) {
  const { username } = await Token.getPayload(token);
  const user = await redis.getAsync(`${username}`);
  user.tokens.refreshToken.token
  return user.tokens.refreshToken.token == token
}

async function register(request) {
  const { error, value } = Joi.validate(request.body, schema);
 

  const session = {
    ua: uaparserjs(request.header['user-agent']),
    clientip: request.ip
  }
  console.log(error)
  if (error) return false;
  const userNameExist = await redis.getAsync(`${value.username}`);
  if (userNameExist === null) {
    console.log("Имя пользователя не найдено, созадем")
    const token = await CreateUser(value, session);
    return token
  } else {
    console.log("Имя пользователя существует, пропускаем")
    return false
  }
}


export default { isAuthorized, hasValidRefreshToken, register };
