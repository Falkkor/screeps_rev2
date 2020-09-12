const roleBuilder = require('role.builder');

var roleHarvester = {
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




        //if creep is working
        if (creep.memory.working === true && creep.memory.target === undefined) {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_TOWER || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_CONTAINER) &&
                        structure.energy < structure.energyCapacity || structure.store < structure.storeCapacity;
                }
            });
            if (targets.length > 0) {
                let target = Game.getObjectById(targets[0].id);
                creep.memory.target = target;
            }
        }
        //has target go do work
        if (creep.memory.working === true && creep.memory.target != undefined) {
            var target = Game.getObjectById(creep.memory.target.id);
            if (target.energyCapacity === target.energy) {
                creep.memory.target = undefined;
                creep.memory.working = false;
            }
            if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
            }
            else if (creep.transfer(target, RESOURCE_ENERGY) === ERR_FULL) {
                creep.memory.target = undefined;
            }
        }
        //get resources
        if (creep.memory.working === false) {
            let source = Game.getObjectById(creep.memory.source.id);
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
            }
        }
    }
}
module.exports = roleHarvester;