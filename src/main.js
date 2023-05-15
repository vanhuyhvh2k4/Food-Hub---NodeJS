import {initializeApp} from "firebase/app";
import firebaseConfig from './config/firebase.config.js';
import express from 'express';
import cors from 'cors';
const app = express();
const port = 3000;

import route from './routes/index.route.js';

// config cors
var corsOptions = {
  origin: 'http://localhost:8080',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

// initial firebase
initializeApp(firebaseConfig)

app.use(cors(corsOptions));

// middleware
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());

// route initial
route(app)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})