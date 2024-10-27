import { ClusterManager } from "discord-hybrid-sharding";
import './logger'

const { discordTokens, branch, totalShards } = require('../config.js')

const manager = new ClusterManager(`${__dirname}/bot.ts`,{
    totalShards,
    shardsPerClusters:2,
    mode:'process',
    execArgv:['-r','tsx/cjs'],
    token: discordTokens[branch]
})

manager.on('clusterCreate', cluster => console.log(`Launched cluster ${cluster.id}`));
(async () => {
    await manager.spawn({timeout:-1})
})()