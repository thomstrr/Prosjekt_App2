import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import HTTP_CODES from './utils/httpCodes.mjs';
import {sessionMiddleware} from "./modules/sessionMiddleware.mjs";
import dataRoutes from './routes/dataRoutes.mjs';


const server = express();
const port = (process.env.PORT || 8000);

server.set('port', port);

server.use(express.json()); 
server.use(sessionMiddleware);
server.use(express.static('public'));

server.use("/items", dataRoutes);

server.listen(server.get('port'), () => {
    console.log(`Server running on http://localhost:${server.get('port')}`);
});

export default server;