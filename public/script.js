document.addEventListener("DOMContentLoaded", () => {
  let deckID = null;

  const createDeckBtn = document.getElementById("createDeck");
  const shuffleDeckBtn = document.getElementById("shuffleDeck");
  const drawCardBtn = document.getElementById("drawCard");
  const cardDisplay = document.getElementById("cardDisplay");
  const cardsRemaining = document.getElementById("cardsRemaining");

  const API_BASE = "/temp/deck";

  //Event Listener for Create Button
  createDeckBtn.addEventListener("click", async () => {
    const response = await fetch(API_BASE, {
      method: "POST",
    });
    const data = await response.json();
    deckID = data.deck_id;

    shuffleDeckBtn.disabled = false;
    drawCardBtn.disabled = false;

    cardDisplay.textContent = `Deck ID: ${deckID}`;

    updateCardsRemaining();
  });

  //Event Listener for Shuffle Button
  shuffleDeckBtn.addEventListener("click", async () => {
    await fetch(`${API_BASE}/shuffle/${deckID}`, {
      method: "PATCH",
    });

    cardDisplay.textContent = "Deck shuffled!";
    updateCardsRemaining();
  });

  //Event Listener for Draw Button
  drawCardBtn.addEventListener("click", async () => {
    const response = await fetch(`${API_BASE}/${deckID}/card`);
    const data = await response.json();
    const card = data.card;

    cardDisplay.classList.remove("red-card", "black-card");

    if (card.suit === "Hearts" || card.suit === "Diamonds") {
      cardDisplay.classList.add("red-card");
    } else {
      cardDisplay.classList.add("black-card");
    }

    cardDisplay.textContent = `${card.value} of ${card.suit}`;
    updateCardsRemaining();
  });

  //Function for updating cards left in deck
  async function updateCardsRemaining() {
    try {
      const response = await fetch(`${API_BASE}/${deckID}`);
      const data = await response.json();

      const remaining = data.deck.length;

      cardsRemaining.textContent = `Cards remaining: ${remaining}`;
    } catch (error) {
      console.error("Error fetching deck:", error);
      cardsRemaining.textContent =
        "Error: Unable to retrieve the number of remaining cards.";
    }
  }
});
