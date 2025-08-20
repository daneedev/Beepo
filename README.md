# Beepo Discord Bot

A powerful Discord moderation and utility bot built with TypeScript and Discord.js v14.

## Features

### 🛡️ Moderation Commands

- **`/ban`** - Permanently ban users with message deletion options
- **`/tempban`** - Temporarily ban users with automatic unbanning
- **`/clear`** - Bulk delete messages (up to 100, respects 14-day limit)
- **`/lock`** - Lock channels to prevent members from sending messages

### 🎉 Giveaway System

- **`/giveaway start`** - Create giveaways with customizable duration and winners
- **`/giveaway end`** - Manually end running giveaways
- **`/giveaway reroll`** - Reroll winners for completed giveaways

### ℹ️ Utility Commands

- **`/info`** - Display bot information and useful links

### ⚙️ Configuration

- Modular system with enable/disable functionality
- Database-driven configuration per server
- Automatic tempban scheduler with persistent storage

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/daneedev/Beepo.git
   cd Beepo
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:

   ```env
   DISCORD_TOKEN=your_bot_token_here
   DATABASE_URL=your_database_connection_string
   ```

4. **Build and run**
   ```bash
   npm run build
   npm start
   ```

## Tech Stack

- **Language**: TypeScript
- **Framework**: Discord.js v14
- **Database**: Sequelize ORM (supports PostgreSQL, MySQL, SQLite)
- **Utilities**:
  - `ms` - Duration parsing
  - `node-cron` - Task scheduling
  - Custom logger system

## Bot Permissions

The bot requires the following permissions:

- `Ban Members` - For ban/tempban commands
- `Manage Messages` - For clear command
- `Manage Channels` - For lock command
- `Send Messages` - For responses
- `Embed Links` - For rich embeds
- `Read Message History` - For message operations

## Project Structure

```
src/
├── commands/
│   ├── moderation/     # Moderation commands
│   ├── giveaway/       # Giveaway system
│   └── utility/        # Utility commands
├── events/             # Discord.js event handlers
├── handlers/           # Custom handlers (logger, etc.)
├── models/             # Database models
├── schedulers/         # Background tasks
└── db.ts              # Database connection
```

## Database Models

- **Config** - Server configuration settings
- **TempBan** - Temporary ban tracking with expiration
- **Giveaways** - Active giveaway management (JSON file)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Invite Bot

[Invite Beepo to your server](https://discord.com/api/oauth2/authorize?client_id=1396203993281073213&permissions=8&scope=bot%20applications.commands)

**Note**: This bot is currently in beta. Report any issues on our GitHub repository or Discord server.
