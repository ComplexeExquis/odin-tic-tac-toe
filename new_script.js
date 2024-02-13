const createPlayer = (name, type, order) => {
    const pName = name;
    const pType = type;
    const pOrder = order;

    let botLogic;

    if (type === "bot") 
        botLogic = createBotLogic();
    else
        botLogic = "empty";

    const result = {
        pName, 
        pType, 
        pOrder,
        botLogic
    };

    return result; 
};

const createBotLogic = () => {

};

const createBoard = () => {
    const gameboard = ["0", "1", "2",
                       "3", "4", "5",
                       "6", "7", "8"];

    const markBoard = (player, position) => {
        const marker = player.marker;
        gameboard[position] = marker;
    } 

    const getGameboardCopy = () => {
        return [...gameboard];
    }

    return {markBoard, getGameboardCopy};
};

const createDisplayManager = (
    startGameFn, 
    initPlayerFn, 
    getcurrentTurnFn,
    getCurrentPlayerFn, 
    setIsHumanVsBotFn,
    isGameOverFn
    ) => {
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
            changeScreen("picknamePve");
            setIsHumanVsBotFn(true);
        });
    })();
    (function initiatePicknameScreen() {
        picknameScreen.children[2].addEventListener("click", () => {
            // get player(s) name from form
            const pOneName = picknameScreen.children[0].value;
            const pTwoName = picknameScreen.children[1].value;
            
            // initiate players object
            initPlayerFn(pOneName, pTwoName);
            
            // reset form value
            picknameScreen.children[0].value = "";
            picknameScreen.children[1].value = "";
            
            // start the game
            startGameFn();

            // change screen state
            changeScreen("playing", getCurrentPlayerFn());
        });
    })();
    (function initiatePlayingScreen() {
        // grid event listener
        const gridItems =  playingScreen.children[0].children;
        for (const i of gridItems) {
            gridItems[i].addEventListener("click", () => {
                
            });
        }
        
        // it should be adding event listenenr on each grid item
        playingScreen.children[0].addEventListener("click", () => {
            

            changeScreen("end");
            
        });

        // restart button
        playingScreen.children[1].addEventListener("click", () => {
            // do reset on grid, player turn
            // reset()
            changeScreen("playing", getCurrentPlayerFn());
            
        });
    })();
    (function initiateEndScreen() {
        const target = endScreen.children[0];

        // restart button
        target.children[1].addEventListener("click", () => {
            // do reset on grid, player turn
            // reset()
            changeScreen("playing", getCurrentPlayerFn());
            
        });

        // menu button
        target.children[2].addEventListener("click", () => {
            // back to menu, full reset
            changeScreen("start");
            setIsHumanVsBotFn(false);
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
            case "picknamePve":
            case "pickname":
                screenTitle.textContent = "Enter name";
                break;
            case "playing":
                screenTitle.textContent = `${currentPlayer.pName} turn`;
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
            case "picknamePve":
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
};

const game = (() => {
    const displayManager = createDisplayManager(
        startGame, 
        initiatePlayers,
        getcurrentTurn,
        getCurrentPlayer,
        setIsHumanVsBot,
        getIsGameOver
    );
    const board = createBoard();
    let playerOne, playerTwo;
    let currentTurn;
    let isHumanVsBot;
    let isGameOver;
    
    function startGame () {
        currentTurn = "p1";
        isGameOver = false;

        

        // game logic
        // ...
    }

    function initiatePlayers(pOneName, pTwoName) {
        playerOne = createPlayer(pOneName, "human", "p1");

        if (isHumanVsBot === true) 
            playerTwo = createPlayer(pTwoName, "bot", "p2");
        else 
            playerTwo = createPlayer(pTwoName, "human", "p2");

        
    }

    function setIsHumanVsBot(newIsHumanVsBot) {
        isHumanVsBot = newIsHumanVsBot;
    }

    function getcurrentTurn() {
        return currentTurn;
    }

    function getCurrentPlayer () {
        return (currentTurn === "p1") ? playerOne : playerTwo; 
    }

    function getIsGameOver() {
        return isGameOver;
    }

    const evaluateRound = () => {
        // if win skip this function
        if (isGameOver) 
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
        
        for (let i = 0; i < winningConditions.length; i++) {
            if (isGameOver) 
                break;
            
            const winningCondition = winningConditions[i];
            for (let j = 0; j < winningCondition.length; j++) {
                
                if (gameboard.getGameboardCopy()[winningCondition[j]] !== getCurrentPlayer().marker) 
                    break;
                else
                    if (j === 2) 
                        isGameOver = true;
            }
        }
    };

})();