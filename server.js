
//Importing Google Keys
const OAuth2Data = require('./googlekey.json')
//Express app
const express = require('express');
const bodyParser = require('body-parser');

//Package to allow us to send Email's
const nodemailer = require('nodemailer');

//Google OAuth packages
const { google } = require("googleapis");

//Configuring server
const port = 3000;
const app = express();
app.use(bodyParser.json());

//Variables used for Oauth2 Authentication
const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL)
const OAuth2 = google.auth.OAuth2;
const CLIENT_ID = OAuth2Data.client.id;
const CLIENT_SECRET = OAuth2Data.client.secret;
const REDIRECT_URL = OAuth2Data.client.redirect
var authenticated = false;
var myTokens;


//Root
app.get('/', (req, res) => {
    res.send('Gmail Rest Api')
});

//Api Endpoint for Oauth2 Authentication
app.get('/api/auth/gmail', (req, res) => {
    if (!authenticated) {
        // Generate an OAuth URL and redirect there
        const url = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: 'https://mail.google.com/'
        });
        res.redirect(url);
    } else {

        res.send('Logged in Successfully')
    }
});

//Api Endpoint For sending mail when user is Logged in
app.post('/api/sendemail', function (req, res) {
    if (authenticated) {
        //User Authenticated
        const transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: "neelparihar599@gmail.com", //your gmail account you used to set the project up in google cloud console"
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: myTokens.refresh_token,
                accessToken: myTokens.access_token //access token variable we defined earlier
            }
        });
        const mailOptions = {
            from: 'youremailaddresshere@email.com', // sender
            to: req.body.email, // receiver
            subject: 'Here is test mail', // Subject
            html: '<p>You have received this email using Gmail Rest Api!! ;)</p>'//body
        }
        //Sending Email
        transport.sendMail(mailOptions, function (err, result) {
            if (err) {
                res.send({
                    message: err
                })
            } else {
                transport.close();
                res.send({
                    message: 'Email has been sent check your inbox!'
                })
            }
        })
    }
    else {
        //Not Authenticated
        console.log('User is not Authenticated');
        res.send({ msg: "User is not Authenticated" })
    }
})

//Callback called when the user has successfully logged in
app.get('/auth/gmail/callback', function (req, res) {
    const code = req.query.code
    if (code) {
        // Get an access token based on our OAuth code
        oAuth2Client.getToken(code, function (err, tokens) {
            if (err) {
                console.log('Error authenticating')
                console.log(err);
            } else {
                console.log('Successfully authenticated');
                myTokens = tokens;
                oAuth2Client.setCredentials(tokens);

                authenticated = true;
                res.redirect('/api/auth/gmail')
            }
        });
    }
});

app.listen(port, () => console.log(`Gmail REST app listening on port ${port}!`))