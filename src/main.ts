import { NestFactory } from "@nestjs/core"
import { FastifyAdapter } from "@nestjs/platform-fastify"
import type { NestFastifyApplication } from "@nestjs/platform-fastify"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import * as packagejson from "../package.json"
import { AppModule } from "./app.module"

const bootstrap = async () => {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  )

  const options = new DocumentBuilder()
    .setTitle(packagejson.name)
    .setDescription(packagejson.description)
    .setVersion(packagejson.version)
    .build()
  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup("docs", app, document)

  await app.listen(3000)
}
bootstrap()
