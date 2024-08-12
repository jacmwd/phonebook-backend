require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Note = require('./mongo')
const app = express()


let persons = [
    {
        "id": "1",
        "name": "daVinci",
        "number": "045-678-999"
    },
    {
        "id": "2",
        "name": "Michaeangelo",
        "number": "678-999-234"
    },
    {
        "id": "3",
        "name": "Monet",
        "number": "999-321-4435"
    },
]

morgan.token('host', function(req, res){
    return req.hostname
})
morgan.token('body', function(req,res,param){
    return JSON.stringify(req.body)
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(express.json())
app.use(morgan(':method :host :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())
app.use(express.static('dist'))


app.get('/', (request, response) => {
    response.send('<h1>Phonebook</h1>')
})

app.get('/api/persons', (request, response) => {
    Note.find({}).then(notes => response.json(notes))
})

app.get('/api/persons/:id', (request, response)=> {
    const id = request.params.id
    const entry = persons.find(entry => entry.id === id)
    
    if (entry) {
        response.json(entry)
    } else {
        response.status(404).end('Entry not found')
    }
})

app.get('/info', (request, response)=> {
    response.send(`Phonebook has info for ${persons.length} people.</br> ${new Date()}`)
})

app.delete('/api/persons/:id', (request, response)=> {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

app.post('/api/persons/', (request, response)=> {
    const entry = request.body
    const generateId =() => String(Math.floor(Math.random()*200))
    const person = {
        id: generateId(),
        name: entry.name,
        number: entry.number
    }

    if (!entry.name) {
        return response.status(400).json({
            error: 'missing name'
        })
    } else if (!entry.number) {
        return response.status(400).json({
            error: 'missing number'
        })
    } else if (persons.find(person => person.name === entry.name)) {
        return response.status(400).json({
            error: 'this name already exists in phonebook'
        })
    }
    
    persons= persons.concat(person)
    response.json(person)
    
})

app.use(unknownEndpoint)

const PORT = process.env.PORT 
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})
