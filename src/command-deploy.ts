import { REST, Routes } from "discord.js";
import path from "path";
import fs from "fs";
import logger from "./handlers/logger";

async function deployCommands() {
  const rest = new REST().setToken(process.env.TOKEN || "");

  const commands = [];
  // Grab all the command folders from the commands directory you created earlier
  const foldersPath = path.join(__dirname, "commands");
  const commandFolders = fs.readdirSync(foldersPath);

  for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith(".ts"));
    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const command = require(filePath).default;
      if ("data" in command && "execute" in command) {
        commands.push(command.data.toJSON());
      }
    }
  }

  // and deploy your commands!
  try {
    logger.info(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    // The put method is used to fully refresh all commands in the guild with the current set
    let data: any;
    if (process.env.GUILD_ID) {
      data = await rest.put(
        Routes.applicationGuildCommands(
          process.env.CLIENT_ID || "",
          process.env.GUILD_ID || ""
        ),
        { body: commands }
      );
    } else {
      data = await rest.put(
        Routes.applicationCommands(process.env.CLIENT_ID || ""),
        { body: commands }
      );
    }

    logger.success(
      `Successfully reloaded ${data.length} application (/) commands.`
    );
  } catch (error: string | any) {
    // And of course, make sure you catch and log any errors!
    logger.error(error);
  }
}

export default deployCommands;
