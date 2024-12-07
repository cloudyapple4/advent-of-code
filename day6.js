const fs = require('node:fs');
const grid = [];
let guardPos;
let direction = "up";
let inBounds = true;
let obstacleOptions = [];
let initPos;

// create grid
const data = fs.readFileSync(process.argv[2]).toString().trim();

const lines = data.split("\n");
for (line of lines) {
    grid.push([...line]);
};

const width = grid[0].length;
const depth = grid.length;

// get guardPos
for (row in grid) {
    for (col in grid[row]) {
        if (grid[row][col] === "^") {
            guardPos = {row: Number(row), col: Number(col)};
            initPos = {...guardPos};
        }
    }
}

// traversal loop
while (inBounds) {
    grid[guardPos.row][guardPos.col] = "X";

    // get next direction
    let nextPos = getNext(guardPos, direction);

    // if out of bounds, stop
    if (nextPos.row < 0 || nextPos.row >= depth) {
        inBounds = false;
    }
    if (nextPos.col < 0 || nextPos.col >= width) {
        inBounds = false;
    }

    // if obstacle, change direction, get new position
    if (inBounds) {
        if (grid[nextPos.row][nextPos.col] === "#") {

            // part 2: For each obstacle, check ahead for a loop opportunity
            obstacleOptions.push(findLoop({...guardPos}, direction, {...nextPos}))

            // continue as with part 1
            direction = changeDirection(direction);
            nextPos = getNext(guardPos, direction);

        }
    };

    guardPos = {...nextPos};

}

console.log(countX(grid));

console.log(obstacleOptions.filter((x) => JSON.stringify(x) != "{}").length);

function findLoop(guardPos, direction, obstaclePos) {
    let corners = {};
    let done = false
    let fourthCorner = {};

    corners[getCorner(direction)] = {...obstaclePos};
    direction = changeDirection(direction);

    while (!done) {
        // get next position
        nextPos = getNext(guardPos, direction);

        done = outOfBounds({...nextPos});
        // on obstacle, add to corners, change direction
            if (done || grid[nextPos.row][nextPos.col] === "#") {
                
                // if already final corner, compare to expected corner
                if (Object.keys(corners).includes(getCorner(direction))) {
                    //compare corner
                    switch(direction) {
                        case "up":
                            if (corners["top-left"].row > nextPos.row) {
                                fourthCorner = {...corners["top-left"]};
                            }
                        case "right":
                            if (corners["top-right"].col < nextPos.col) {
                                fourthCorner = {...corners["top-right"]};
                            }
                        case "down":
                            if (corners["bottom-right"].row < nextPos.row) {
                                fourthCorner = {...corners["bottom-right"]};
                            }
                        case "left":
                            if (corners["bottom-left"].col > nextPos.col) {
                                fourthCorner = {...corners["bottom-left"]};
                            }
                    }
                    break;
                }
                else {
                    corners[getCorner(direction)] = {...nextPos};

                    if (Object.keys(corners).length == 3) {
                        //calculate 4th corner
                        switch(direction) {
                            case "up":
                                corners["top-right"] = {
                                    row: corners["top-left"].row+1,
                                    col: corners["bottom-right"].col+1
                                    };
                            case "right":
                                corners["bottom-right"] = {
                                    row: corners["bottom-left"].row+1,
                                    col: corners["top-right"].col-1
                                    };
                            case "down":
                                corners["bottom-left"] = {
                                    row: corners["bottom-right"].row-1,
                                    col: corners["top-left"].col-1
                                    };
                            case "left":
                                corners["top-left"] = {
                                    row: corners["top-right"].row-1,
                                    col: corners["bottom-left"].col+1
                                    };
                        }

                    }

                    direction = changeDirection(direction);
                    nextPos = getNext(guardPos, direction);
                }

            }

        guardPos = {...nextPos};
    }
    return fourthCorner;
}

function outOfBounds(pos) {
    ret = false;
    if (pos.row < 0 || pos.row >= depth) {
        ret = true;
    }
    if (pos.col < 0 || pos.col >= width) {
        ret = true;
    }
    return ret
}

function getCorner(direction) {
    switch(direction) {
        case "up":
            return "top-left";
        case "right":
            return "top-right";
        case "down":
            return "bottom-right";
        case "left":
            return "bottom-left";
    }
}

function countX(grid) {
    let count = 0;
    for (row of grid) {
        for (symbol of row) {
            if (symbol === "X") {
                count++;
            }
        }
    }
    return count;
}

function changeDirection(direction) {
    switch(direction) {
        case "up":
            return "right";
        case "right":
            return "down";
        case "down":
            return "left";
        case "left":
            return "up";
    }
    return undefined;
}

function getNext(pos, direction) {
    let ret = Object.assign({}, pos);
    if (direction === "up") {
        ret.row--;
    }
    else if (direction === "down") {
        ret.row++;
    }
    else if (direction === "left") {
        ret.col--;
    }
    else if (direction === "right") {
        ret.col++;
    }
    return ret;
}
