import {Client, Collection, REST} from "discord.js";
import {GatewayIntentBits} from "discord-api-types/v10";
import {ClusterClient, getInfo} from "discord-hybrid-sharding";
import {readdirSync} from "node:fs";
import { APIApplicationCommandExt, IButtonInteraction, ICommand, IInteraction } from "./types";
import { GuildShardPayload, LavalinkManager } from "lavalink-client";
import { PostHog } from "posthog-node";
import mongoose from 'mongoose';
import cache from 'ts-cache-mongoose'

const { discordTokens, branch, nodes, posthog } = require('../config')

export class MusicBot extends Client {
    public cluster = new ClusterClient(this)
    public rest = new REST({ version: '10' }).setToken(discordTokens[branch])
    public music = new LavalinkManager({
        sendToShard: (guildId: string, payload: GuildShardPayload) => this.guilds.cache.get(guildId)?.shard?.send(payload),
        nodes,
        autoSkip: true,
        autoSkipOnResolveError: true,
        playerOptions: {
            defaultSearchPlatform: "ytsearch",
            onDisconnect: {
                autoReconnect: true
            },
            onEmptyQueue: {
                destroyAfterMs: 30_000
            },
            useUnresolvedData: true
        },
        queueOptions:{
            maxPreviousTracks:5
        }
    })
    public posthog = new PostHog(posthog.apiKey, {
        host: posthog.host
    })

    public cmds = new Collection<string, ICommand>()
    public restCmds: APIApplicationCommandExt[] = []

    public interactions = new Collection<string, IInteraction | IButtonInteraction>()

    public  commandFiles     = readdirSync(__dirname+'/cmds').filter(f => f.endsWith('.ts'))
    public  interactionFiles = readdirSync(__dirname+'/interactions').filter(f => f.endsWith('.ts'))
    public  moduleFiles      = readdirSync(__dirname+'/../modules').filter(f => f.endsWith('.ts') && f !== 'example-module.ts')
    private handlerFiles     = readdirSync(__dirname+'/handlers').filter(f => f.endsWith('.ts'))

    constructor() {
        super({
            intents:[
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildVoiceStates
            ],
            shardCount: getInfo().TOTAL_SHARDS,
            shards: getInfo().SHARD_LIST
        });

        // init cache for mongoose
        cache.init(mongoose,{
            defaultTTL: "60 seconds",
            engine: "memory"
        })

        for (const file of this.handlerFiles){
            require(`./handlers/${file}`).default(this)
        }
        
        this.login(discordTokens[branch])
    }
}

new MusicBot();