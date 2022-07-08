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

const titleFilter =  { title: 'Rigatoni alla Genovese' }
const updateDuration = { duration : 100 };
const newOption = { new: true };
const deletingFilter = { title: 'Carrot Cake' };

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
    return Recipe.findOneAndUpdate(titleFilter, updateDuration, newOption)
  })
  .then(() => {
    console.log('3. One recipe was updated')
    return Recipe.deleteOne(deletingFilter)
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
    await Recipe.create(newRecipe)
    await Recipe.deleteMany()
    await Recipe.create(newRecipe)
    console.log('1. One recipe was added')
    await Recipe.insertMany(data)
    console.log('2. Many recipes were added')
    await Recipe.findOneAndUpdate(titleFilter, updateDuration, newOption)
    console.log('3. One recipe was updated')
    await Recipe.deleteOne(deletingFilter)
    console.log('4. One recipe was deleted')
    await mongoose.disconnect()
  } catch (error) {
    console.log(error)
  }
}
interactingWithDB()


// A solution with Promise.all()
// A note about trying to solve with Promise.all => the 2 cases below
// That will work, but........ The executions are actually being called when the promiseArr is declared 
//    and you can't make save in a variable to invoke that function after like:
//    const createOneRecipe = Recipe.create
//    createOneRecipe(newRecipe) => This will throw an error
//    so you need to create things and order and you can't create a unique recipe, delete it and recreate the same recipe
//    because the execution doesn't necessarily respect the order in the PromiseArr and every promise is fired concurrently.
// So if you need to execute sequentially you should break in several Promise.all() that seems to defeat the purpose for that case.

// const handlePromise = () => {
//   const promiseArr = [
//     mongoose.connect(MONGODB_URI),
//     Recipe.deleteMany(),
//     Recipe.create(newRecipe),
//     Recipe.insertMany(data),
//     Recipe.findOneAndUpdate(titleFilter, updateDuration, newOption),
//     Recipe.deleteOne(deletingFilter),
//   ]
//   return promiseArr
// }

// Promise.all(handlePromise())
//   .then(() => mongoose.disconnect())
//   .then(() => console.log('database disconnected'))
//   .catch(() => console.log('Something went wrong in at least one promise'))

// A solution using async / await and Promise.all()
// const resolveMyPromises = async () => {
//   try {
//     await Promise.all(handlePromise())
//     await mongoose.disconnect()
//     console.log('Database disconnected')
//   } catch (error) {
//     console.log(error)
//   }
// };

// resolveMyPromises()