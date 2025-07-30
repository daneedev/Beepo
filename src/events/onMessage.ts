import { EmbedBuilder, Events, Message } from "discord.js"
import Level from "../models/level"
import Config from "../models/config";

function getNeededXP(level: number) : number {
    return 5 * level * level + 50;
}


export default {
    name: Events.MessageCreate,
    once: false,
    async execute(message: Message) {
        const userId = message.author.id
        const guildId = message.guildId

        const guildConfig = await Config.findOne({ where: { guildId: guildId }})

        if (guildConfig?.levelSys) {

            if (message.author.bot) return;

            let level = await Level.findOne({ where: {
                userId: userId,
                guildId: guildId
            }})

            if (!level) {
                level = await Level.create({
                    userId: userId,
                    guildId: guildId,
                    currentLevel: 0,
                    currentXp: 0
                })
            }

            const xpToAdd = Math.floor(Math.random() * 10) + 5;

            level.currentXp += xpToAdd

            const needed = getNeededXP(level.currentLevel)

            if (level.currentXp >= needed) {
                level.currentLevel += 1
                level.currentXp -= needed
                await level.save()
                const levelUp = new EmbedBuilder()
                    .setDescription(`🎉 <@${userId}> leveled up to **Level ${level.currentLevel}**!`)
                    .setColor("Random")
                await message.reply({ embeds: [levelUp]})
            } else {
                await level.save()
            }
        }
    }
}