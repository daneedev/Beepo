import cron from "node-cron"
import { Client } from "discord.js"
import TempBan from "../models/tempban"
import logger from "../handlers/logger"

export function tempbanScheduler(client: Client) {
    cron.schedule('* * * * *', async () => {
        try {
            const now = Math.floor(Date.now() / 1000).toString()
            const bans = await TempBan.findAll()
            const expiredBans = bans.filter((ban) => ban.unbanTimestamp < now)

            for (const ban of expiredBans) {
                try {
                    const guild = client.guilds.cache.get(ban.guildId)
                    if (guild) {
                        await guild.members.unban(ban.userId, "Temporary ban expired")
                    }

                    await TempBan.destroy({ where: { id: ban.id }})
                } catch (error : any) {
                    logger.error(error)
                }
            } 
        } catch (error : any) {
            logger.error(error)
        }
    })
}