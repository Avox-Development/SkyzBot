const discordBot = require('./bot');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.send("Yes, vi fungerar, dummer!");
});

async function startServices() {
    app.listen(3000, () => {
        console.log('✅ Server running on port 3000');
    });

    await discordBot.startDiscordBot();
}

startServices();