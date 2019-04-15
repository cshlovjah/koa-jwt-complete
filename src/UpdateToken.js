import Token from "./token";
import env from "dotenv";
import redis from "./redis";
const bcrypt = require('bcrypt');
const saltRounds = 10;

async function UpdateUser(userCredentials){
    const user = JSON.parse(await redis.getAsync(`${userCredentials.username}`));
    const tokens = await Token.generatePair(userCredentials.username);
    const modifyUser = user => ({
        ...user,
        tokens: tokens
    })
    await redis.setAsync(`${userCredentials.username}`, JSON.stringify(modifyUser(user)));
    return tokens
}

export default UpdateUser