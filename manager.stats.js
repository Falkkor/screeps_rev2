require('./constants');

var statsManager = {
    run: function () {
        if (PER_TICK_STATS) {
            let rooms = _.filter(Game.rooms, (room) => room.name != undefined);
            let roomInDanger = _.filter(Game.rooms, (room) => room.find(FIND_HOSTILE_CREEPS) > 0);
            let gcl = `GCL(Level: ${Game.gcl.level}, Progress: ${((Game.gcl.progress / Game.gcl.progressTotal) * 100).toFixed(2)}%)\t`;
            let roomCounts = `Rooms(Count: ${rooms.length}, In Danger: ${roomInDanger.length})`;
            let roomStats = [];
            for (var room in Game.rooms) {
                let r = Game.rooms[room];

                let towers = r.find(
                    FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });

                let r1 = `Room(Name: ${r.name}`;
                let r2 = `Energy: ${r.energyAvailable}/${r.energyCapacityAvailable} (${((r.energyAvailable / r.energyCapacityAvailable) * 100).toFixed(2)}%)`;
                let r3 = `Level: ${r.controller.level} (${((r.controller.progress / r.controller.progressTotal) * 100).toFixed(2)}%)`
                let r4 = `Safemode: Ready (${r.controller.safeModeAvailable})`;
                let r5 = `Towers: ${towers.length}`;

                roomStats.push(`${r1}, ${r3}, ${r2}, ${r4}, ${r5})\n`);
            }

            let h = _.filter(Game.creeps, (creep) => creep.memory.role === 'harvester');
            let u = _.filter(Game.creeps, (creep) => creep.memory.role === 'upgrader');
            let r = _.filter(Game.creeps, (creep) => creep.memory.role === 'repairer');
            let b = _.filter(Game.creeps, (creep) => creep.memory.role === 'builder');
            let creeps = `Creeps(H: ${h.length}, U: ${u.length}, R: ${r.length}, B: ${b.length})`;

            let cpu = `CPU(Limit: ${Game.cpu.limit}, Bucket: ${Game.cpu.bucket})`;

            console.log(`${Game.time}\t${gcl}\t${cpu}`);
            console.log(`\t${roomCounts}\t${creeps}`);
            console.log(`\t${roomStats}`);
        }
    }
}

module.exports = statsManager;