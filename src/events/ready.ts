import { Events, Client } from "discord.js"
import logger from "../handlers/logger";
import { connectDB } from "../db";

export default {
    name: Events.ClientReady,
    once: true,
    async execute(client: Client) {
        logger.info(`Logged in as ${client.user?.tag}!`);
        await connectDB()
    }
}