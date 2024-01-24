const gameboard = ["0", "1", "2",
                   "3", "4", "5",
                   "6", "7", "8"];
    // lol

// manually checks every winning condition
// cause it's only 3x3 board
const winningCondition = [[0, 1, 2],
                          [3, 4, 5],
                          [6, 7, 8],
                          [0, 3, 6],
                          [1, 4, 7],
                          [2, 5, 8],
                          [0, 4, 8],
                          [2, 4, 6]];
    // done i think

function tes() {
    winningCondition.forEach((elem) => {
        elem.forEach((num) => {
            if (gameboard[num] === "0") {
                console.log("retard");
            }
            console.log(gameboard[num]);
        });
        console.log("-----------------------------------");
    });
}

