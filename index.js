// Require the necessary discord.js classes
const { Client, GatewayIntentBits, Partials } = require('discord.js');

const fetch = require("node-fetch");

const sadWords = [
  "sad", "depressed", "unhappy", "angry", "lonely", "heartbroken", "gloomy", "disappointed",
  "hopeless", "grieved", "lost", "troubled", "miserable"];

const encouragements = [
  "Cheer up!",
  "Hang in there!",
  "You are a great person!"
]

// Fetch a random quote from Zen Quotes
function getQuote() {
  return fetch("https://zenquotes.io/api/random")
    .then(res => {
      return res.json();
  })
  .then(data => {
    return ">>> \"" + data[0]["q"] + "\"\n — " + data[0]["a"];
  })
}

// Fetch a random joke from https://github.com/15Dkatz/official_joke_api
function getJoke() {
  return fetch("https://official-joke-api.wl.r.appspot.com/jokes/random")
    .then(res => {
      return res.json();
  })
  .then(data => {
    return ">>> " + data["setup"] + "\n" + "*" + data["punchline"] + "*";
  })
}

// Create a new client instance
const client = new Client({ 
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    ], 
  partials: [Partials.Channel] 
});

// When the client is ready, run this code
client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`)
});

client.on("messageCreate", msg => {
  // Prevents the bot from responding to its own messages
  if (msg.author.bot) return;

  // $inspire: Sends a random inspirational quote to the channel
  if (msg.content === "$inspire") {
    getQuote().then(quote => msg.channel.send(quote));
  }

  // $joke: Sends a random joke to the channel
  if (msg.content === "$joke") {
    getJoke().then(joke => msg.channel.send(joke));
  }
  
  // Reply to the user with an encouragement if a sad word is detected
  if (sadWords.some(word => msg.content.includes(word))) {
    const encouragement = encouragements[Math.floor(Math.random() * encouragements.length)];
    msg.reply(encouragement);
  }

  // If the user is bored, ask if they want to play a game or hear a joke
  if (msg.content.toLowerCase().includes("bored")) {
    msg.reply("> Would you like to hear a joke or play a game?");
    // @TODO: implement buttons
  }
});

// Login to Discord with your client's token
const TOKEN = process.env['TOKEN'];
client.login(TOKEN);
