import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import router from './routes/routes.js';
import nodemailer from 'nodemailer';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD'],
    credentials: true
}));
app.use(logger());
app.set('etag', false);

app.use('/', router);

app.locals.transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});



app.listen(3001, () => {
	console.log('App started on port 3001');
});

export default app;
