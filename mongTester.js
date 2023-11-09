const mongoose = require('mongoose')

if (process.argv.length<3) {
    console.log('give password as argument')
    process.exit(1)
  }

const password = process.argv[2]
const url = `mongodb+srv://cf841:${password}@phonebook.6n9cz5p.mongodb.net/phoneApp?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const phoneSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Phone = mongoose.model('Phone', phoneSchema)

const phone = new Phone({
    name: "Chris",
    number: "07484734764",
})

phone.save().then(result => {
    console.log('note saved!')
    mongoose.connection.close()
})