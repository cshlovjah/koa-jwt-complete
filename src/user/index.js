import Joi from "joi";
import schema from "./schema";
import redis from "../redis";
import Token from "../token";

async function isAuthorized(request) {
  const { error, value } = Joi.validate(request, schema);

  if (error) return false;

  const providedPassword = value.password;

  const correctPassword = await redis.getAsync(value.username);

  return providedPassword == correctPassword;
}

async function hasValidRefreshToken(token) {
  const { username } = await Token.getPayload(token);
  const correctRefreshToken = await redis.getAsync(`${username}_refresh_token`);
  return correctRefreshToken == token
}

async function register(request) {
  const { error, value } = Joi.validate(request, schema);
  if (error) return false;
  const userNameExist = await redis.getAsync(`${value.username}_access_token`);
  const providedUsername = value.username;
  const providedPassword = value.password;

  console.log("userNameExist ", userNameExist)
  if (userNameExist === null) {
    console.log("Имя пользователя не найдено, созадем")
    const token = Token.generatePair(providedUsername);
    return token
  } else {
    console.log("Имя пользователя существует, пропускаем")
    return false
  }
}


export default { isAuthorized, hasValidRefreshToken, register };
