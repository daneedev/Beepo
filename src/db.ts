import { Sequelize } from "sequelize";
import logger from "./handlers/logger";

const db = new Sequelize({
    dialect: "sqlite",
    storage: "./db.sqlite",
    logging: false
})

async function connectDB() {
    try {
        await db.authenticate()
        logger.success("Database connected succesfully")
    } catch (error) {
        logger.error("Unable to connect to database, error: " + error)
    }
}

export default { connectDB, db};