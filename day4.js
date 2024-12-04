const fs = require('node:fs');
let sum = 0;
const re = /XMAS|SAMX/g

const data = fs.readFileSync(process.argv[2]).toString().trim();
lines = data.split("\n");

width = lines[0].length;
height = lines.length;

// add vertical lines
for (let x = 0; x < width; x++) {
    let vert = [];
    for (let y = 0; y < height; y++) {
        vert.push(lines[y][x]);
    }
    // console.log(vert);
    lines.push(vert.join(''));
}

// add diagonal lines

// get starting positions
let upStartPositions = [];
let downStartPositions = [];

for (let y = 3; y < height; y++) {
    upStartPositions.push([0,y]);
}

for (let x = 1; x < width - 3; x++) {
    upStartPositions.push([x, height - 1]);
}

for (let x = 0; x < width - 3; x++) {
    downStartPositions.push([x,0]);
}

for (let y = 1; y < height - 3; y++) {
    downStartPositions.push([0, y]);
}

// Add diagonals
// console.log(upStartPositions);
for (pos of upStartPositions) {
    // console.log(pos);
    lines.push(upDiagonal(pos[0], pos[1], width, lines));
}

for (pos of downStartPositions) {
    // console.log(pos);
    lines.push(downDiagonal(pos[0], pos[1], width, height, lines));
}
// Find matches in lines
for (line of lines) {
    if (line.match(re)) {
        let match, rest = [];

        while (match = re.exec(line)) {
            rest.push(match[0]);
            re.lastIndex = match.index + 1;
        }

        sum += rest.length;
    }
}
console.log(sum);

// return up right diagonal string
function upDiagonal(startX, startY, width, lines) {
    let string = "";
    // console.log(startX, startY, width, height, lines);
    while (startX < width && startY >= 0) {
        // console.log("hey");
        string = string.concat(lines[startY][startX]);
        startY--;
        startX++;
    }
    return string;
}

// return down right diagonal string
function downDiagonal(startX, startY, width, height, lines) {
    let string = "";
    while (startX < width && startY < height) {
        // console.log("hey");
        string = string.concat(lines[startY][startX]);
        startY++;
        startX++;
    }

    return string;
}

