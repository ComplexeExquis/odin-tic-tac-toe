const createGameboard = () => {
    const gameboard = ["0", "1", "2",
                       "3", "4", "5",
                       "6", "7", "8"];

    const markGameboard = (player, position) => {
        const marker = player.marker;
        gameboard[position] = marker;
    } 

    const getGameboardCopy = () => {
        return [...gameboard];
    }

    return {markGameboard, getGameboardCopy};
};

const createPlayer = (order, type, name) => {
    // "human" or "bot"
    const playerType = type;

    const playerName = name;
    
    const marker = (order === "p1") ? "X" : "O";
    
    return {playerType, playerName, marker};
};


const createDisplayManager = () => {
    // html dom stuff
    // functionality to refresh and display change
    const startScreen = document.getElementById("start-screen-container");
    const picknameScreen = document.getElementById("pickname-screen-container");
    const playingScreen = document.getElementById("playing-screen-container");
    const endScreen = document.getElementById("end-screen-container"); 
    
    // initiate all event listeners and attaching it 
    (function initiateStartScreen() {
        // pvp button
        startScreen.children[0].addEventListener("click", () => {
            changeScreen("pickname");
        });
        // pve button
        startScreen.children[1].addEventListener("click", () => {
            changeScreen("pickname-pve");
        });
    })();
    (function initiatePicknameScreen() {
        picknameScreen.children[2].addEventListener("click", () => {
            // get player(s) name from form
            // initiate players object
            // change screen state
            changeScreen("playing", Game.getCurrentPlayer());

        });
    })();
    (function initiatePlayingScreen() {
        playingScreen.children[0].addEventListener("click", () => {
            changeScreen("end");
        });

        playingScreen.children[1].addEventListener("click", () => {
            // do reset on grid, player turn
            // reset()
            changeScreen("playing", Game.getCurrentPlayer());
        });
    })();
    (function initiateEndScreen() {
        const target = endScreen.children[0];
        target.children[1].addEventListener("click", () => {
            // do reset on grid, player turn
            // reset()
            changeScreen("playing", Game.getCurrentPlayer());
        });

        target.children[2].addEventListener("click", () => {
            changeScreen("start");
        });
    })();

    const disableAllScreen = () => {
        startScreen.style.display = "none";     
        picknameScreen.style.display = "none";  
        playingScreen.style.display = "none";  
        endScreen.style.display = "none";  
    };
       
    const changeScreenTitle = (screenState, currentPlayer) => {
        const screenTitle = document.getElementById("screen-title");

        switch (screenState) {
            case "pickname-pve":
            case "pickname":
                screenTitle.textContent = "Enter name";
                break;
            case "playing":
                screenTitle.textContent = `${currentPlayer.playerName} turn`;
                break;
            case "end":
                screenTitle.textContent = `Game ends`;
                break;
            default:
                screenTitle.textContent = "Pick mode";
                break;
        }
    };

    const changeScreenPve = () => {
        picknameScreen.children[1].style.display = "none";
    };

    const refreshPicknameSreen = () => {
        picknameScreen.children[1].style.display = "inline-block";
    };

    const changeScreen = (screenState, currentPlayer = "") => {
        disableAllScreen();

        switch (screenState) {
            case "pickname-pve":
                changeScreenPve();
            case "pickname":
                picknameScreen.style.display = "flex";
                break;
            case "playing":
                playingScreen.style.display = "flex";  
                break;
            case "end":
                endScreen.style.display = "flex";
                break;
            default:
                refreshPicknameSreen();
                startScreen.style.display = "flex";
                break;
        }
        changeScreenTitle(screenState, currentPlayer);
    };

    

    return {changeScreen};
};

const Game = (() => {
    const gameboard = createGameboard();
    const displayManager = createDisplayManager();
    const playerOne = createPlayer("p1", "human", "john");
    const playerTwo = createPlayer("p2", "human", "mark");

    let currentTurn = "p1";
    let win = false;

    const getCurrentPlayer = () => (currentTurn === "p1") ? playerOne : playerTwo;
    
    const switchTurn = () => currentTurn = (currentTurn === "p1") ? "p2" : "p1";

    const evaluateRound = () => {
        // if win skip this function
        if (win) 
            return;
        
        // manually checks every winning condition
        // cause it's only 3x3 board
        const winningConditions = [[0, 1, 2],
                                  [3, 4, 5],
                                  [6, 7, 8],
                                  [0, 3, 6],
                                  [1, 4, 7],
                                  [2, 5, 8],
                                  [0, 4, 8],
                                  [2, 4, 6]];
        // cancer
        
        
        for (let i = 0; i < winningConditions.length; i++) {
            if (win) 
                break;
            
            const winningCondition = winningConditions[i];

            for (let j = 0; j < winningCondition.length; j++) {
                
                if (gameboard.getGameboardCopy()[winningCondition[j]] !== getCurrentPlayer().marker) 
                    break;
                else
                    if (j === 2) 
                        win = true;
            }
        }
        if (win) {
            console.log(`${getCurrentPlayer().playerName} wins`);   
        }
    };

    return {gameboard, displayManager, getCurrentPlayer};
})();