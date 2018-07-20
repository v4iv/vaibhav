const createError = require('http-errors');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const P2PServer = require('./p2p-server');
const BlockChain = require('../../blockchain');
const bc = new BlockChain();

const indexRouter = require('./routes/index');

const app = express();
const p2pServer = new P2PServer(bc);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes

/* Get HomePage */
app.use('/', indexRouter);

/* Get Blocks API. */
app.get('/api/blocks', (req, res) => {
    res.json(bc.chain);
});

/* Mine Blocks API */
app.post('/api/mine', (req, res) => {
    const block = bc.addBlock(req.body.data);
    console.log(`New Block Added: ${block.toString()}`);
    res.redirect('/api/blocks');
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = {
    server: app,
    p2pServer: p2pServer
};
