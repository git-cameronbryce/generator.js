const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
process.on("unhandledRejection", (err) => console.error(err));

module.exports = {
  data: new SlashCommandBuilder()
    .setName('generate-number')
    .setDescription('Generate a random # between zero and the given value.')
    .addNumberOption(option => option.setName('number').setDescription('Generate a random # between zero and the given value.').setRequired(true)),

  async execute(interaction) {
    const input = {
      number: interaction.options.getNumber('number'),
      guild: interaction.guild.id,
    };

    let { number } = input;

    const result = Math.floor(Math.random() * number + 1)
    await interaction.reply({ content: `Random value betwen \`0\` and \`${number}\`\n \`\`\`Random value: #${result}\`\`\`` })
  }
};