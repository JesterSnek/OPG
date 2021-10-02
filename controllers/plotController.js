const Plot = require('../models/plotModel');
const APIFeatures = require('../utils/apiFeatures');

exports.getAllFamilyPlots = async (req, res) => {
  try {
    //EXECUTE QUERY
    const features = new APIFeatures(Plot.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const plots = await features.query;

    res.status(200).json({
      status: 'success',
      results: plots.length,
      data: {
        plots,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getPlot = async (req, res) => {
  try {
    const plot = await Plot.findById(req.params.plotid);

    res.status(200).json({
      status: 'success',
      data: {
        plot,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.uploadPlot = async (req, res) => {
  try {
    const newPlot = await Plot.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        plot: newPlot,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.updatePlot = async (req, res) => {
  try {
    const plot = await Plot.findByIdAndUpdate(req.params.plotid, req.body, {
      new: true, // returns the modified document and not the original
    });

    res.status(200).json({
      status: 'success',
      data: {
        plot,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.deletePlot = async (req, res) => {
  try {
    await Plot.findByIdAndDelete(req.params.plotid);

    res.status(204).json({
      status: 'success',
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
