const { Events } = require("discord.js");

module.exports = {
    name: Events.MessageCreate,
    async execute(interaction, client) {
        await spawnChest(interaction, client);
    }
}
async function spawnChest(interaction, client) {
    // If the message is by the bot, disregard it
    if (interaction.author.bot) return;

    // Users have a 30s cooldown for their messages to spawn chests.
    const userCooldown = 30000; // 30 seconds
    const lastMessage = await client.db.get(`spawnChestM_${interaction.author.id}`);
    const timeRemaining = userCooldown - (Date.now() - lastMessage);
    if (timeRemaining > 0) {
        return;
    }

    // Channels have a 15 minute cooldown to spawn chests.
    const channelCooldown = 900000; // 15 minutes
    const lastSpawn = await client.db.get(`spawnChestC_${interaction.author.id}`);
    const spawnTimeRemaining = channelCooldown - (Date.now() - lastSpawn);
    if (spawnTimeRemaining > 0) {
        return;
    }

    // 1% Chance for chests to drop. If a chest drops, rates are 75%, 15%, 6%, 2.5%, 1%, 0.5%
    const chestRates = new Map([
        [99000, "Bronze"],
        [99750, "Silver"],
        [99900, "Gold"],
        [99960, "Platinum"],
        [99985, "Diamond"],
        [99995, "Legendary"],
        [99999, "Mythic"]]);

    // Generate a random number from 0 - 99,999
    let num = Math.floor(Math.random() * 100000);

    let chest;
    if (num >= 99999) chest = "Mythic";
    else if (num >= 99995) chest = "Legendary";
    else if (num >= 99985) chest = "Diamond";
    else if (num >= 99960) chest = "Platinum";
    else if (num >= 99900) chest = "Gold";
    else if (num >= 99750) chest = "Silver";
    else if (num >= 99000) chest = "Bronze";

    await interaction.channel.send(`Num is ${num}, chest is ${chest}`);
    await client.db.set(`spawnChestM_${interaction.author.id}`, Date.now());
    await client.db.set(`spawnChestC_${interaction.channel.id}`, Date.now());
}