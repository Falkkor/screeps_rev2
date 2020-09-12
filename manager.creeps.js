const roleHarvester = require('./role.harvester');
const roleUpgrader = require('./role.upgrader');
const roleBuilder = require('./role.builder');
const roleRepairer = require('./role.repairer');
require('./constants');


var creepManager = {
    run: function () {
        //spawner
        for (var spawns in Game.spawns) {
            let spawn = Game.spawns[spawns];
            let room = spawn.room;

            if (spawn.spawning) {
                let display = `🛠️ - ${spawn.spawning.name} - ${spawn.spawning.remainingTime}`;
                spawn.room.visual.text(
                    display,
                    spawn.pos.x + 1,
                    spawn.pos.y,
                    { align: 'left', opacity: 0.8 });
            }
            else {
                let sources = room.find(FIND_SOURCES);
                let sortedSources = sources.slice().sort();
                //bodyparts
                let maxEnergy = room.energyAvailable;
                let maxParts = Math.floor(maxEnergy / 50);
                let evenParts = Math.floor(maxParts / 5);
                let body = [];
                for (i = 0; i < evenParts; i++) {
                    body.push(WORK);
                    body.push(CARRY);
                    body.push(MOVE);
                    body.push(MOVE);
                }
                //spawn and assign to a source
                for (s = 0; s < sortedSources.length; s++) {
                    let source = sortedSources[s];

                    let harvesters = _.filter(Game.creeps, (creep) => creep.memory.role === 'harvester' && creep.memory.source.id === source.id);
                    if (harvesters.length < HARVESTERS_PER_SOURCE) {
                        let newName = `H[${s}]${room.name}`;
                        spawn.spawnCreep(body, newName, { memory: { role: 'harvester', source: source, target: undefined, working: false } });
                    }

                    let upgraders = _.filter(Game.creeps, (creep) => creep.memory.role === 'upgrader' && creep.memory.source.id === source.id);
                    if (upgraders.length < UPGRADERS_PER_SOURCE && harvesters.length > 0) {
                        let newName = `U[${s}]${room.name}`;
                        spawn.spawnCreep(body, newName, { memory: { role: 'upgrader', source: source, target: undefined, working: false } });
                    }

                    let buildTargets = room.find(FIND_CONSTRUCTION_SITES);
                    let builders = _.filter(Game.creeps, (creep) => creep.memory.role === 'builder' && creep.memory.source.id === source.id);
                    if (buildTargets.length > 0 && builders.length < BUILDERS_PER_SOURCE && harvesters.length > 0) {
                        let newName = `B[${s}]${room.name}`;
                        spawn.spawnCreep(body, newName, { memory: { role: 'builder', target: undefined, working: false, source: source } });
                    }
                    else if (buildTargets.length === 0 && builders.length > 0 && harvesters.length > 0) {
                        for (var i = 0; i < builders.length; i++) {
                            Game.creeps[builders[i].name].suicide();
                            console.log('No build targets, removing builders.');
                        }
                    }

                    let targets = undefined;
                    targets = Game.rooms[room.name].find(FIND_STRUCTURES, {
                        filter: (s) => s.hits < s.hitsMax && s.structureType != STRUCTURE_WALL
                    });
                    if (targets === undefined) {
                        targets = creep.room.find(FIND_STRUCTURES, {
                            filter: (s) => s.hits < s.hitsMax && s.structureType === STRUCTURE_WALL
                        });
                    }
                    let repairers = _.filter(Game.creeps, (creep) => creep.memory.role === 'repairer' && creep.memory.source.id === source.id);
                    if (targets.length > 0 && repairers.length < REPAIRERS_PER_SOURCE && harvesters.length > 0) {
                        let newName = `R[${s}]${room.name}`;
                        spawn.spawnCreep(body, newName, { memory: { role: 'repairer', source: source, target: undefined, working: false } });
                    }

                }
            }
        }

        for (let name in Game.creeps) {
            let creep = Game.creeps[name];
            if (SHOW_CREEP_NAMES) {
                creep.say(creep.name);
            }

            if (creep.memory.role === 'harvester') {
                roleHarvester.run(creep);
            }
            if (creep.memory.role === 'upgrader') {
                roleUpgrader.run(creep);
            }
            if (creep.memory.role === 'builder') {
                roleBuilder.run(creep);
            }
            if (creep.memory.role === 'repairer') {
                roleRepairer.run(creep);
            }
        }
    }
}

module.exports = creepManager;