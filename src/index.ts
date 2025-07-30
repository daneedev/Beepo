import dotenv from 'dotenv';
import { Client, GatewayIntentBits, Events, MessageFlags, Collection } from 'discord.js';
import logger from "./handlers/logger";
import fs from 'fs';
import path from 'path';
import deployCommands from './command-deploy';

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages
  ]
});

client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands')
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder)
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'))
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file)
        const command = require(filePath).default;
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
            logger.info(`Loaded command: ${command.data.name}`);
        } else {
            logger.error(`The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

const eventsPath = path.join(__dirname, "events")
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith(".ts"))

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file)
  const event = require(filePath).default;
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args))
  } else {
    client.on(event.name, (...args) => event.execute(...args))
  }
}


deployCommands()

client.login(process.env.TOKEN);
