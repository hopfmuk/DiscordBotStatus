const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const app = express();
const port = 3000;
app.get('/', (req, res) => {
  res.send('Bot Status Changed Successfully');
});
app.listen(port, () => {
  console.log(`🔗 Listening to: http://localhost:${port}`);
});

const statusMessages = [""];

let currentIndex = 0;

async function login() {
  try {
    await client.login(process.env.TOKEN);
    console.log(`\x1b[36m%s\x1b[0m`, `|    🐇 Logged in as ${client.user.tag}`);
  } catch (error) {
    console.error('Failed to log in:', error);
    process.exit(1);
  }
}

function updateStatusAndSendMessages() {
  const currentStatus = statusMessages[currentIndex];
  if (currentStatus === "LISTENING") {
    client.user.setPresence({
      activities: [{ name: 'Listening', type: ActivityType.Listening}],
      status: 'online',
    });
  } else {
    axios.get('https://109.106.1.168/api/nowplaying/vibez')
    .then(response => {
      const songName = response.data.song_name;
      const songArtist = response.data.song_artist;
      client.user.setPresence({
        activities: [{ name: `HopFM Play ${songName} by ${songArtist}`, type: ActivityType.Playing}],
        status: 'dnd',
      });
    })
    .catch(error => {
      console.error('Error fetching song information:', error);
    });
  }
  
  currentIndex = (currentIndex + 1) % statusMessages.length;
}

client.once('ready', () => {
  console.log(`\x1b[36m%s\x1b[0m`, `|    ✅ Bot is ready as ${client.user.tag}`);
  updateStatusAndSendMessages();

  setInterval(() => {
    updateStatusAndSendMessages();
  }, 10000);
});

login();
