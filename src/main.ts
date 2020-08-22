import { ValidationPipe } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { NestFactory } from "@nestjs/core"
import { FastifyAdapter } from "@nestjs/platform-fastify"
import type { NestFastifyApplication } from "@nestjs/platform-fastify"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import { promises as fs } from "fs"
import * as path from "path"
import * as packagejson from "../package.json"
import { AppModule } from "./app.module"

async function main() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  )
  app.useGlobalPipes(new ValidationPipe())

  const config = app.get(ConfigService)
  const nodeEnv = config.get<string>("NODE_ENV")
  const port = config.get<string>("PORT", "3000")

  if (nodeEnv !== "prod") {
    const document = SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle(packagejson.name)
        .setDescription(packagejson.description)
        .setVersion(packagejson.version)
        .addServer(`http://localhost:${parseInt(port)}`)
        .build()
    )
    SwaggerModule.setup("docs", app, document)

    // export OpenAPI/Swagger specs to JSON file
    // should be dist/openapi.json
    const filepath = path.join(__dirname, "../openapi.json")
    fs.writeFile(filepath, JSON.stringify(document)).catch((err) => {
      console.error(err)
    })
  }

  await app.listen(parseInt(port), "::")
}

main().catch((err) => {
  console.error(err)
})
