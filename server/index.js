const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const router = require('./routes/verifyRoute')
const cors = require('cors')
dotenv.config()
const PORT = process.env.PORT || 6500

const app = express()

//middleware
app.use(express.json())
app.use(cors())

app.listen(PORT, () => console.log(`Server started at: ${PORT}`))

app.get('/',(req, res) => res.send('Hey There!!'))

app.use('/api', router)

mongoose.connect(process.env.MONGO_DB_URL).then(() => console.log('DB connected')).catch(error => console.log(error))

