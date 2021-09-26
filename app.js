const fs = require('fs');
const express = require('express');

const app = express();

//middleware
app.use(express.json());

const dbData = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

const getAllFamilyPlots = (req, res) => {
  const opgid = req.params.opgid * 1; // ID of the family
  const opg = dbData.find((el) => el.opgid === opgid); //contains all the plots of the family with the given ID

  res.status(200).json({
    status: 'success',
    results: opg.length,
    data: {
      opg,
    },
  });
};

const getPlot = (req, res) => {
  const opgid = req.params.opgid * 1; // ID of the family
  const plotid = req.params.plotid * 1; // ID of the plot

  const opg = dbData.find((el) => el.opgid === opgid); //contains all the plots of the family with the given ID

  const plot = opg.plots.find((el) => el.plotid === plotid); //contains the specific plot from the given plot ID
  res.status(200).json({
    status: 'success',
    data: {
      plot,
    },
  });
};

const uploadPlot = (req, res) => {
  const opgid = req.params.opgid * 1; // ID of the family
  const opg = dbData.find((el) => el.opgid === opgid); //contains all the plots of the family with the given ID

  const newId = opg.plots[opg.plots.length - 1].plotid + 1;
  const newPlot = Object.assign({ plotid: newId }, req.body); //object.assign combines 2 objects

  dbData[opgid].plots.push(newPlot);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(dbData),
    (err) => {
      res.status(201).json({
        status: 'success',
        plot: newPlot,
      });
    }
  );
};

app.get('/api/v1/:opgid/plots', getAllFamilyPlots);
app.get('/api/v1/:opgid/plots/:plotid', getPlot);
app.post('/api/v1/:opgid/plots', uploadPlot);

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
