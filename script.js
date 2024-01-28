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
    
    // temporary print
    const showGrid = (gameboard) => {
        for (let index = 0; index < gameboard.length; index += 3) 
            console.log(`${gameboard[index]} `, `${gameboard[index + 1]} `, `${gameboard[index + 2]}`);

        console.log("\n-------------------------\n");
    };

    const disableAllScreen = () => {
        startScreen.style.display = "none";     
        picknameScreen.style.display = "none";  
        playingScreen.style.display = "none";  
        endScreen.style.display = "none";  
    };
       


    const changeScreenTitle = (screenState, currentPlayer) => {
        const screenTitle = document.getElementById("screen-title");

        switch (screenState) {
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

    const changeScreen = (screenState, currentPlayer) => {
        disableAllScreen();

        switch (screenState) {
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
                startScreen.style.display = "flex";
                break;
        }

        changeScreenTitle(screenState, currentPlayer);
        
    };


    

    return {showGrid, changeScreen};
};

const Game = (() => {
    const gameboard = createGameboard();
    const displayManager = createDisplayManager();
    const playerOne = createPlayer("p1", "human", "john");
    const playerTwo = createPlayer("p2", "human", "mark");

    let currentTurn = "p1";
    let win = false;

    // start
    // pickname
    // playing
    // end
    let screenState = "start";

    const startRound = () => {
        let i = 0;
        while (i < 10) {
            displayManager.showGrid(gameboard.getGameboardCopy());
            // 1. get user input
            const pos = prompt(`${currentTurn} move: `)
            // 2. update board 
            gameboard.markGameboard(getCurrentPlayer(), pos);
            displayManager.showGrid(gameboard.getGameboardCopy());
            // evaluateRound
            evaluateRound();
            // repeat again untill someone wins
            switchTurn();
            
            i++;
        }
    }

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

    return {gameboard, displayManager, startRound, getCurrentPlayer};
})();