import Token from "./token";
import env from "dotenv";
import redis from "./redis";
const bcrypt = require('bcrypt');
const saltRounds = 10;

async function CreateUser(userCredentials){
    const password = bcrypt.hashSync(userCredentials.password, saltRounds);
    const tokens = await Token.generatePair(userCredentials.username);
    
    const user = {
        username: userCredentials.username,
        password: password,
        tokens: tokens
    }

    await redis.setAsync(`${userCredentials.username}`, JSON.stringify(user));

    return tokens
    
}

export default CreateUser