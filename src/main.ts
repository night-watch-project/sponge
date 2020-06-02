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
const { HOST } = process.env

const bootstrap = async () => {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  )

  const options = new DocumentBuilder()
    .setTitle(packagejson.name)
    .setDescription(packagejson.description)
    .setVersion(packagejson.version)
    .addServer(HOST ? `https://${HOST}` : "http://localhost:3000")
    .build()
  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup("docs", app, document)
  // export OpenAPI/Swagger specs to JSON file, in order to work with Saasify
  await fs.writeFile(path.join(__dirname, "../openapi.json"), JSON.stringify(document))

  await app.listen(3000, "::")
}
bootstrap()
