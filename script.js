// Import the functions you need from the SDKs you need
//import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
//import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";
//import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-analytics.js";
//import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyARM8FznTE6ImacxWuJL5mn09szgnlSwcQ",
    authDomain: "test-a1849.firebaseapp.com",
    projectId: "test-a1849",
    storageBucket: "test-a1849.appspot.com",
    messagingSenderId: "799317876825",
    appId: "1:799317876825:web:e2d68fe775b772918b1148",
    measurementId: "G-DKX4DBGTZE"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

const player = document.getElementById('player');
const gameContainer = document.getElementById('gameContainer');
const scoreDisplay = document.getElementById('score');
const highScoreDisplay = document.getElementById('highScore');
const loginContainer = document.getElementById('loginContainer');
const googleLoginButton = document.getElementById('google-login');

let playerLeft = 175;
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
let isGameOver = false;

function movePlayer(event) {
    if (!isGameOver) {
        if (event.key === 'ArrowLeft' && playerLeft > 0) {
            playerLeft -= 25;
        } else if (event.key === 'ArrowRight' && playerLeft < 350) {
            playerLeft += 25;
        }

        player.style.left = playerLeft + 'px';
    }
}

document.addEventListener('keydown', movePlayer);

function spawnEnemy() {
    if (!isGameOver) {
        const enemy = document.createElement('div');
        enemy.classList.add('enemy');
        enemy.style.left = Math.random() * 350 + 'px';
        gameContainer.appendChild(enemy);

        let enemyBottom = 400;
        let enemyLeft = parseFloat(enemy.style.left);

        function moveEnemy() {
            if (enemyBottom > 0 && enemyBottom < 550) {
                enemyBottom -= 1;
                enemy.style.bottom = enemyBottom + 'px';
            } else {
                clearInterval(enemyTimerId);
                gameContainer.removeChild(enemy);
                if (!isGameOver) {
                    score++;
                    scoreDisplay.textContent = 'Score: ' + score;
                }
            }

            if (
                (enemyBottom > 0 && enemyBottom < 50) &&
                (playerLeft >= enemyLeft && playerLeft <= enemyLeft + 50)
            ) {
                gameOver();
            }
        }

        let enemyTimerId = setInterval(moveEnemy, 20);
    }
}

let gameTimerId;

function startGame() {
    gameTimerId = setInterval(spawnEnemy, 1000);
}

function gameOver() {
    isGameOver = true;
    clearInterval(gameTimerId);

    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
        highScoreDisplay.textContent = 'High Score: ' + highScore;
    }

    alert('Game Over! Your Score: ' + score);

    player.style.left = '175px';
    score = 0;
    scoreDisplay.textContent = 'Score: ' + score;
    isGameOver = false;
    gameTimerId = setInterval(spawnEnemy, 1000);
}

// Login function
function googleLogin() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
        .then((result) => {
            // The signed-in user info.
            const user = result.user;
            console.log('User logged in:', user);
            alert('Logged in successfully');
            loginContainer.style.display = 'none';
            gameContainer.style.display = 'block';
            scoreDisplay.style.display = 'block';
            highScoreDisplay.style.display = 'block';
            startGame();
        }).catch((error) => {
            console.error('Error during login:', error);
        });
}

// Event listener for login button
googleLoginButton.addEventListener('click', googleLogin);

// Check if user is already logged in
onAuthStateChanged(auth, (user) => {
    if (user) {
        loginContainer.style.display = 'none';
        gameContainer.style.display = 'block';
        scoreDisplay.style.display = 'block';
        highScoreDisplay.style.display = 'block';
        startGame();
    }
});



