const fs = require('node:fs');
let sum = 0;

const data = fs.readFileSync(process.argv[2]).toString().trim().split("\n");

const separator = data.indexOf("");
const rules = data.slice(0, separator);
const updates = data.slice(separator + 1);

for (update of updates) {
    update = update.split(",").map((x) => Number(x));
    let valid = true;

    for (rule of rules) {
        rule = rule.split("|").map((x) => Number(x));
        if (!testRule(rule, update)) {
            valid = false;
            break;
        }
    }

    if (valid) {
        sum += update[Math.floor(update.length/2)];
    }
    else {
        continue;
    }
}

function testRule(rule, update) {
    let first = update.indexOf(rule[0]);
    let second = update.indexOf(rule[1]);

    if (first > -1 && second > -1) {
        if (first > second) {
            return false;
        }
    }
    return true;
}


console.log(sum);
