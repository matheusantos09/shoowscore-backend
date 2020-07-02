const cors = require('cors');
const dotenv = require('dotenv');
const express = require('express')

import app from './app';

dotenv.config();

app.use(cors());

app.use(express.json())

app.listen(3333);
