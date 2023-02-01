"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.launchBots = void 0;
var getDelay = function (minDelay, maxDelay) {
    return minDelay + Math.random() * (maxDelay - minDelay);
};
var runBot = function (minDelay, maxDelay, botTask) {
    setTimeout(function () {
        botTask();
        runBot(minDelay, maxDelay, botTask);
    }, getDelay(minDelay, maxDelay));
};
const launchBots = (totalBots, minDelay, maxDelay, task) => {
    for (var i = 0; i < totalBots; i++) {
        runBot(minDelay, maxDelay, task);
    }
};
exports.launchBots = launchBots;
//# sourceMappingURL=bots-launcher.js.map