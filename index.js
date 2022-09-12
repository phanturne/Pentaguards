// Require the necessary modules
const { Client, GatewayIntentBits, Partials } = require('discord.js');
const fetch = require("node-fetch");
const Database = require("@replit/database");
const fs = require("fs");

const db = new Database();

// Converts a file to an array
const fileToArray = filename =>   
  fs.readFileSync(filename).toString('UTF8').split('\n');

const sadWords = fileToArray("sadWords.txt");
const starterEncouragements = fileToArray("encouragements.txt");

// Initialize the list of encouragements
db.get("encouragements").then(encouragements => {
  if (!encouragements || encouragements.length < 1) {
    db.set("encouragements", starterEncouragements);
  }
})

db.get("responding").then(value => {
  if (value == null) {
    db.set("responding", true);
  }
})

// Adds a custom encouragement
function updateEncouragements(encouragingMessage) {
  db.get("encouragements").then(encouragements => {
    encouragements.push(encouragingMessage);
    db.set("encouragements", encouragements);
  })
}

// Delete a custom encouragement
function deleteEncouragement(index) {
  db.get("encouragements").then(encouragements => {
    if (encouragements.length > index) {
      encouragements.splice(index, 1);
      db.set("encouragements", encouragements);
    }
  })
}

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
  console.log(`Logged in as ${client.user.tag}!`);
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
  db.get("responding").then(responding => {
    if (responding && sadWords.some(word => msg.content.toLowerCase().includes(word))) {
      db.get("encouragements").then(encouragements => {
        const encouragement = encouragements[Math.floor(Math.random() * encouragements.length)];
        msg.reply(encouragement);
      })
    }
  })

  // If the user is bored, ask if they want to play a game or hear a joke
  if (msg.content.toLowerCase().includes("bored")) {
    msg.reply("> Would you like to hear a joke or play a game?");
    // @TODO: implement buttons
  }

  // $new [encouragingMessage]: Adds a custom encouraging message 
  if (msg.content.startsWith("$new")) {
    encouragingMessage = msg.content.split("$new ")[1];
    updateEncouragements(encouragingMessage);
    msg.channel.send("New encouraging message added: " + "\"" + encouragingMessage + "\"");
  }

  // $del [index]: Deletes an encouraging message
  if (msg.content.startsWith("$del")) {
    encouragingMessage = parseInt(msg.content.split("$del ")[1]);
    deleteEncouragement(encouragingMessage);
    msg.channel.send("Encouraging message deleted.");
  }

  if (msg.content.startsWith("$list")) {
    db.get("encouragements").then(encouragements => {
      for (let i = 0; i < encouragements.length; i++) {
        msg.channel.send(encouragements[i]);
      }
    })
  }

  if (msg.content.startsWith("$responding")) {
    value = msg.content.split("$responding ")[1];

    if (value.toLowerCase() == "on") {
      db.set("responding", true);
      msg.channel.send("Responding is on.");
    } else {
      db.set("responding", false);
      msg.channel.send("Responding is off.");
    }
  }
});

// Login to Discord with your client's token
const TOKEN = process.env['TOKEN'];
client.login(TOKEN);
