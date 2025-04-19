const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { sendRefillEmbed } = require('../embedManager.js');
const materials = require('../materials.json');
const materialNames = Object.keys(materials);

module.exports = {
  data: new SlashCommandBuilder()
    .setName('refill')
    .setDescription('Registrera en påfyllning av material')
    .addStringOption(option =>
      option.setName('material')
        .setDescription('Material att fylla på')
        .setRequired(true)
        .setAutocomplete(true)
    )
    .addStringOption(option =>
        option.setName('date')
          .setDescription('Datum för påfyllning (ex: 2025-04-19)')
          .setRequired(true)
      )
    .addStringOption(option =>
      option.setName('name')
        .setDescription('Vem som fyllde på materialet')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('added')
        .setDescription('Hur mycket som har lagts till')
        .setRequired(true)
    ),

    async autocomplete(interaction) {
        const focusedValue = interaction.options.getFocused();
        const filtered = materialNames.filter(name =>
          name.toLowerCase().includes(focusedValue.toLowerCase())
        );
      
        await interaction.respond(
          filtered.map(name => ({ name, value: name }))
        );
    },

    async execute(interaction) {
    try {
      if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
        return interaction.reply({ content: 'Du har inte behörighet att använda detta kommando.', ephemeral: true });
      }

      const material = interaction.options.getString('material');
      const name = interaction.options.getString('name');
      const date = interaction.options.getString('date');
      const added = interaction.options.getString('added');

      await sendRefillEmbed(material, name, date, added);
      await interaction.reply({ content: 'Påfyllning registrerad.', ephemeral: true });
    } catch (error) {
      console.error('Error:', error);
      await interaction.reply({ content: 'Ett fel uppstod vid registrering av påfyllningen.', ephemeral: true });
    }
  }
};