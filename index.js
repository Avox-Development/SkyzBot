const discordBot = require('./bot');
const express = require('express');

const app = express();

app.use(express.json());

async function startServices() {
    const server = app.listen(3000, () => {
        console.log('✅ Server running on port 3000');
    });

    await discordBot.startDiscordBot();
}

startServices();