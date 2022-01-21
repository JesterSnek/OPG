const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' });
const Plot = require('../../api/middleware/plotModelMiddleware');
const DB = require('../../api/utils/DBString');

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB connected.');
  });

//READ JSON
const plots = JSON.parse(
  fs.readFileSync(`${__dirname}/plots-simple.json`, 'utf-8')
);

//IMPORT INTO DB
const importData = async () => {
  try {
    await Plot.create(plots);
    console.log('Data Loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

//DELETE ALL DATA FROM COLLECTION
const deleteData = async () => {
  try {
    await Plot.deleteMany();
    console.log('Data deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

console.log(process.argv);
