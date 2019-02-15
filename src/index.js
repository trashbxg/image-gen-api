/* Import Packages*/
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

/* Initialize Middleware*/
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/* Import All Endpoints */
/* TODO- V2 Class Based Endpoints */ // eslint-disable-line
const AchievementEndpoint = require('./backend/generate/achievement');
const ApprovedEndpoint = require('./backend/generate/approved');
const ContrastEndpoint = require('./backend/generate/contrast');
const FrameEndpoint = require('./backend/generate/frame');

/* Functions */
function status(type, msg, res) {
    if(type === false) res.status(400);
    return res.json({sucess: type, message: msg})
}

function isImage(link) {
    let type = link.substring(link.lastIndexOf('.') + 1)
    let isImage = /(png)/gi.test(type);
    if(!isImage) return false;
    return true
}

/* Endpoints */

app.get('/image/achievement', async (req, res) => {
    if(!req.body.text) return status(false, 'No text Provided', res);
    const so = await AchievementEndpoint(req.body.text);
    if(!so) return status(false, 'Text More Than 50 Chars!', res);
    
    return status(true, so, res);
});

app.get('/image/approved', async (req, res) => {
    if(!req.body.url) return status(false, 'No URL Provided', res);
    let check = await isImage(req.body.url);
    if(!check) return status(false, 'The Image Isnt Of The PNG Type.');
    let result = await ApprovedEndpoint(req.body.url);

    return status(result[0], result[1], res)
});

app.get('/image/contrast', async(req, res) => {
    if(!req.body.url) return status(false, 'No URL Provided', res);
    let check = await isImage(req.body.url);
    if(!check) return status(false, 'The Image Isnt Of The PNG Type.');
    let result = await ContrastEndpoint(req.body.url);

    return status(result[0], result[1], res);
});

app.get('/image/frame', async (req, res) => {
    if(!req.body.url) return status(false, 'No URL Provided', res);
    let check = await isImage(req.body.url);
    if(!check) return status(false, 'The Image Isnt Of The PNG Type.');
    let result = await FrameEndpoint(req.body.url);

    return status(result[0], result[1], res);
});

app.listen(process.env.port || '3000', () => { 
    console.log("[CONNECTION] Sucessfully Connected.")
}); 