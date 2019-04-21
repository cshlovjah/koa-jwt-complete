import Token from "./token";
import redis from "./redis";
import uuidv4 from "uuid/v4";
import objectHash from "object-hash";
const bcrypt = require('bcrypt');
const saltRounds = 10;

async function CreateUser(userCredentials, session){
    const password = bcrypt.hashSync(userCredentials.password, saltRounds);
    const tokens = await Token.generatePair(userCredentials.username);
   
    const modifyUser = (user, session) => ({
        ...user,
        sessions: [
            {
                id: uuidv4(),
                fpc: objectHash(session.ua),
                ua: session.ua,
                tokens: tokens
            }
        ],
        password: password,
        createdAt: new Date(),
    })
    console.log("userCredentials", modifyUser(userCredentials, session))
    await redis.setAsync(`${userCredentials.username}`, JSON.stringify(modifyUser(userCredentials, session)));
    return tokens
}

export default CreateUser