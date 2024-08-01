const express = require('express')
const app = express()

app.use(express.json())

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

app.get('/', (request, response) => {
    response.send('<h1>Phonebook</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
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
    persons= persons.concat(person)
    response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})
