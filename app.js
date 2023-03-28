const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes')
const app = express();
const cookieParser = require('cookie-parser')
const {requireAuth, checkUser} = require('./middleware/authMiddleware')


// middleware
app.use(express.static('public'));
app.use(express.json())
app.use(cookieParser())

// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = 'mongodb://localhost:27017/node-auth';
mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
  console.log('Db Connected')
})

// routes
app.get('*', checkUser) 
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', requireAuth,(req, res) => res.render('smoothies'));
app.use(authRoutes)



const PORT = process.env.PORT || 3000
app.listen(3000, () => {
  console.log(`App is listening in port: ${PORT}`)
})
