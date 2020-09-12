const creepsManager = require('./manager.creeps');
const memoryManager = require('./manager.memory');
const defenseManager = require('./manager.defense');
const statsManager = require('./manager.stats');

module.exports.loop = function () {
    memoryManager.gc();
    creepsManager.run();
    defenseManager.run();
    statsManager.run();
}