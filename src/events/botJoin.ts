import { Client, Events, Guild } from "discord.js"
import Config from "../models/config"

export default {
    name: Events.GuildCreate,
    once: false,
    async execute(guild: Guild, client: Client) {
        const config = await Config.findOne({ where: { guildId: guild.id }})

        if (!config) {
            Config.create({
                guildId: guild.id,
                tempBan: false,
                warnSys: false
            })
        }
    }
}