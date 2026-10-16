
console.log("Drawing App - TypeScript Demo");

function recursiveCountdown(number: number): void {
    console.log(`Countdown: ${number}`);

    if (number <= 1) {
        console.log("Countdown finished!");
        return;
    }

    recursiveCountdown(number - 1);
}

recursiveCountdown(3);

console.log("Program completed.");
