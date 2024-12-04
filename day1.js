const fs = require('node:fs');

const data = fs.readFileSync(process.argv[2]).toString().trim().split('\r\n');

let list1 = [];
let list2 = [];
const diff = [];
const sim = [];

for (line of data) {
    split = line.split(/\s+/);
    list1.push(split[0]);
    list2.push(split[1]);
}

list1.map(function (x) { return parseInt(x, 10) } ).sort(function(a, b) {return a - b;});
list2.map(function (x) { return parseInt(x, 10) } ).sort(function(a, b) {return a - b;});

for (key in list1) {
    diff.push(Math.abs(list1[key] - list2[key]));
}

for (key in list1) {
    let count = 0;

    for (let i=0; i<list1.length; i++) {
        if (list2[i] == list1[key]) {
            count++;
        }
    }
    
    sim.push(list1[key] * count);
}

console.log(sim.reduce((total, curr) => total + curr));
console.log(diff.reduce((total, curr) => total + curr));
