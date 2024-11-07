let users = [];
let remainingUsers = [];
let drawnCard = "";
const cards = ["A", "K", "Q"];

function loadGameState() {
  // Załaduj dane z localStorage
  const savedUsers = JSON.parse(localStorage.getItem("users"));
  const savedRemainingUsers = JSON.parse(
    localStorage.getItem("remainingUsers")
  );
  const savedCard = localStorage.getItem("drawnCard");

  if (savedUsers && savedRemainingUsers) {
    users = savedUsers;
    remainingUsers = savedRemainingUsers;
    drawnCard = savedCard;

    // Jeśli istnieją gracze, wyświetl grę
    if (users.length >= 2) {
      document.querySelector(".container").style.display = "none";
      document.getElementById("gameArea").style.display = "block";
      displayPlayers();
      document.getElementById("drawnCard").textContent = `Card: ${drawnCard}`;
    }
  }
}

function saveGameState() {
  // Zapisz dane do localStorage
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("remainingUsers", JSON.stringify(remainingUsers));
  localStorage.setItem("drawnCard", drawnCard);
}

function addUser() {
  const userName = document.getElementById("userNameInput").value.trim();
  if (userName) {
    users.push({ name: userName, maxRoll: 6 });
    updateUserList();
    document.getElementById("userNameInput").value = "";
    saveGameState(); // Zapisz stan po dodaniu użytkownika
  }
}

function updateUserList() {
  const userList = document.getElementById("userList");
  userList.innerHTML = "";
  users.forEach((user, index) => {
    const li = document.createElement("li");
    li.className = "user-item";
    li.textContent = user.name;
    li.onclick = () => removeUser(index);
    userList.appendChild(li);
  });
}

function removeUser(index) {
  users.splice(index, 1);
  updateUserList();
  saveGameState(); // Zapisz stan po usunięciu użytkownika
}

function startGame() {
  if (users.length < 4) {
    alert("You need at least 4 players.");
    return;
  }
  remainingUsers = [...users];

  // Ukryj sekcję dodawania graczy
  document.querySelector(".container").style.display = "none";

  // Pokaż sekcję gry
  document.getElementById("gameArea").style.display = "block";

  displayPlayers();
  saveGameState(); // Zapisz stan po rozpoczęciu gry
}

function drawCard() {
  const drawnCardElement = document.getElementById("drawnCard");
  drawnCardElement.textContent = ""; // Wyczyść poprzednią kartę

  // Stwórz animację, gdzie litery A, K, Q pojawiają się szybko
  const letters = ["A", "K", "Q"];
  let counter = 0;
  const interval = setInterval(() => {
    drawnCardElement.textContent = letters[counter];
    counter = (counter + 1) % letters.length;
  }, 100); // Pokazuj literę co 100 ms

  // Po 1 sekundzie, zatrzymaj animację i pokaż wylosowaną kartę
  setTimeout(() => {
    clearInterval(interval);
    drawnCard = cards[Math.floor(Math.random() * cards.length)];
    drawnCardElement.textContent = `Card: ${drawnCard}`;
    saveGameState(); // Zapisz stan po wylosowaniu karty
  }, 1000); // Zatrzymaj po 1 sekundzie
}

function displayPlayers() {
  const playersList = document.getElementById("playersList");
  playersList.innerHTML = "";
  remainingUsers.forEach((user, index) => {
    const li = document.createElement("li");
    li.className = "user-item";
    li.textContent = `${user.name} (Lives left: ${user.maxRoll})`;
    li.onclick = () => playerAction(index);
    playersList.appendChild(li);
  });
}

function playerAction(index) {
  const roll = Math.floor(Math.random() * remainingUsers[index].maxRoll) + 1;
  const hitOrMiss = roll === 1 ? "HIT" : "MISS";

  const gameStatusElement = document.getElementById("gameStatus");

  // Animacja HIT/MISS
  gameStatusElement.textContent = ""; // Wyczyść poprzedni tekst
  const words = ["HIT", "MISS"];
  let counter = 0;
  const interval = setInterval(() => {
    gameStatusElement.textContent = words[counter];
    counter = (counter + 1) % words.length;
  }, 100); // Pokazuj słowo co 100 ms

  // Po 1 sekundzie, zatrzymaj animację i pokaż wynik
  setTimeout(() => {
    clearInterval(interval);
    gameStatusElement.textContent = `${remainingUsers[index].name} - ${hitOrMiss}`;

    if (hitOrMiss === "HIT") {
      remainingUsers.splice(index, 1);
    } else {
      remainingUsers[index].maxRoll = Math.max(
        1,
        remainingUsers[index].maxRoll - 1
      );
    }

    if (remainingUsers.length === 1) {
      document.getElementById(
        "gameStatus"
      ).textContent = `Game over! The winner is: ${remainingUsers[0].name}`;
      showResetButton();
    } else {
      displayPlayers();
    }

    saveGameState(); // Zapisz stan po wykonaniu akcji gracza
  }, 1000); // Zatrzymaj po 1 sekundzie
}

function showResetButton() {
  const resetButton = document.createElement("button");
  resetButton.textContent = "Reset Game";
  resetButton.onclick = resetGame;
  resetButton.className = "reset-button";
  document.getElementById("gameArea").appendChild(resetButton);
}

function resetGame() {
  users = [];
  remainingUsers = [];
  localStorage.removeItem("users");
  localStorage.removeItem("remainingUsers");
  localStorage.removeItem("drawnCard");

  document.querySelector(".container").style.display = "block";
  document.getElementById("gameArea").style.display = "none";
  document.getElementById("userList").innerHTML = "";
  document.getElementById("drawnCard").textContent = "Card: ";
  document.getElementById("gameStatus").textContent = "";

  // Usunięcie przycisku resetu
  const resetButton = document.querySelector(".reset-button");
  if (resetButton) resetButton.remove();
}

// Funkcja powrotu do ekranu dodawania graczy
function returnToPlayerAddition() {
  document.getElementById("gameArea").style.display = "none";
  document.querySelector(".container").style.display = "block";
  resetGame();
}

// Załaduj stan gry przy załadowaniu strony
window.onload = loadGameState;
