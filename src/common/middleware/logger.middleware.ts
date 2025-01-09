import { Injectable, NestMiddleware } from "@nestjs/common"
import { Request, Response, NextFunction } from "express"
import * as morgan from "morgan"
import * as path from "path"
import * as fs from "fs"
import * as fsP from "fs/promises"
import { format } from "date-fns"

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const dirPath = path.join(process.cwd(), "logs")
    if (!fs.existsSync(dirPath)) {
      fsP.mkdir(dirPath)
    }

    const fileName = `${format(new Date(), "dd-MM-yyyy")}`
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
