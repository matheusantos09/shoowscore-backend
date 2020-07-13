import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import app from './app';

app.use(cors());

app.use(express.json());

app.listen(3333);
