const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' });
const app = require('./app');
const DB = require('./api/utils/DBString');
const constants = require('./constants/constantsCommon');

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

console.log(constants.ENV);
const port = constants.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
