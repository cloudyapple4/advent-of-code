const fs = require('node:fs');
let sum = 0;
let sum2 = 0;

const data = fs.readFileSync(process.argv[2]).toString().trim().split("\n");

const separator = data.indexOf("");
const rules = data.slice(0, separator);
const updates = data.slice(separator + 1);
const invalidUpdates = [];

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
        invalidUpdates.push(update);
        continue;
    }
}

//part 2
for (update of invalidUpdates) {
    update = fixUpdate(rules, update);

    sum2 += update[Math.floor(update.length/2)];
}

function fixUpdate(rules, update) {
    let applicableRules = [];
    let sortedUpdate = [];

    for (rule of rules) {
        rule = rule.split("|").map((x) => Number(x));
        let first = update.indexOf(rule[0]);
        let second = update.indexOf(rule[1]);
        if (first > -1 && second > -1) {
            applicableRules.push([rule[0],rule[1]]);
        }
    }


    // get list of numbers
    let numbers = [];

    for (rule of applicableRules) {
        for (number of rule) {

            if (numbers.indexOf(number) == -1) {
                numbers.push(number);
            }
        }
    }

    for (number of numbers) {
        let before = [];
        let after = [];
        for (rule of applicableRules) {
            if (rule[0] == number) {
                after.push(rule[1]);
            }
            if (rule[1] == number) {
                before.push(rule[0]);
            }
        }

        // let beforeInd = [0];
        let afterInd = [sortedUpdate.length];

        // for (num of before) {
        //     if (sortedUpdate.indexOf(num) > -1) {
        //         beforeInd.push(sortedUpdate.indexOf(num));
        //     }
        // }
        for (num of after) {
            if (sortedUpdate.indexOf(num) > -1) {
                afterInd.push(sortedUpdate.indexOf(num));
            }
        }

        // let iMin = Math.max(...beforeInd);
        let iMax = Math.min(...afterInd);

        sortedUpdate.splice(iMax, 0, number);

    }

return sortedUpdate;
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

console.log(sum, sum2);
