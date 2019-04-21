import Token from "./token";
import redis from "./redis";
import uuidv4 from "uuid/v4";
import objectHash from "object-hash";
import { suiteSetup } from "mocha";
async function UpdateUser(userCredentials, session) {
  const user = JSON.parse(await redis.getAsync(`${userCredentials.username}`));

  const fpc = objectHash(session);

  const cursor = user.sessions
    .map(function(session) {
      return session.fpc;
    })
    .indexOf(fpc);

  console.log("cursor ", cursor);

  let tokens = await Token.generatePair(user.username);

  if (cursor == -1) {
    let ses = {
      id: uuidv4(),
      fpc: fpc,
      ua: session,
      tokens: tokens,
      createdAt: new Date()
    };
    user.sessions.push(ses);

    const modifyUser = user => ({
      ...user
    });
    console.log("ccc ", modifyUser(user));
    await redis.setAsync(
      `${userCredentials.username}`,
      JSON.stringify(modifyUser(user))
    );
  } else {
    //const objectFound = user.sessions[cursor];
    //console.log("objectFound ", objectFound)
  }

  /*
    
    const modifyUser = user => ({
        ...user,
        tokens: tokens
    });
    await redis.setAsync(`${userCredentials.username}`, JSON.stringify(modifyUser(user)));
    */
  return tokens;
}

export default UpdateUser;
