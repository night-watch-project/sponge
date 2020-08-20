import { ValidationPipe } from "@nestjs/common"
import { NestFactory } from "@nestjs/core"
import { FastifyAdapter } from "@nestjs/platform-fastify"
import type { NestFastifyApplication } from "@nestjs/platform-fastify"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import * as dotenv from "dotenv-flow"
import { promises as fs } from "fs"
import * as path from "path"
import * as packagejson from "../package.json"
import { AppModule } from "./app.module"

dotenv.config()
const { NODE_ENV, PORT = "3000" } = process.env

async function main() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  )
  app.useGlobalPipes(new ValidationPipe())

  if (NODE_ENV !== "prod") {
    const document = SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle(packagejson.name)
        .setDescription(packagejson.description)
        .setVersion(packagejson.version)
        .addServer(`http://localhost:${parseInt(PORT)}`)
        .build()
    )
    SwaggerModule.setup("docs", app, document)

    // export OpenAPI/Swagger specs to JSON file, in order to work with Saasify
    // should be dist/openapi.json
    const filepath = path.join(__dirname, "../openapi.json")
    fs.writeFile(filepath, JSON.stringify(document)).catch((err) => {
      console.error(err)
    })
  }

  await app.listen(parseInt(PORT), "::")
}

main().catch((err) => {
  console.error(err)
})
