require('./constants');
var managerDefense = {
    run: function () {
        for (var name in Game.rooms) {
            var roomName = name;
            var hostiles = Game.rooms[roomName].find(FIND_HOSTILE_CREEPS);

            let towers = Game.rooms[roomName].find(
                FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });

            if (hostiles.length > 0 && towers.length > 0) {
                towers.forEach((tower) => {
                    let target = tower.pos.findClosestByRange(hostiles);
                    tower.attacktarget(target);
                });
            }
            else if (towers.length > 0 && TOWERS_REPAIR === true) {
                let damagedStructures = Game.rooms[roomName].find(FIND_STRUCTURES, {
                    filter: (structure) => structure.hits < structure.hitsMax
                });
                if (damagedStructures) {
                    towers.forEach((tower) => {
                        let target = tower.pos.findClosestByRange(damagedStructures);
                        let energyLevel = ((tower.store[RESOURCE_ENERGY] / tower.store.getCapacity(RESOURCE_ENERGY) * 100).toFixed(2));
                        if (energyLevel > 60) {
                            tower.repair(target);
                        }
                    });
                }
            }
        }
    }
}
module.exports = managerDefense;