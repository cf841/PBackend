require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const Phone = require('./models/phone')

app.use(express.static('dist'))
app.use(cors())
app.use(express.json())
morgan.token('body', req => {
  return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


const errorHandler = (error, req, res, next) => {
  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)

let phonebook = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/phonebook', (request, response) => {
  Phone.find({}).then(phonebook => {
    response.json(phonebook)
  })
  
})

const genId = () => {
  const maxId = phonebook.length > 0 
    ? Math.max(...phonebook.map(n => n.id))
    : 0
  return maxId +1
}

app.put('/api/phonebook/:id', (req, res, next) => {
  Phone.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true, context:'query'}).then(updatedPhone => {
    res.json(updatedPhone)
  }).catch(error => next(error))
})

app.post('/api/phonebook', (req, res, next) => {
  const body = req.body
  
  const phone = new Phone({
    name: body.name,
    number: body.number || ""
  })

  phone.save().then(savedPhone => {
    res.json(savedPhone)
  }).catch(error => next(error))
})

app.get('/api/phonebook/:id', (req, res, next) => {
  Phone.findById(req.params.id).then(phone => {
    if (phone) {
      res.json(phone)
    } else {
      res.status(404).end()
    }
  }).catch(error =>  next(error) )
})

app.delete('/api/phonebook/:id', (req, res, next) => {
  Phone.findByIdAndDelete(req.params.id).then(result => {
    res.status(204).end()
  }).catch(error => next(error))
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

