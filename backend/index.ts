import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import appRouter from './routers/app_router';
dotenv.config();

const app: Express = express();
app.use(express.json());
app.use(cors());

app.use('/api', appRouter);
const port = process.env.PORT;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World');
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});