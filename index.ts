import express, { application, Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { Commands } from './commands';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

const execute: Commands = new Commands();

execute.getSystemInfo().then(out => {
})

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

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});