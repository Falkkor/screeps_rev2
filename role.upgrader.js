var roleUpgrader = {
    run: function (creep) {
        //creep working, out of energy
        if (creep.memory.working === true && creep.carry.energy === 0) {
            creep.memory.working = false; //switch state
            creep.memory.target = undefined; //reset target
        }
        //creep is collecting, now is full
        if (creep.memory.working === false && creep.carry.energy === creep.carryCapacity) {
            creep.memory.working = true; //switch state
        }

        if (creep.memory.working === true) {
            if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffffff' } });
            }
        }
        else if (creep.memory.working === false) {
            let source = Game.getObjectById(creep.memory.source.id);
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
            }
        }
    }
}
module.exports = roleUpgrader;