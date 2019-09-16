const express = require('express');
const connectDB = require('./config/db');
const app = express();
connectDB();
app.get('/', (req, res) => res.send('API Running'));

//define routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/events', require('./routes/api/events'));

const PORT = process.env.Port || 5000;
app.listen(PORT, () => console.log(`server started ${PORT}`));
