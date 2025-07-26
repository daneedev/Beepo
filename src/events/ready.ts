import { Events, Client } from "discord.js"
import logger from "../handlers/logger";
import { connectDB } from "../db";
import { tempbanScheduler } from "../schedulers/tempban-scheduler";

export default {
    name: Events.ClientReady,
    once: true,
    async execute(client: Client) {
        logger.info(`Logged in as ${client.user?.tag}!`);
        await connectDB()
        tempbanScheduler(client)
    }
}