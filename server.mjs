import express from 'express'
import HTTP_CODES from './utils/httpCodes.mjs';
import {sessionMiddleware} from "./modules/sessionMiddleware.mjs";
import treeRouter from './routes/treeRoutes.mjs';

const server = express();
const port = (process.env.PORT || 8000);

server.set('port', port);

server.use(sessionMiddleware);
server.use(express.json());

server.use(express.static('public'));

server.use("/api/tree", treeRouter);

server.get("/", getRoot);


//Functions-------------------------------------------------------------------------------------------

function getRoot(req, res, next) {
    res.status(HTTP_CODES.SUCCESS.OK).json({
        message: "Hello World",
        sessionId: req.headers["x-session-id"],
        views: req.session.views 
    }).end();
};

server.listen(server.get('port'), function () {
    console.log('server running', server.get('port'));
});

export default server;