
var getDelay = function(minDelay: number, maxDelay: number) {
    return minDelay + Math.random() * (maxDelay - minDelay);
};

var runBot = function(minDelay: number, maxDelay: number, botTask: () => void) {
    setTimeout(function() {
        botTask();
        runBot(minDelay, maxDelay, botTask);
    }, getDelay(minDelay, maxDelay));
};


export const launchBots = (totalBots: number, minDelay: number, maxDelay: number, task: () => void) => {
    for (var i = 0; i < totalBots; i++) {
        runBot(minDelay, maxDelay, task)
    }
}