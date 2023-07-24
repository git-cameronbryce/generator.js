const { Client, Events, Collection, GatewayIntentBits, ActivityType } = require('discord.js');
const { token } = require('./other-config/config.json');
const path = require('path');
const fs = require('fs');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

const commandsPathPlayerManagement = path.join(__dirname, './command-handler');
const commandFiles = fs.readdirSync(commandsPathPlayerManagement).filter(file => file.endsWith('.js'));

commandFiles.forEach(file => {
  const filePath = path.join(commandsPathPlayerManagement, file);
  const command = require(filePath);

  if ('data' in command && 'execute' in command) client.commands.set(command.data.name, command);
  else console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) return console.error(`No command matching ${interaction.commandName} was found.`);

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
});

client.on('ready', (event) => {
  console.log(`${event.user.tag} is online.`);
  client.user.setActivity('/ commands', { type: ActivityType.Listening });
});

client.login(token);