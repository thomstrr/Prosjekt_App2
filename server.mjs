import express from 'express'
import HTTP_CODES from './utils/httpCodes.mjs';
import {sessionMiddleware} from "./modules/sessionMiddleware.mjs";
import treeRouter from './routes/treeRoutes.mjs';

const server = express();
const port = (process.env.PORT || 8000);

server.set('port', port);

server.use(sessionMiddleware);
server.use(express.json());

server.use("/api/tree", treeRouter);

server.get("/", getRoot);
server.get("/tmp/poem", getPoem);
server.get("/tmp/quote", getQuote);
server.post("/tmp/sum/:a/:b", postSum);


const decks = {};


//Cards-------------------------------------------------------------------------------------------

function createNewDeck(){
    const cardSuits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
    const cardValues = ['2','3','4','5','6','7','8','9','10','Jack','Queen','King','Ace'];

    const deck = [];
    for (const suit of cardSuits){
        for (const value of cardValues){
            deck.push({suit, value});
        }
    }
    return deck;
};


//Add new deck
server.post('/temp/deck', (req, res) => {
    const deckID = `deck_${Date.now()}`;
    decks[deckID] = createNewDeck();

    res.status(HTTP_CODES.SUCCESS.CREATED).send({deck_id: deckID}).end(); 
});


//Shuffle deck
server.patch('/temp/deck/shuffle/:deck_id', (req, res) => {
    const {deck_id} = req.params;
    const deck = decks[deck_id];

    if (!deck){
        return res.status(HTTP_CODES.CLIENT_ERROR.NOT_FOUND).send({error: 'Deck is not found'}).end();
    };

    for (let i = deck.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    };

    res.status(HTTP_CODES.SUCCESS.OK).send({message: 'Deck is shuffled'}).end();
});


//Get deck
server.get('/temp/deck/:deck_id', (req, res) => {
    const {deck_id} = req.params;
    const deck = decks[deck_id];

    if (!deck) {
        return res.status(HTTP_CODES.CLIENT_ERROR.NOT_FOUND).send({error: 'Deck is not found' });
    }

    res.status(HTTP_CODES.SUCCESS.OK).send({deck});
});


//Get card from deck
server.get('/temp/deck/:deck_id/card', (req, res) => {
    const {deck_id} = req.params;
    const deck = decks[deck_id];

    if (!deck) {
        return res.status(HTTP_CODES.CLIENT_ERROR.NOT_FOUND).send({ error: 'Deck is not found' });
    }

    if (deck.length === 0) {
        return res.status(HTTP_CODES.CLIENT_ERROR.BAD_REQUEST).send({ error: 'No cards left in the deck' });
    }

    const cardIndex = Math.floor(Math.random() * deck.length);
    const card = deck.splice(cardIndex, 1)[0];

    res.status(HTTP_CODES.SUCCESS.OK).send({card});
});


//Functions-------------------------------------------------------------------------------------------

function getRoot(req, res, next) {
    res.status(HTTP_CODES.SUCCESS.OK).json({
        message: "Hello World",
        sessionId: req.headers["x-session-id"],
        views: req.session.views 
    }).end();
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

function postSum(req, res, next) {
    const { a, b } = req.params;

    const numA = parseFloat(a);
    const numB = parseFloat(b);

    const sum = numA + numB;
    res.status(HTTP_CODES.SUCCESS.OK).send({ sum }).end();
};

server.use(express.static('public'));

server.listen(server.get('port'), function () {
    console.log('server running', server.get('port'));
});