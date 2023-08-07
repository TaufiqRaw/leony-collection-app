import Express ,{ Application, Request, Response } from "express"
import path from "path"
import httpContext from "express-http-context"
import { MikroORM, PostgreSqlDriver } from "@mikro-orm/postgresql"
import { Options } from "@mikro-orm/core"
import { InstanceMap } from "../../utils/classes/instance-map.util"

//TODO: fix values and make it more detailed
interface ExpressSetting {
  "case sensitive routing" ?: boolean,
  "env" ?: string,
  "etag" ?: boolean,
  "jsonp callback name" ?: string,
  "json escape" ?: boolean,
  "json replacer" ?: (key: string, value: any) => any,
  "json spaces" ?: number,
  "query parser" ?: (query: string) => any,
  "strict routing" ?: boolean,
  "subdomain offset" ?: number,
  "trust proxy" ?: boolean | string | string[],
  "views" ?: string,
  "view cache" ?: boolean,
  "view engine" ?: string,
  "x-powered-by" ?: boolean
}

interface ServerConfig {
  port: number|string
  plugins?: any[]
  databaseConfig: Options<PostgreSqlDriver>,
  config? : ExpressSetting,
  routes? : any[],
  onReq? : (req : Request, res : Response) => void
}

export class Server {
  private application: Application
  private port: number|string
  private databaseConfig: Options<PostgreSqlDriver>
  private config : ExpressSetting
  private orm : MikroORM = {} as MikroORM
  private routes : any[]
  private onReq : (req : Request, res : Response) => void

  private _plugins : any[]

  constructor({port, plugins, databaseConfig, config, routes, onReq}:ServerConfig) {
    this.port = port
    this.application = Express()
    this._plugins = plugins || []
    this.databaseConfig = databaseConfig
    this.config = config || {}
    this.routes = routes || []
    this.onReq = onReq || ((req, res) => {})
  }
  
  public async run() {
    try {
      this.application.use(httpContext.middleware)

      this._plugins.forEach(plugin => this.application.use(plugin))
      Object.entries(this.config).forEach(([key, value]) => this.application.set(key, value))

      this.orm = await MikroORM.init<PostgreSqlDriver>(this.databaseConfig)

      this.application.use((req, res, next) => {
        httpContext.set('em', this.orm.em.fork())
        httpContext.set('controller-map', new InstanceMap())
        httpContext.set("service-map", new InstanceMap())
        res.locals.env = process.env
        this.onReq(req, res)
        next()
      })

      this.routes.forEach(controller => this.application.use(controller.path,controller.router))

      this.application.listen(this.port, () => {
        console.log(`Server running on port ${this.port}`)
      })

    } catch (err) {
      console.error(err)
      process.exit(1)
    }
  }
}