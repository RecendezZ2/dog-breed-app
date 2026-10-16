

// value that stores teh api key
let API_KEY = "live_hujz4in5bsB4OG2QIUajctI9ue7EGdVFpFJzCGkfeTZvIT4nQJotFxVSCwC7rn98";
// API breeds endpoint
const API_URL = "https://api.thedogapi.com/v1/breeds";
// Select the form element from the class dogForm
const form = document.querySelector("#dogForm");
// Select the results container 
const resultsContainer = document.querySelector("#results");
form.addEventListener("submit", onFormSubmit);
// Function that runs when the form is submitted
async function onFormSubmit(event) {
  // Stop the page from refreshing
  event.preventDefault();
  // Get the breed input value and remove extra spaces
  const breedName = document.querySelector("#breed").value.trim();
  // Get the temperament dropdown value
  const temperament = document.querySelector("#temperament").value;
  // Get the filtered dogs from the API
  const dogs = await getDogs(breedName, temperament);
  // Show the dogs on the page
  displayDogs(dogs);
}
// Function that fetches the dogs and filters them
async function getDogs(breedName, temperament) {
  try {
    // Fetch the breed list from The Dog API
    const response = await fetch(API_URL, {
      headers: {
        "x-api-key": API_KEY,
      },
    });
    // Convert the response into JavaScript data
    const dogs = await response.json();
    // Return only the dogs that match the filters
    return dogs.filter((dog) => {
      // Check if the breed name matches what the user typed
      const matchesBreed =
        !breedName ||
        dog.name.toLowerCase().includes(breedName.toLowerCase());
      // Check if the temperament matches what the user selected
      const matchesTemperament =
        !temperament ||
        (dog.temperament &&
          dog.temperament.toLowerCase().includes(temperament.toLowerCase()));
      // Keep the dog only if both conditions are true
      return matchesBreed && matchesTemperament;
    });
  } catch (error) {
    // Log any error to the console
    console.error("Error fetching dogs:", error);
    // Return an empty array if something goes wrong
    return [];
  }
}
// Function that displays the dogs on the page
function displayDogs(dogs) {
  // Clear any old results
  resultsContainer.innerHTML = "";
  // Show a message if no dogs were found
  if (dogs.length === 0) {
    resultsContainer.innerHTML = `
      <p>No dogs found. Sorry, maybe consider a different breed.</p>
    `;
    return;
  }
  // Loop through each dog and create a card
  dogs.forEach((dog) => {
    // Create a new article element for the card
    const card = document.createElement("article");
    // Add a class to style the card
    card.className = "dog-card";
    // Use the dog image if it exists, otherwise use a placeholder image
    const imageUrl =
      dog.image?.url || "";
    // Use the life span if available, otherwise show a message
    const lifeSpan = dog.life_span || "Life span unknown";
    // Use the temperament if available, otherwise show a message
    const dogTemperament = dog.temperament || "Temperament unknown";
    // Put the dog data inside the card
    card.innerHTML = `
      <img src="${imageUrl}" alt="${dog.name}" />
      <h3>${dog.name}</h3>
      <p><strong>Life Span:</strong> ${lifeSpan}</p>
      <p><strong>Temperament:</strong> ${dogTemperament}</p>
    `;
    // Add the card to the results area
    resultsContainer.appendChild(card);
  });
}
resultsContainer.addEventListener("click", (event) => {
  const selectedCard = event.target.closest(".dog-card");

  // Ignore clicks outside a card
  if (!selectedCard) return;

  // Remove the highlight from the previously selected card
  resultsContainer.querySelectorAll(".dog-card").forEach((card) => {
    card.classList.remove("selected");
  });

  // Highlight the card that was clicked
  selectedCard.classList.add("selected");
});