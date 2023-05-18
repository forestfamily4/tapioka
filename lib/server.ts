import express from "express";



export class Server {
    private app: express.Express = express()

    public start(port: number = 3000): Server {
        this.app.use(express.json())
        this.app.use(express.urlencoded({ extended: true }));
        this.app.listen(port, () => {
            console.log("server started");
        })
        this.app.get("/", (req, res) => {
            res.send("hello")
        })

        return this
    }
}