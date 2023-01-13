const { Events, ComponentType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField} = require("discord.js");
const Chest = require("../../schemas/chestSchema");
const Profile = require("../../schemas/profileSchema");

module.exports = {
    name: Events.MessageCreate,
    async execute(interaction, client) {
        await spawnChest(interaction, client);
    }
}
async function spawnChest(interaction, client) {
    // If the message is by a bot or if the bot does not have permission to send message here in the channel, disregard it
    if (interaction.author.bot) return;
    if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageMessages)) return;

    // Users have a 30s cooldown for their messages to spawn chests.
    const userCooldown = 30000; // 30 seconds
    const lastMessage = await client.db.get(`spawnChestM_${interaction.author.id}`);
    const timeRemaining = userCooldown - (Date.now() - lastMessage);
    if (timeRemaining > 0) {
        console.log(timeRemaining);
        return;
    }

    // Channels have a 15 minute cooldown to spawn chests.
    const channelCooldown = 900000; // 15 minutes
    const lastSpawn = await client.db.get(`spawnChestC_${interaction.channel.id}`);
    const spawnTimeRemaining = channelCooldown - (Date.now() - lastSpawn);
    if (spawnTimeRemaining > 0) {
        console.log(spawnTimeRemaining);
        return;
    }

    // Generate a random number from 0 - 99,999. Just return is no chest is spawned
    let num = Math.floor(Math.random() * 100000);
    if (num < 99000) return;

    // Find out which chest to spawn
    // 1% Chance for chests to drop. If a chest drops, rates are 75%, 15%, 6%, 2.5%, 1%, 0.5%
    let chestID;
    if (num >= 99999) chestID = "Mythic";
    else if (num >= 99995) chestID = "Legendary";
    else if (num >= 99985) chestID = "Diamond";
    else if (num >= 99960) chestID = "Platinum";
    else if (num >= 99900) chestID = "Gold";
    else if (num >= 99750) chestID = "Silver";
    else if (num >= 99000) chestID = "Bronze";

    // Get the chest's info
    const chest = await Chest.findOne({ name: chestID });

    // Update the chest spawn cooldown
    await client.db.set(`spawnChestM_${interaction.author.id}`, Date.now());    // User's message cooldown
    await client.db.set(`spawnChestC_${interaction.channel.id}`, Date.now());   // Channel spawn cooldown

    // Create button for opening the chest
    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('claimChest')
            .setEmoji('🔓')
            .setStyle(ButtonStyle.Primary),
        );

    // Send message to spawn the chest
    const embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setDescription(`A **${chestID} Chest** has been discovered!`)
        .setThumbnail("https://raw.githubusercontent.com/phanturne/Pentaguards/main/assets/chests/chest.png");
    const message = await interaction.channel.send({
        embeds: [embed],
        components: [row],
    });

    // Create a reaction collector with a 5-minute time limit
    const collector = message.createMessageComponentCollector({
        componentType: ComponentType.Button,
        max: chest.maxClaims,
        time: 300000});

    // Create a list of players that have already claimed the chest
    let alreadyClaimed = new Set();
    collector.on('collect', interaction => {
        if (alreadyClaimed.has(interaction.user.id)) {
            let embed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setDescription(`You have already claimed rewards from this chest!`)

            return interaction.reply({
                ephemeral: true,
                embeds: [embed],
            });
        }
        giveReward(chest, interaction);
        alreadyClaimed.add(interaction.user.id);
    });
}

async function giveReward(chest,interaction) {
    // Get the player's profile
    const player = await Profile.findOne( { id: interaction.user.id });
    if (!player) return interaction.reply({
        ephemeral: true,
        content: "Please set up an account by typing `/tcg`.",
    });

    // Generate random amounts of silver, gold, shards, and diamonds
    const silverAmount = Math.floor(Math.random() * (chest.maxSilver - chest.minSilver)) + chest.minSilver;
    const goldAmount = Math.floor(Math.random() * (chest.maxGold - chest.minGold)) + chest.minGold;
    const shardsAmount = Math.floor(Math.random() * (chest.maxShards - chest.minShards)) + chest.minShards;
    const diamondsAmount = Math.floor(Math.random() * (chest.maxDiamonds - chest.minDiamonds)) + chest.minDiamonds;

    // Add the currencies to the player's profile
    await Profile.updateOne(
        {id: interaction.user.id},
        {
            silver: player.silver + silverAmount,
            gold: player.gold + goldAmount,
            shards: player.shards + shardsAmount,
            diamonds: player.diamonds + diamondsAmount,
        }
    );

    // Create message for the rewards claimed
    const currencyMap = new Map([["shards", shardsAmount], ["silver", silverAmount], ["gold", goldAmount], ["diamonds", diamondsAmount]])
    let currencyMsg = "";
    for (const currency of currencyMap.keys()) {
        const amount = currencyMap.get(currency);
        if (amount > 0) {
            currencyMsg += (currency === "diamonds") ? `and ${amount} ${currency}` : `${amount} ${currency}, `;
        }
    }

    let embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setDescription(`You have claimed: \`${currencyMsg}\`!`)

    interaction.reply({
        ephemeral: true,
        embeds: [embed],
    });
}