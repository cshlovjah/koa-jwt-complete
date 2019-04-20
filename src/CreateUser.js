import Token from "./token";
import redis from "./redis";
import uuidv4 from "uuid/v4";
import objectHash from "object-hash";
const bcrypt = require('bcrypt');
const saltRounds = 10;

async function CreateUser(userCredentials){
    const password = bcrypt.hashSync(userCredentials.password, saltRounds);
    const tokens = await Token.generatePair(userCredentials.username);
    const fingerPrintClient = {
        id: uuidv4(),
        fpc: objectHash(userCredentials.ua)
    }
    console.log("userCredentials", userCredentials)
    const modifyUser = user => ({
        ...user,
        fpc: fingerPrintClient,
        password: password,
        tokens: tokens
    })
    await redis.setAsync(`${userCredentials.username}`, JSON.stringify(modifyUser(userCredentials)));
    return tokens
}

export default CreateUser