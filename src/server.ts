// @ts-ignore
import dotenv from 'dotenv';
import express from 'express';

import app from './app';

dotenv.config();

app.use(express.json());

app.listen(3333);
