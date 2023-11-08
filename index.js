const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')


app.use(express.static('dist'))
app.use(cors())
app.use(express.json())
morgan.token('body', req => {
  return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

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
  response.json(phonebook)
})

const genId = () => {
  const maxId = phonebook.length > 0 
    ? Math.max(...phonebook.map(n => n.id))
    : 0
  return maxId +1
}

app.post('/api/phonebook', (req, res) => {
  const body = req.body
  
  if (!body.name) {
    return res.status(400).json({ 
      error: 'name missing' 
    })
  }
  if (phonebook.filter(phone => phone.name === body.name).length > 0){
    return res.status(400).json({
      error: "name already in book"
    })
  }
  const phone = {
    id: genId(),
    name: body.name,
    number: body.number,
  }
  phonebook = phonebook.concat(phone)
  res.json(phone)
})

app.get('/api/phonebook/:id', (req, res) => {
  const id = Number(req.params.id)
  const phone = phonebook.find(phone => phone.id === id)
  if (phone) {
    res.json(phone)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/phonebook/:id', (req, res) => {
  const id = Number(req.params.id)
  phonebook = phonebook.filter(p => p.id !== id)
  console.log(phonebook)
  res.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})