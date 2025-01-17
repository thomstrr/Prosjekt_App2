import express from 'express'
import HTTP_CODES from './utils/httpCodes.mjs';

const server = express();
const port = (process.env.PORT || 8000);

server.set('port', port);
server.use(express.static('public'));

function getRoot(req, res, next) {
    res.status(HTTP_CODES.SUCCESS.OK).send('Hello World').end();
};

function getPoem(req, res, next) {
    const poem = `
        Roses are red, 
        Violets are blue, 
        this is a poem. 
    `;
    res.status(HTTP_CODES.SUCCESS.OK).send(`${poem}`).end();
};

function getQuote(req, res, next) {
    const quotes = [
        "You miss 100% of the shots you don’t take. - Wayne Gretzky” - Michael Scott",
        "You know what they say. Fool me once, strike one, but fool me twice...strike three. - Michael Scott",
        "When in doubt, look intelligent. - Garrison Keillor",
        "Hard work never killed anybody, but why take a chance? - Edgar Bergen",
        "Two things are infinite: the universe and human stupidity; and im not sure about the universe. - Albert Einstein"
    ];

    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    res.status(HTTP_CODES.SUCCESS.OK).send(randomQuote).end();
};

server.get("/", getRoot);
server.get("/tmp/poem", getPoem);
server.get("/tmp/quote", getQuote);

server.listen(server.get('port'), function () {
    console.log('server running', server.get('port'));
});