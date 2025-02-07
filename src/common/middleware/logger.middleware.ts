import { Injectable, NestMiddleware } from "@nestjs/common"
import { Request, Response, NextFunction } from "express"
import * as morgan from "morgan"
import * as path from "path"
import * as fs from "fs"
import * as fsP from "fs/promises"
import { format } from "date-fns"

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const date = new Date()
    const year = date.getFullYear()
    const month = date.toLocaleString("en-US", { month: "long" })

    const dirPath = path.join(process.cwd(), "logs", `${year}`, `${month}`)
    if (!fs.existsSync(dirPath)) {
      await fsP.mkdir(dirPath, { recursive: true })
    }

    const fileName = `${format(date, "dd-MM-yyyy")}`
    const logStream = fs.createWriteStream(
      path.join(dirPath, `${fileName}.log`),
      {
        flags: "a",
      },
    )

    morgan(`:remote-addr -- [:date] :method :url :status :user-agent`, {
      stream: logStream,
    })(req, res, () => {})

    next()
  }
}
