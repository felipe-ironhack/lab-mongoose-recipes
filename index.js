const mongoose = require('mongoose');

// Import of the model Recipe from './models/Recipe.model.js'
const Recipe = require('./models/Recipe.model');
// Import of the data from './data.json'
const data = require('./data');

const MONGODB_URI = 'mongodb://localhost:27017/recipe-app';

const newRecipe = { 
  title: 'Grilled cheese',
  level: 'Easy Peasy',
  ingredients:['Bread', 'Cheese', 'Butter'],
  cuisine: 'general',
  dishType: 'breakfast',
  duration: 10,
  creator: 'Felipe',
}

// A solution using .then().catch()
mongoose
  .connect(MONGODB_URI)
  .then(x => {
    console.log(`Connected to the database: "${x.connection.name}"`);
    return Recipe.deleteMany()
  })
  .then(() => {
    return Recipe.create(newRecipe)
  })
  .then(() => {
    console.log('1. One recipe was added')
    return Recipe.insertMany(data)
  })
  .then(() => {
    console.log('2. Many recipes were added')
    const filter = { title: 'Rigatoni alla Genovese'}
    const update = { duration: 100 }
    return Recipe.findOneAndUpdate(filter, update, { new: true })
  })
  .then(() => {
    console.log('3. One recipe was updated')
    const filter = { title: 'Carrot Cake' }
    return Recipe.deleteOne(filter)
  })
  .then(() => {
    console.log('4. One recipe was deleted')
    return mongoose.disconnect()
  })
  .catch(error => {
    console.error('Error connecting to the database', error);
  });

// A solution using async / await
const interactingWithDB = async () => {
  try {
    const connection =  await mongoose.connect(MONGODB_URI)
    console.log(`Connected to the database: ${connection.connection.name}`)
    await Recipe.deleteMany()
    await Recipe.create(newRecipe)
    console.log('1. One recipe was added')
    await Recipe.insertMany(data)
    console.log('2. Many recipes were added')
    await Recipe.findOneAndUpdate({
      title: 'Rigatoni alla Genovese' },
      { duration: 100 }, 
      { new : true},
    )
    console.log('3. One recipe was updated')
    await Recipe.deleteOne({ title: 'Carrot Cake' })
    console.log('4. One recipe was deleted')
    await mongoose.disconnect()
  } catch (error) {
    console.log(error)
  }
}
interactingWithDB()


// A solution with Promise.all()
const handlePromise = () => {
  const promiseArr = [
    mongoose.connect(MONGODB_URI),
    Recipe.deleteMany(),
    Recipe.create(newRecipe),
    Recipe.insertMany(data),
    Recipe.findOneAndUpdate({
        title: 'Rigatoni alla Genovese' },
        { duration: 100 }, 
        { new : true},
      ),
    Recipe.deleteOne({ title: 'Carrot Cake' }),
  ]
  return promiseArr
}

Promise.all(handlePromise())
  .then(() => mongoose.disconnect())
  .then(() => console.log('database disconnected'))
  .catch(() => console.log('Something went wrong in at least one promise'))

// A solution using async / await and Promise.all()
const resolveMyPromises = async () => {
  try {
    await Promise.all(handlePromise())
    await mongoose.disconnect()
    console.log('Database disconnected')
  } catch (error) {
    console.log(error)
  }
};

resolveMyPromises()