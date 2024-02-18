const createPlayer = (name, type, order) => {
    const pName = name;
    const pType = type;
    const pOrder = order;

    const marker = (order === "p1") ? "X" : "O";

    let botLogic;

    if (type === "bot") 
        botLogic = createBotLogic();
    else
        botLogic = "empty";

    const result = {
        pName, 
        pType, 
        pOrder,
        botLogic,
        marker
    };

    return result; 
};

const createBotLogic = () => {

};

const createBoard = () => {
    let gameboard = ["0", "1", "2",
                     "3", "4", "5",
                     "6", "7", "8"];

    const markBoard = (player, position) => {
        const marker = player.marker;
        gameboard[position] = marker;
    }; 

    const getGameboardCopy = () => {
        return [...gameboard];
    };

    const resetBoard = () => {
        gameboard = ["0", "1", "2",
                     "3", "4", "5",
                     "6", "7", "8"];
    };

    // this one is buggy
    const isFullyMarked = () => {
        for (const element of gameboard) {
            console.log(element);
            if(Number.isInteger(parseInt(element))){ // found a number, means that board is not fully marked
                console.log("break");
                return false;
            } 
            else { // "X" or "O" continue looping
                console.log("continue");
                continue;
            }
                
        }
        console.log("fully marked");
        // if succesfully iterate all array elements, means that all of it is "X" or "O"
        return true;
    }

    return {markBoard, 
            getGameboardCopy, 
            resetBoard, 
            isFullyMarked};
};

const createDisplayManager = (
    startGame, 
    initPlayer, 
    resetTurn,
    getCurrentPlayer, 
    setIsHumanVsBot,
    isGameOver,
    markBoard,
    switchTurn,
    evaluateRound,
    resetBoard,
    resetIsGameOver,
    resetIsTie,
    getIsTie,
    isFullyMarked
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
            setIsHumanVsBot(true);
        });
    })();
    (function initiatePicknameScreen() {
        picknameScreen.children[2].addEventListener("click", () => {
            // get player(s) name from form
            const pOneName = picknameScreen.children[0].value;
            const pTwoName = picknameScreen.children[1].value;
            
            // initiate players object
            initPlayer(pOneName, pTwoName);
            
            // reset form value
            picknameScreen.children[0].value = "";
            picknameScreen.children[1].value = "";
            
            // start the game
            startGame();

            // change screen state
            changeScreen("playing", getCurrentPlayer());
        });
    })();
    (function initiatePlayingScreen() {
        // grid event listener
        const gridItems =  playingScreen.children[0].children;
        for (const gridItem of gridItems) {
            gridItem.addEventListener("click", (e) => {
                // if game is over, nothing happens when clicking
                if (isGameOver()) 
                    return;
                // get data item
                const position = e.target.dataset.pos;
                // mark the grid cell
                markBoard(getCurrentPlayer(), position);
                if (getCurrentPlayer().pOrder === "p1") 
                    e.target.classList.add("marked-p1")
                else  
                    e.target.classList.add("marked-p2")
                // disable marking the marked cell
                e.target.classList.add("disabled");
                // put mark inside corresponding cell
                e.target.innerText = getCurrentPlayer().marker;
                // evaluate turn, is game over or not
                if(evaluateRound()){
                    changeScreen("end", getCurrentPlayer())
                    return;
                }
                // switch turn
                switchTurn();    
                // change the title screen
                changeScreenTitle("playing", getCurrentPlayer());
            });
        }

        // restart button
        playingScreen.children[1].addEventListener("click", () => {
            // do reset on grid, player turn
            reset();
            changeScreen("playing", getCurrentPlayer());
        });
    })();
    (function initiateEndScreen() {
        const target = endScreen.children[0];

        // restart button
        target.children[1].addEventListener("click", () => {
            // do reset on grid, player turn
            reset();
            changeScreen("playing", getCurrentPlayer());
        });

        // menu button
        target.children[2].addEventListener("click", () => {
            // back to menu, full reset
            reset();
            changeScreen("start");
            setIsHumanVsBot(false);
        });
    })();

    function disableAllScreen() {
        startScreen.style.display = "none";     
        picknameScreen.style.display = "none";  
        playingScreen.style.display = "none";  
        endScreen.style.display = "none";  
    };
       
    function changeScreenTitle(screenState, currentPlayer) {
        const screenTitle = document.getElementById("screen-title");

        if (getIsTie()) {
            screenTitle.textContent = `Draw, you can restart the game`;
            return;
        }

        switch (screenState) {
            case "picknamePve":
            case "pickname":
                screenTitle.textContent = "Enter name";
                break;
            case "playing":
                screenTitle.textContent = `${currentPlayer.pName} turn (${currentPlayer.marker})`;
                break;
            case "end":
                screenTitle.textContent = `Game ends`;
                document.getElementById("dialog-title")
                    .innerText = `${currentPlayer.pName} (${currentPlayer.marker}) wins`;
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

    function changeScreen(screenState, currentPlayer = "") {
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
    }

    function resetBoardVisually() {
        const gridItems = document.querySelectorAll(".grid-item");
        for (const gridItem of gridItems) {
            gridItem.innerText = "";
            gridItem.classList.remove("disabled");  
            gridItem.classList.remove("marked-p1");
            gridItem.classList.remove("marked-p2");        
        }
    }

    function reset() {
        resetBoard();
        resetBoardVisually();
        resetTurn();
        resetIsGameOver();
        resetIsTie();
    }
};

const game = (() => {
    const board = createBoard();
    const displayManager = createDisplayManager(
        startGame, 
        initiatePlayers,
        resetTurn,
        getCurrentPlayer,
        setIsHumanVsBot,
        getIsGameOver,
        board.markBoard,
        switchTurn,
        evaluateRound,
        board.resetBoard,
        resetIsGameOver,
        resetIsTie,
        getIsTie,
        board.isFullyMarked
    );
    let playerOne, playerTwo;
    let currentTurn;
    let isHumanVsBot;
    let isGameOver;
    let isTie;
    
    function startGame () {
        resetTurn();
        resetIsGameOver();
        resetIsTie();
    }

    function initiatePlayers(pOneName, pTwoName) {
        // if name is empty, assign default name
        if (pOneName === "") 
            pOneName = "p1";
        if(pTwoName === "" && !isHumanVsBot)
            pTwoName = "p2";

        playerOne = createPlayer(pOneName, "human", "p1");

        if (isHumanVsBot) 
            playerTwo = createPlayer("bot", "bot", "p2");
        else 
            playerTwo = createPlayer(pTwoName, "human", "p2");
    }

    function setIsHumanVsBot(newIsHumanVsBot) {
        isHumanVsBot = newIsHumanVsBot;
    }

    function resetTurn() {
        currentTurn = "p1";
    }

    function resetIsGameOver() {
        isGameOver = false;
    }

    function resetIsTie() {
        isTie = false;
    }

    function switchTurn() {
        currentTurn = (currentTurn === "p1") ? "p2" : "p1";
    }

    function getCurrentPlayer () {
        return (currentTurn === "p1") ? playerOne : playerTwo; 
    }

    function getIsGameOver() {
        return isGameOver;
    }

    function getIsTie() {
        return isTie;
    }

    function evaluateRound() {
        // check if draw occurs
        if (board.isFullyMarked()) {
            isTie = true;
            return false;
        }
           
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
                
                if (board.getGameboardCopy()[winningCondition[j]] !== getCurrentPlayer().marker) 
                    break;
                else
                    if (j === 2) {
                        // the game ends, someone win
                        isGameOver = true;
                        return true;
                    }
            }
        }
    }

})();