const fs = require('node:fs');

const data = fs.readFileSync(process.argv[2]).toString().trim().split('\n');

let count = 0;

for (line of data) {
    split = line.split(/\s+/).map(function (x) { return parseInt(x, 10) } );
    let valid = validate(...split);

    if (!valid) {
        for (let i=0; i<split.length; i++) {
            let copy = [...split];
            copy.splice(i, 1);
            if (validate(...copy)) {
                valid = true;
                break;
            }
        }
    }

    if (valid) {
        count++;
    }
}

function validate(...line) {
    let valid = true;
    let incr = false;
    let sorted = [...line];

    // check increasing
    if (sorted.sort(function(a, b) {return a - b;}).toString() == line.toString()) {
        incr = true;
    }

    // check decreasing
    if (!incr) {
        if (sorted.reverse().toString() != line.toString()) {
            valid = false;
        }
    }

    // check differences
    for (let i=0; i<line.length-1; i++) {
        let diff = Math.abs(line[i] - line[i+1]);
        if (diff < 1 || diff > 3) {
            valid = false;
            break;
        }
    }
    return valid;
}

console.log(count);
