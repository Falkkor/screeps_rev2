var roleRepairer = {
    run: function (creep) {
        if (creep.memory.working === true && creep.carry.energy === 0) {
            creep.memory.working = false;
        }
        else if (creep.memory.working === false && creep.store.getFreeCapacity() === 0) {
            creep.memory.working = true;
        }

        //get target
        if (creep.memory.working === true && creep.memory.target === undefined) {
            var targets = undefined;
            targets = creep.room.find(FIND_STRUCTURES, {
                filter: (s) => s.hits < s.hitsMax && s.structureType != STRUCTURE_WALL
            });
            if (targets === undefined) {
                targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (s) => s.hits < s.hitsMax && s.structureType === STRUCTURE_WALL
                });
            }
            var allTargets = [];
            for (var i = 0; i < targets.length; i++) {
                allTargets.push({ healthPercent: ((targets[i].hits / targets[i].hitsMax) * 100), id: targets[i].id });
            }
            var lowestHealth = _.min(allTargets, function (structure) { return structure.healthPercent; });
            creep.memory.target = Game.getObjectById(lowestHealth.id);
        }
        //heal target
        if (creep.memory.working === true && creep.memory.target != undefined) {
            var target = Game.getObjectById(creep.memory.target.id);
            if (creep.repair(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
            }
            if (target.hits === target.hitsMax) {
                creep.memory.target = undefined;
                creep.memory.working = false;
            }
        }
        //harvest
        if (creep.memory.working === false) {
            var source = Game.getObjectById(creep.memory.source.id);
            if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
            }
        }
    }
}
module.exports = roleRepairer;