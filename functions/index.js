//FIREBASE PROD SETTINGS
const functions = require('firebase-functions');
const admin = require('firebase-admin');

let serviceAccount = require("./bakeoff-chat-app-firebase-adminsdk-fwrdk-21a9fe04d3.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://bakeoff-chat-app.firebaseio.com"
});

const db = admin.firestore();

//MONGODB LOCAL SETTINGS
/*let mongoose = require('mongoose');
let mongoDB = 'mongodb://127.0.0.1/bakeoff';
mongoose.connect(mongoDB, { useNewUrlParser: true });
let db = mongoose.connection;
//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
*/

const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());

//USER Routes
//Login
app.get('/api/login/:username/:password', (req, res) => {
    (async () => {
        try {
            const document = db.collection('users').doc(req.params.username);
            let user = await document.get();
            if (user.data().password === req.params.password && user.data().archived === false){
                let response = user.data();
                return res.status(200).send(response);
            } else {
                return res.status(500).send("Incorrect Username or Password");
            }
        }
        catch (e) {
            console.log(e);
            return res.status(500).send(e);
        }
    })();
});

//Create
app.post('/api/user/create', (req, res) => {
    (async () => {
        try {
            await db.collection('users').doc('/' + req.body.id + '/').create({
                id: req.body.id,
                name: req.body.name,
                password: req.body.password,
                icon: req.body.icon,
                favorites: req.body.favorites,
                date: req.body.date,
                archived: req.body.archived
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
app.get('/api/users', (req, res) => {
    (async () => {
        try {
            let query = db.collection('users');
            let response = [];
            await query.get().then(querySnapshot => {
                let docs = querySnapshot.docs;
                for (let doc of docs) {
                    const selectedUser = {
                        id: doc.id,
                        name: doc.data().name,
                        password: doc.data().password,
                        icon: doc.data().icon,
                        favorites: doc.data().favorites,
                        date: doc.data().date,
                        archived: doc.data().archived
                    };
                    response.push(selectedUser);
                }
                return response;
            })
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

//Update
app.put('/api/user/:id', (req, res) => {
    (async () => {
        try {
            const document = db.collection('users').doc(req.params.id);
            let bool = Boolean(req.body.archived === true);
            await document.update({
                name: req.body.name,
                password: req.body.password,
                icon: req.body.icon,
                favorites: req.body.favorites,
                date: req.body.date,
                archived: bool
            });
            return res.status(200).send("changed");
        }
        catch (e) {
            console.log(e);
            return res.status(500).send(e);
        }
    })();
});

//Delete
app.delete('/api/user/:id', (req, res) => {
    (async () => {
        try {
            const document = db.collection('users').doc(req.params.id);
            await document.delete();
            return res.status(200).send();
        }
        catch (e) {
            console.log(e);
            return res.status(500).send(e);
        }
    })();
});


//TOPICS Routes
//Create
app.post('/api/topic/create', (req, res) => {
    (async () => {
        try {
            await db.collection('topics').doc('/' + req.body.id + '/').create({
                id: req.body.id,
                name: req.body.name,
                favorites: req.body.name,
                date: req.body.date,
                description: req.body.description,
                archived: req.body.archived
            });
            return res.status(200).send();
        }
        catch (e) {
            console.log(e);
            return res.status(500).send(e);
        }
    })();
});

//Read
app.get('/api/topics', (req, res) => {
    (async () => {
        try {
            let query = db.collection('topics');
            let response = [];
            await query.get().then(querySnapshot => {
                let docs = querySnapshot.docs;
                for (let doc of docs) {
                    const selected = {
                        id: doc.id,
                        name: doc.data().name,
                        favorites: doc.data().name,
                        date: doc.data().date,
                        description: doc.data().description,
                        archived: doc.data().archived
                    };
                    response.push(selected);
                }
                return response;
            })
            return res.status(200).send(response);
        }
        catch (e) {
            console.log(e);
            return res.status(500).send(e);
        }
    })();
});

app.get('/api/topic/:id', (req, res) => {
    (async () => {
        try {
            const document = db.collection('topics').doc(req.params.id);
            let item = await document.get();
            let response = item.data();
            return res.status(200).send(response);
        }
        catch (e) {
            console.log(e);
            return res.status(500).send(e);
        }
    })();
});

//Update
app.put('/api/topic/:id', (req, res) => {
    (async () => {
        try {
            const document = db.collection('topics').doc(req.params.id);
            let bool = Boolean(req.body.archived === true);
            await document.update({
                name: req.body.name,
                favorites: req.body.name,
                Date: req.body.date,
                description: req.body.description,
                archived: bool
            });
            return res.status(200).send("changed");
        }
        catch (e) {
            console.log(e);
            return res.status(500).send(e);
        }
    })();
});

//Delete
app.delete('/api/topic/:id', (req, res) => {
    (async () => {
        try {
            const document = db.collection('topics').doc(req.params.id);
            await document.delete();
            return res.status(200).send();
        }
        catch (e) {
            console.log(e);
            return res.status(500).send(e);
        }
    })();
});


//MESSAGES Routes
//Create
app.post('/api/message/create', (req, res) => {
    (async () => {
        try {
            await db.collection('messages').doc('/' + req.body.id + '/').create({
                id: req.body.id,
                author: req.body.author,
                timestamp: req.body.timestamp,
                topic: req.body.topic,
                content: req.body.content,
                likes: req.body.likes,
                dislikes: req.body.dislikes,
                archived: req.body.archived
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
app.get('/api/Messages', (req, res) => {
    (async () => {
        try {
            let query = db.collection('messages');
            let response = [];
            await query.get().then(querySnapshot => {
                let docs = querySnapshot.docs
                for (let doc of docs) {
                    const selected = {
                        id: doc.id,
                        author: doc.data().author,
                        timestamp: doc.data().timestamp,
                        topic: doc.data().topic,
                        content: doc.data().content,
                        likes: doc.data().likes,
                        dislikes: doc.data().dislikes,
                        archived: doc.data().archived
                    };
                    response.push(selected);
                }
                console.log("msg count: " + response.length);
                return response;
            })
            return res.status(200).send(response);
        }
        catch (e) {
            console.log(e);
            return res.status(500).send(e);
        }
    })();
});

app.get('/page/messages/:topic', (req, res) => {
    (async () => {
        try {
            let query = db.collection('messages');
            let response = [];
            await query.get().then(querySnapshot => {
                let docs = querySnapshot.docs
                for (let doc of docs) {
                    const selected = {
                        id: doc.id,
                        author: doc.data().author,
                        timestamp: doc.data().timestamp,
                        topic: doc.data().topic,
                        content: doc.data().content,
                        likes: doc.data().likes,
                        dislikes: doc.data().dislikes,
                        archived: doc.data().archived
                    };
                    if (parseInt(selected.topic.id) === parseInt(req.params.topic) && selected.archived === false){
                        response.push(selected);
                    }
                }
                return response;
            })
            return res.status(200).send(response);
        }
        catch (e) {
            console.log(e);
            return res.status(500).send(e);
        }
    })();
});

app.get('/api/message/:id', (req, res) => {
    (async () => {
        try {
            const document = db.collection('messages').doc(req.params.id);
            let item = await document.get();
            let response = item.data();
            return res.status(200).send(response);
        }
        catch (e) {
            console.log(e);
            return res.status(500).send(e);
        }
    })();
});

//Update
app.put('/api/message/:id', (req, res) => {
    (async () => {
        try {
            const document = db.collection('messages').doc(req.params.id);
            let bool = Boolean(req.body.archived === true);
            await document.update({
                author: req.body.author,
                timestamp: req.body.timestamp,
                topic: req.body.topic,
                content: req.body.content,
                likes: req.body.likes,
                dislikes: req.body.dislikes,
                archived: bool
            });
            return res.status(200).send("changed");
        }
        catch (e) {
            console.log(e);
            return res.status(500).send(e);
        }
    })();
});

//Delete
app.delete('/api/message/:id', (req, res) => {
    (async () => {
        try {
            const document = db.collection('messages').doc(req.params.id);
            await document.delete();
            return res.status(200).send();
        }
        catch (e) {
            console.log(e);
            return res.status(500).send(e);
        }
    })();
});

//ARCHIVED GETS
app.get('/api/users/archived', (req, res) => {
    (async () => {
        try {
            let query = db.collection('users');
            let response = [];
            await query.get().then(querySnapshot => {
                let docs = querySnapshot.docs;
                for (let doc of docs) {
                    const selectedUser = {
                        id: doc.id,
                        name: doc.data().name,
                        password: doc.data().password,
                        icon: doc.data().icon,
                        favorites: doc.data().favorites,
                        date: doc.data().date,
                        archived: doc.data().archived
                    };
                    if (selectedUser.archived === true){
                        response.push(selectedUser);
                    }
                }
                return response;
            })
            return res.status(200).send(response);
        }
        catch (e) {
            console.log(e);
            return res.status(500).send(e);
        }
    })();
});

app.get('/api/topics/archived', (req, res) => {
    (async () => {
        try {
            let query = db.collection('topics');
            let response = [];
            await query.get().then(querySnapshot => {
                let docs = querySnapshot.docs;
                for (let doc of docs) {
                    const selected = {
                        id: doc.id,
                        name: doc.data().name,
                        favorites: doc.data().name,
                        date: doc.data().date,
                        description: doc.data().description,
                        archived: doc.data().archived
                    };
                    if (selected.archived === true){
                        response.push(selected);
                    }
                }
                return response;
            })
            return res.status(200).send(response);
        }
        catch (e) {
            console.log(e);
            return res.status(500).send(e);
        }
    })();
});

app.get('/api/Messages/archived', (req, res) => {
    (async () => {
        try {
            let query = db.collection('messages');
            let response = [];
            await query.get().then(querySnapshot => {
                let docs = querySnapshot.docs
                for (let doc of docs) {
                    const selected = {
                        id: doc.id,
                        author: doc.data().author,
                        timestamp: doc.data().timestamp,
                        topic: doc.data().topic,
                        content: doc.data().content,
                        likes: doc.data().likes,
                        dislikes: doc.data().dislikes,
                        archived: doc.data().archived
                    };
                    if (selected.archived === true){
                        response.push(selected);
                    }
                }
                return response;
            })
            return res.status(200).send(response);
        }
        catch (e) {
            console.log(e);
            return res.status(500).send(e);
        }
    })();
});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
//export to firebase cloud functions
exports.app = functions.https.onRequest(app);