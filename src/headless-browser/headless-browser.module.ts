import { Module } from "@nestjs/common"
import { HeadlessBrowserProvider } from "./headless-browser.provider"

const providers = [
  {
    provide: HeadlessBrowserProvider.providerName,
    useFactory: () => HeadlessBrowserProvider.init(),
  },
]

@Module({ providers, exports: providers })
export class HeadlessBrowserModule {}
