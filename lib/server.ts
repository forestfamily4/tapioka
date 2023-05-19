import bodyParser from "body-parser";
import express from "express";



export class Server {
    private app: express.Express = express()

    public start(port: number = 3000): Server {
        this.app.use(bodyParser.json())
        this.app.listen(port, () => {
            console.log("server started");
        })
        this.app.get("/", (req, res) => {
            res.send("hello")
        })

        return this
    }
}