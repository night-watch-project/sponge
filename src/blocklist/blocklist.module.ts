import { HttpModule, HttpService, Module } from "@nestjs/common"
import { BlocklistProvider } from "./blocklist.provider"

const providers = [
  {
    provide: BlocklistProvider.providerName,
    inject: [HttpService],
    useFactory: (httpService: HttpService) => BlocklistProvider.init(httpService),
  },
]

@Module({
  imports: [HttpModule.register({ validateStatus: () => true })],
  providers,
  exports: providers,
})
export class BlocklistModule {}
