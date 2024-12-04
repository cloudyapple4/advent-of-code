const fs = require('node:fs');
let sum = 0;

const data = fs.readFileSync(process.argv[2]).toString().trim();

const re = /mul\(\d{1,3},\d{1,3}\)|do\(\)|don't\(\)/g

let enabled = true;
for (mul of data.match(re)) {
    if (mul === "do()") {
        // console.log("do");
        enabled = true;
    }
    else if (mul === "don't()") {
        // console.log("don't");
        enabled = false;
    } else if (enabled) {
        let [num1, num2] = mul.substring(mul.indexOf("(") + 1, mul.indexOf(")")).split(",").map((x) => Number(x));
        sum += (num1 * num2);
    }
}

console.log(sum);
