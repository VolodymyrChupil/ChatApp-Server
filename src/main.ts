import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import * as cookieParser from "cookie-parser"
import { corsOptions } from "./common/cors"

const PORT = process.env.PORT

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors(corsOptions)
  app.use(cookieParser())
  await app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}!`)
  })
}
bootstrap()
