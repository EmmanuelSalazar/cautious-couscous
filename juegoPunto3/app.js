const prompt = require('prompt');

// Configuración de prompt
prompt.start();

// Función para obtener un número del jugador 1
function getPlayerOneNumber() {
  return new Promise((resolve, reject) => {
    prompt.get({
      properties: {
        number: {
          description: "Jugador 1, ingresa un número del 1 al 10:",
          type: 'number',
          required: true,
          message: 'El número debe estar entre 1 y 10',
          conform: function(value) {
            return value >= 1 && value <= 10;
          }
        }
      }
    }, function(err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result.number);
      }
    });
  });
}

// Función para obtener una adivinanza del jugador 2
function getPlayerTwoGuess(attempt) {
  return new Promise((resolve, reject) => {
    prompt.get({
      properties: {
        guess: {
          description: `Jugador 2, intento ${attempt}/3. Adivina el número (1-10):`,
          type: 'number',
          required: true,
          message: 'Debes ingresar un número entre 1 y 10',
          conform: function(value) {
            return value >= 1 && value <= 10;
          }
        }
      }
    }, function(err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result.guess);
      }
    });
  });
}

// Función principal del juego
async function playGuessingGame() {
  console.log("Bienvenido al juego de adivinanza!");

  try {
    const playerOneNumber = await getPlayerOneNumber();
    console.clear(); // Limpia la consola para que el jugador 2 no vea el número

    console.log("El jugador 1 ha ingresado su número. Jugador 2, es tu turno de adivinar.");

    for (let attempt = 1; attempt <= 3; attempt++) {
      const playerTwoGuess = await getPlayerTwoGuess(attempt);

      if (playerTwoGuess === playerOneNumber) {
        console.log("¡Felicidades! El jugador 2 ha adivinado el número correctamente.");
        return;
      } else {
        if (attempt < 3) {
          console.log("Incorrecto. Intenta de nuevo.");
        } else {
          console.log(`Lo siento, has agotado tus 3 intentos. El número era ${playerOneNumber}.`);
        }
      }
    }
  } catch (error) {
    console.error("Ocurrió un error:", error);
  }
}

// Iniciar el juego
playGuessingGame().then(() => {
  console.log("El juego ha terminado.");
});