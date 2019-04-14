import Token from "./token";
import env from "dotenv";
import redis from "./redis";
const bcrypt = require('bcrypt');
const saltRounds = 10;

async function UpdateUser(userCredentials){
    const userString = await redis.getAsync(`${userCredentials.username}`);
    let user = JSON.parse(userString);

    const tokens = await Token.generatePair(userCredentials.username);
    user.tokens = tokens;
    await redis.setAsync(`${userCredentials.username}`, JSON.stringify(user));

    return user.tokens
    
}

export default UpdateUser