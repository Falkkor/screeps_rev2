var roleBuilder = {
    run: function (creep) {
        //creep working, out of energy
        if (creep.memory.working === true && creep.carry.energy === 0) {
            creep.memory.working = false; //switch state
        }
        //creep is collecting, now is full
        if (creep.memory.working === false && creep.carry.energy === creep.carryCapacity) {
            creep.memory.working = true; //switch state
        }
        if (creep.memory.target != undefined) {
            var target = Game.getObjectById(creep.memory.target.id);
            if (creep.memory.working && target === null) {
                creep.memory.target = undefined;
            }
        }

        if (creep.memory.working === true && creep.memory.target === undefined) {
            let targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if (creep.memory.target == undefined) {
                var allSites = [];
                for (var i = 0; i < targets.length; i++) {
                    allSites.push({ buildPercent: ((targets[i].progress / targets[i].progressTotal) * 100), id: targets[i].id });
                }
                var highestBuilt = _.max(allSites, function (site) { return site.buildPercent; });
                let target = Game.getObjectById(highestBuilt.id);
                creep.memory.target = target;
            }
        }

        if (creep.memory.working === true && creep.memory.target != undefined) {
            let target = Game.getObjectById(creep.memory.target.id);

            if (creep.build(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
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
module.exports = roleBuilder;