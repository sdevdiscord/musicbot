import Sync = require("heatsync");
import ConfigProvider from '@sdev/config'
import {CommandManager} from '@sdev/commands'
import {CommandManagerParams, MusicBot} from "./MusicBot";

type Passthrough = {
    sync: Sync,
    conf: ConfigProvider,
    commands: CommandManager<CommandManagerParams>
    client: MusicBot
}

export default {} as Passthrough