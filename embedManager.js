const { EmbedBuilder} = require('discord.js');
const materials = require('./materials.json');

let discordClient = null;

function setDiscordClient(client) {
    discordClient = client;
}

async function sendRefillEmbed(material, by, date, added) {
    try {
        const channel = await discordClient.channels.fetch("1272288607377428511");

        const thumbnailUrl = materials[material] || null;
        const embed = {
            title: added > 0 ? "Ny Påfyllning!" : "Ny Stöld!",
            description: `**Material:** ${material}\n**Mängd:** ${added}`,
            footer: {
                text: `${by} - ${date}`,
                icon_url: `https://mc-heads.net/avatar/${by}.png`
            },
            color: added > 0 ? 0x34eb9b : 0xff3344,
            ...(thumbnailUrl && { thumbnail: { url: thumbnailUrl } })
        };

        await channel.send({ embeds: [embed] });
    } catch (error) {
        console.error('Error sending embed:', error);
    }
}

module.exports = { sendRefillEmbed, setDiscordClient };