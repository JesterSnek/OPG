const fs = require('fs');
const { toUSVString } = require('util');

const dbData = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

//Checks if the given family or plot ID exists
exports.checkID = (req, res, next, val) => {
  const opgid = req.opgid * 1;

  if (opgid > dbData.length - 1 || val * 1 > dbData[opgid].plots.length - 1) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  next();
};

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.description) {
    return res.status(400).json({
      status: 'fail',
      message: 'Missing name and/or description.',
    });
  }
  next();
};

exports.getAllFamilyPlots = (req, res) => {
  const opgid = req.opgid * 1; // ID of the family, NOT req.params.opgid because its handled before the router is called
  const opg = dbData.find((el) => el.opgid === opgid); //contains all the plots of the family with the given ID

  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: opg.length,
    data: {
      opg,
    },
  });
};

exports.getPlot = (req, res) => {
  const opgid = req.opgid * 1; // ID of the family, NOT req.params.opgid because its handled before the router is called
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

exports.uploadPlot = (req, res) => {
  const opgid = req.opgid * 1; // ID of the family
  const opg = dbData.find((el) => el.opgid === opgid); //contains all the plots of the family with the given ID

  const newId = opg.plots[opg.plots.length - 1].plotid + 1;
  const newPlot = Object.assign({ plotid: newId }, req.body); //object.assign combines 2 objects

  dbData[opgid].plots.push(newPlot);

  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(dbData),
    (err) => {
      res.status(201).json({
        status: 'success',
        plot: newPlot,
      });
    }
  );
};
