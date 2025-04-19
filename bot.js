const { Client, GatewayIntentBits, Collection } = require('discord.js');
const path = require('path');
const fs = require('fs');
const { setDiscordClient } = require('./embedManager.js');

const DISCORD_TOKEN = process.env.TOKEN; // HEMLIG
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
            if (interaction.isAutocomplete()) {
              const command = discordClient.commands.get(interaction.commandName);
              if (!command || !command.autocomplete) return;
              try {
                await command.autocomplete(interaction);
              } catch (err) {
                console.error(err);
              }
            }
          
            if (interaction.isChatInputCommand()) {
              const command = discordClient.commands.get(interaction.commandName);
              if (!command || !command.execute) return;
              try {
                await command.execute(interaction);
              } catch (err) {
                console.error(err);
              }
            }
        });

        discordClient.login(DISCORD_TOKEN)
            .then(() => console.log('✅ Discord login successful'))
            .catch(reject);
    });
}

module.exports = { startDiscordBot };