const express = require('express')
const connectDB = require('./config/db')
const app = express()

connectDB()

// Init middleware
app.use(express.json({ extended: false }))

// test API to localhost:4000
app.get('/', (req, res) => res.send('API Running'))

// routes for API
app.use('/api/auth', require('./routes/api/auth'))
app.use('/api/users', require('./routes/api/users'))
app.use('/api/profile', require('./routes/api/profile'))
app.use('/api/posts', require('./routes/api/posts'))

const PORT = process.env.PORT || 4000

app.listen(PORT, () => console.log(`Server Started on port ${PORT}`))