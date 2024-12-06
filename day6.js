const fs = require('node:fs');
const grid = [];
let guardPos;
let direction = "up";
let inBounds = true;

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
        }
    }
}

// traversal loop
while (inBounds) {
    let nextPos = Object.assign({}, guardPos);
    grid[guardPos.row][guardPos.col] = "X";

    // get next direction
    nextPos = {...getNext(guardPos, direction)};

    // on out of bounds
    if (nextPos.row < 0 || nextPos.row >= depth) {
        inBounds = false;
    }
    if (nextPos.col < 0 || nextPos.col >= width) {
        inBounds = false;
    }

    // on obstacle
    if (inBounds) {
        if (grid[nextPos.row][nextPos.col] === "#") {
            direction = changeDirection(direction);
            nextPos = getNext(guardPos, direction);
        }
    };

    guardPos = {...nextPos};


}

console.log(countX(grid));

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
    switch (direction) {
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
