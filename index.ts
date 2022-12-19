import express, { application, Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { Commands } from './commands';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

const execute: Commands = new Commands();

execute.getSystemInfo().then(out => {
})

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    // Pass to next layer of middleware
    next();
});

app.use(express.json())

app.get('/processador', (req: Request, res: Response) => {
    
    execute.getCpuInfo().then(out => {
        res.json(out);
    })
});

app.get('/memoria', (req: Request, res: Response) => {

    execute.getMemInfo().then(out => {
        res.json(out);
    })
});

app.get('/disco', (req: Request, res: Response) => {

    execute.getDiskInfo().then(out => {
        res.json(out);
    })
});

app.get('/sistema', (req: Request, res: Response) => {
    execute.getSystemInfo().then(out => {
        res.json(out);
    })
});

app.get('/', (req: Request, res: Response) => {
  //res.send('Express + TypeScript Server');
  res.json({'oi':'hi'});
});

app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
});

app.post('/terminal', (req: Request, res: Response) => {
    console.log('body: ' + JSON.stringify(req.body));
    let comm = req.body.comando
    execute.getCommand(comm).then(out => {
        res.json({comando: comm, retorno: out});
    });
    
});


app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});