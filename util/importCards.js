/*
Prerequisites:
1. Use mongoimport to import "cards" to "newCards" database collection
2. Artworks are in a local folder
 */

const NewCard = require("../src/schemas/newCardSchema");
const ApprovedCard = require("../src/schemas/approvedCardSchema");
const {createCard} = require("./createCards");

async function importNewCards(inputFolder) {
    // Create each card and remove it from newCards
    const newCardList = await NewCard.find();
    let count = 0;
    for (let i = 0; i < newCardList.length; i++) {
        await createCard(newCardList[i], `${inputFolder}/${newCardList[i].id}`, "../assets")
        await NewCard.remove({ id: newCardsList[i].id });
        count += 1;
    }

    console.log(`Successfully imported ${count} / ${newCardList.length} cards.`)
}

async function importApprovedCards() {
    // Create each card and remove it from newCards
    const approvedCardsList = await ApprovedCard.find();
    let count = 0;
    for (let i = 0; i < approvedCardsList.length; i++) {
        await createCard(approvedCardsList[i], approvedCardsList.artURL, "../assets")
        await ApprovedCard.remove({ id: approvedCardsList[i].id });
    }

    console.log(`Successfully imported ${count} / ${approvedCardList.length} cards.`)
}

// If importing the cards was successful, add assets/cards to GitHub, commit, and then push
await importNewCards("./newCards");
await importApprovedCards()
