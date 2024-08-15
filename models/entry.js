const mongoose = require('mongoose')

//const password = process.argv[2]

const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)

console.log('connecting to', url)

mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch(error => {
        console.log('error connecting to MongoDB', error.message)
    })

const entrySchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3
    },
    number: String,
})

entrySchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

//const Entry = mongoose.model('Entry', entrySchema)

/*const entry = new Entry({
    name: process.argv[3],
    number: process.argv[4]
})

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
} else if (process.argv.length === 3) {
    Entry.find({}).then(result => {
    result.forEach(person => {
        console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
    })
}else if (process.argv.length === 5) {
    entry.save().then(result => {
    console.log(`added ${entry.name} number ${entry.number} to phonebook`)
    mongoose.connection.close()
    })
}*/

module.exports = mongoose.model('Entry', entrySchema)
