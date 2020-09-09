import { HttpModule, HttpService, Module } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { BlocklistProvider } from "./blocklist.provider"
import { UserAgentPoolProvider } from "./user-agent-pool.provider"

const providers = [
    {
        provide: BlocklistProvider.providerName,
        inject: [ConfigService, HttpService],
        useFactory: (config: ConfigService, http: HttpService) => {
            return BlocklistProvider.init(config, http)
        },
    },
    {
        provide: UserAgentPoolProvider.providerName,
        inject: [ConfigService, HttpService],
        useFactory: (config: ConfigService, http: HttpService) => {
            return UserAgentPoolProvider.init(config, http)
        },
    },
]

@Module({
    imports: [HttpModule.register({ timeout: 10000, validateStatus: () => true })],
    providers,
    exports: providers,
})
export class ResourcesModule {}
