const express = require('express')
const connectDB = require("./db/db")
const app = express()
const cors = require('cors')
const moment = require("moment")
require('dotenv').config()

// Models
const User = require("./models/user")
const Exercise = require("./models/exercise")

// Connect to MongoDB
connectDB()

app.use(express.urlencoded({ extended: false }))
app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


app.post("/api/exercise/new-user", async (req, res) => {
  
  const { username } = req.body

  let user = await User.findOne({ username })

  if(!user) {
    user = new User({
      username
    })

    user.save()
  }

  res.json({
    _id: user._id,
    username
  })
})

app.get("/api/exercise/users", async (req, res) => {

  const users = await User.find({})

  console.log(users)

  res.json( users )

})

app.post("/api/exercise/add", async (req, res) => {

  let { userId, description, duration, date } = req.body;
  let resObj;

  try {
    let user = await User.findById(userId)

    if(!user) {
      return res.status(400).json({ msg: `Cast to ObjectId failed for value ${userId} at path "_id" for model "User"` })
    }

    if(!userId || !description || !duration) {
      return res.status(400).json({ msg: `userId, description, duration fields are required` })
    }

    if(!date) {
      date = new Date()
    } else {
      date = new Date(date)
    }

    duration = +duration

    date = moment(date).format("ddd MMM DD YYYY")

    const exercise = new Exercise({
      userId,
      description,
      duration,
      date
    })

    exercise.save()

    res.json({
      _id: user._id,
      username: user.username,
      date,
      duration,
      description
    })
  } catch(err) {
    console.error(err)
    return res.status(500).json({ msg: `Cast to ObjectId failed for value ${userId} at path "_id" for model "User"` })
  }
})

app.get("/api/exercise/log", async (req, res) => {

  const exercises = await Exercise.find({ userId: req.query.userId }).limit(parseFloat(req.query.limit))
  const user = await User.findById(req.query.userId)

  let countNum = exercises.length

  if(!exercises) {
    return res.status(404).json({ msg: "No user found with that Id", status: `404 not found` })
  }

  if(req.query.limit) countNum = +req.query.limit

  console.log(exercises, countNum)

  res.json({
    "_id": user._id,
    "username": user.username,
    "count": exercises.length,
    "log": exercises
    })

})






const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
