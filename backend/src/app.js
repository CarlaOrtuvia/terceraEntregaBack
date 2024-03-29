import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import InitializePassport from './config/passport.js'
import cors from 'cors';
import apiRouter from './routes/apis.routes.js';

dotenv.config();
const app = express()
const PORT = 4000

const server =  app.listen(PORT, () => {
    console.log(`Server on Port ${PORT}`)
})

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('BDD conectada'))
    .catch(() => console.log('Error en conexion a BDD'))

    const whiteList = ['http://127.0.0.1:5173']

    const corsOptions = {
        origin: function (origin, callback) {
            if (whiteList.indexOf(origin) != -1 || !origin) {
                callback(null, true)
            } else {
                callback(new Error("Acceso denegado"))
            }
        }
    }
    
    

app.use(express.json())
app.use(cors(corsOptions))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser(process.env.SIGNED_COOKIE))
app.use(session({
    store:  MongoStore.create({ 
        mongoUrl: process.env.MONGO_URL,
       mongoOptions: { 
            useNewUrlParser: true, 
            useUnifiedTopology: true 
        }, 
        ttl: 120
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
})) 

InitializePassport();
app.use(passport.initialize());
app.use(passport.session());


app.use('/', router);
