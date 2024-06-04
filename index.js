const { Client, GatewayIntentBits, ActivityType, TextChannel } = require('discord.js');
require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const axios = require('axios');  // Add this for making API calls
const client = new Client({
  intents: Object.keys(GatewayIntentBits).map((a) => {
    return GatewayIntentBits[a];
  }),
});
const app = express();
const port = 3000;
app.get('/', (req, res) => {
  res.send('Bot Status Changed Successfully');
});
app.listen(port, () => {
  console.log(`🔗 Listening to: http://localhost:${port}`);
});

const statusMessages = [];

let currentIndex = 0;
const channelId = '';

async function login() {
  try {
    await client.login(process.env.TOKEN);
    console.log(`\x1b[36m%s\x1b[0m`, `|    🐇 Logged in as ${client.user.tag}`);
  } catch (error) {
    console.error('Failed to log in:', error);
    process.exit(1);
  }
}

async function updateStatusAndSendMessages() {
  try {
    // Fetch current song playing from the API
    const response = await axios.get('https://109.106.1.168/api/nowplaying/vibez');
    const { song, artist } = response.data;

    // Update the status message
    const currentStatus = `HopFM Play ${song} By ${artist}`;
    statusMessages[currentIndex] = currentStatus;

    client.user.setPresence({
      activities: [{ name: currentStatus, type: ActivityType.LISTENING }],
      status: 'dnd',
    });

    const textChannel = client.channels.cache.get(channelId);

    if (textChannel instanceof TextChannel) {
      textChannel.send(`Bot status is: ${currentStatus}`);
    } else {
      console.log(`Channel not found or is not a text channel`);
    }

    currentIndex = (currentIndex + 1) % statusMessages.length;
  } catch (error) {
    console.error('Error updating status:', error);
  }
}

client.once('ready', () => {
  console.log(`\x1b[36m%s\x1b[0m`, `|    ✅ Bot is ready as ${client.user.tag}`);
  updateStatusAndSendMessages();

  setInterval(() => {
    updateStatusAndSendMessages();
  }, 10000);
});

login();
