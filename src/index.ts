import { ClusterManager } from "discord-hybrid-sharding";
import './logger'
import * as path from 'path'

const { discordTokens, branch, totalShards } = require('../config.js')

const manager = new ClusterManager(path.resolve(__dirname,'bot.ts'),{
    totalShards,
    shardsPerClusters:2,
    mode:'process',
    execArgv:['-r','ts-node/register'],
    token: discordTokens[branch]
})

manager.on('clusterCreate', cluster => console.log(`Launched cluster ${cluster.id}`));
(async () => {
    await manager.spawn({timeout:-1})
})()