import Natsuki from "./structs/discord/NatsukiClient";
import('./database/index');
import dotenv from 'dotenv'
dotenv.config();

const natsuki = new Natsuki({
    token: process.env.token as string,
    devops: ["1170153272984739893"],
    prefix: "n!",
});

natsuki.ready();
export { natsuki }