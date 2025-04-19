const { Client, GatewayIntentBits, Collection } = require('discord.js');
const path = require('path');
const fs = require('fs');
const { setDiscordClient } = require('./embedManager');

const DISCORD_TOKEN = 'MTM2MzI2ODk2MzcyNjkxNzc1Mw.GUMtks.45IN4hYPLdehirjfDG_hTfV9SAdqhoQt7TgEJ8';
const GUILD_ID = '1272276623848112168';


const discordClient = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });
setDiscordClient(discordClient);

discordClient.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  discordClient.commands.set(command.data.name, command);
}

async function startDiscordBot() {
    return new Promise((resolve, reject) => {
        discordClient.once('ready', async () => {
            console.log(`✅ Logged in as ${discordClient.user.tag}!`);

            const guild = await discordClient.guilds.fetch(GUILD_ID);
            
            await guild.commands.set(
              discordClient.commands.map(command => command.data)
            );
          
            console.log('✅ Slash commands registered for the specific guild!');
            resolve();
        });

        discordClient.on('interactionCreate', async interaction => {
            if (!interaction.isCommand()) return;

            const command = discordClient.commands.get(interaction.commandName);

            if (command) {
                try {
                    await command.execute(interaction);
                } catch (error) {
                    console.error(error);
                    await interaction.reply({ content: 'Ett fel uppstod vid körning av kommandot.', ephemeral: true });
                }
            }
        });

        discordClient.login(DISCORD_TOKEN)
            .then(() => console.log('✅ Discord login successful'))
            .catch(reject);
    });
}

module.exports = { startDiscordBot };