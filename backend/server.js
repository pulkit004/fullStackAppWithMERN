const mongoose =  require('mongoose');
const express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');
const Data = require('./data');

const API_PORT = 3001;

const app = express();
app.use(cors());

const router = express.Router();

const dbRoute = 'mongodb+srv://pulkit:mgEQ5ygdN45MT8Dz@cluster0-iiojb.mongodb.net/test?retryWrites=true&w=majority';
mongoose.connect(dbRoute, {useNewUrlParser: true, useUnifiedTopology: true});

let db = mongoose.connection;

db.once('open', () => console.log("connected to database"));

db.on('error', console.error.bind(console, 'MonogDb connection error:'));

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());
app.use(logger('dev'));

//methods

router.get('/getData', (req, res) => {
    Data.find((err, data) => {
        if(err) return res.json({success: false, error: err});
        return res.json({success: true, data: data})
    });
} )

router.post('/updateData', (req, res) => {
    const {id, update} = req.body;
    Data.findByIdAndUpdate(id, update, (err) => {
        if(err) return res.json({success: false, error: err})
        return res.json({success: true})
    })
})

router.delete('deleteData', (req, res) => {
    const {id} = req.body;
    Data.findByIdAndRemove(id, (err) => {
        if(err) return res.send(err);
        return res.json({success: true})
    })
})

router.post('putData', (req, res) => {
    let data = new Data()
    const {id, message} = req.body;
    if(!id && id !== 0 || !message){
        return res.json({
            success: false,
            error: 'Invalid Inputs'
        })
    }

    data.message = message;
    data.id = id;
    data.save((err) => {
        if(err) return res.json({success: false, error: err});
        return res.json({success: true})
    })
})

app.use('/api', router);
app.listen(API_PORT, () => console.log(`Listening to port ${API_PORT}`))