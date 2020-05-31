import { NestFactory } from "@nestjs/core"
import { FastifyAdapter } from "@nestjs/platform-fastify"
import type { NestFastifyApplication } from "@nestjs/platform-fastify"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import { promises as fs } from "fs"
import * as path from "path"
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
    .addServer("http://localhost:3000")
    .addServer("https://github.com/night-watch-project/spider-ham")
    .build()
  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup("docs", app, document)

  await fs.writeFile(path.join(__dirname, "../openapi.json"), JSON.stringify(document))

  await app.listen(3000)
}
bootstrap()
