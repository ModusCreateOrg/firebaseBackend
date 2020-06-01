const functions = require('firebase-functions');
const admin = require('firebase-admin');

let serviceAccount = require("./bakeoff-chat-app-firebase-adminsdk-fwrdk-21a9fe04d3.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://bakeoff-chat-app.firebaseio.com"
});

const express = require('express');
const app = express();
const db = admin.firestore();
const cors = require('cors');
app.use(cors({ origin:true }));

//Routes
app.get('/api/users', (req, res) => {
    (async () => {
        try {
            const document = db.collection('users');
            let users = await document.get();
            let response = users.data();
            return res.status(200).send(response);
        }
        catch (e) {
            console.log(e);
            return res.status(500).send(e);
        }
    })();
});

app.get('/api/user/:id', (req, res) => {
    (async () => {
        try {
            const document = db.collection('users').doc(req.params.id);
            let user = await document.get();
            let response = user.data();
            return res.status(200).send(response);
        }
        catch (e) {
            console.log(e);
            return res.status(500).send(e);
        }
    })();
});

//Create
app.post('/api/create', (req, res) => {
    (async () => {
        try {
            await db.collection('users').doc('/' + req.body.id + '/').create({
                id: req.body.id,
                name: req.body.name,
                password: req.body.password,
                icon: req.body.icon
            })

            return res.status(200).send();
        }
        catch (e) {
            console.log(e);
            return res.status(500).send(e);
        }
    })();
});

//Read

//Update

//Delete


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
//export to firebase cloud functions
exports.app = functions.https.onRequest(app);