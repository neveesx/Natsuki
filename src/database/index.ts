import mongoose from "mongoose";
import colors from "colors"
import dotenv from 'dotenv'
dotenv.config();

// Importando os schemas
import userDB from "./schemas/userschema"
import guildDB from "./schemas/guildschema"

mongoose.connect(process.env.database as string)
.then(() => {
    console.log('\n📦 ~', colors.blue.bold('Database'), 'conectada com sucesso!')
})
.catch((err) => {
    console.error(colors.red('Um erro ocorreu ao se conectar a Database'), err)
});

// Exportações dos schemas
export {
    userDB,
    guildDB
}