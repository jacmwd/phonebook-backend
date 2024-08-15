require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Entry = require('./models/entry')
const app = express()


morgan.token('host', function(req, res){
    return req.hostname
})
morgan.token('body', function(req,res,param){
    return JSON.stringify(req.body)
})

app.use(express.json())
app.use(morgan(':method :host :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())
app.use(express.static('dist'))


app.get('/', (request, response) => {
    response.send('<h1>Phonebook</h1>')
})

app.get('/api/persons', (request, response, next) => {
    Entry.find({})
        .then(notes => response.json(notes))
        .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next)=> {
    Entry.findById(request.params.id)
        .then(notes => response.json(notes))
        .catch(error => next(error))
})

app.get('/info', (request, response, next)=> {
    Entry.find({})
        .then(notes => response.send(`Phonebook has info for ${notes.length} people.</br> ${new Date()}`))
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next)=> {
    Entry.findByIdAndDelete(request.params.id)
        .then(result => response.status(200).end())
        .catch(error => next(error))
})

app.post('/api/persons/', (request, response, next)=> {
    const body = request.body
    
    const entry = new Entry({
        name: body.name,
        number: body.number
    })

    entry.save()
        .then(savedNote => {
        response.json(savedNote)
        })
        .catch(error => next(error))
    
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    const note = {
        name: body.name,
        number: body.number
    }

    Entry.findByIdAndUpdate(request.params.id, note)
        .then(updatedNote => response.json(updatedNote))
        .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).send({ error: error.message })
    }
    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT 
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})
