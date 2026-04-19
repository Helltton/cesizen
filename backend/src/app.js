const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const authRoutes       = require('./routes/auth');
const userRoutes       = require('./routes/users');
const menuRoutes       = require('./routes/menus');
const pageRoutes       = require('./routes/pages');
const diagnosticRoutes = require('./routes/diagnostics');

const app = express();

app.use(helmet());
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/auth',        authRoutes);
app.use('/api/users',       userRoutes);
app.use('/api/menus',       menuRoutes);
app.use('/api/pages',       pageRoutes);
app.use('/api/diagnostics', diagnosticRoutes);

app.listen(process.env.PORT || 3000, () => {
  console.log('Serveur démarré sur http://localhost:3000');
});

module.exports = app;