const express = require('express');
const axios = require('axios');
const app = express();
const port = 4000;

const modelEndpoints = {
  Maxime: 'https://8414-78-243-3-16.ngrok-free.app/',
  Adrien: 'https://d70c-2a01-cb08-1083-e400-b8b3-f8ca-e65d-d86.ngrok-free.app/',
  Valentin: 'https://58ca-91-175-131-72.ngrok-free.app/',
  Giacomo: 'https://e327-78-243-3-16.ngrok-free.app/'
};

const modelWeights = {
  Maxime: 0.7,
  Adrien: 0.8,
  Valentin: 0.2,
  Giacomo: 0.3
};

app.use(express.json());

app.get('/aggregate-predict', async (req, res) => {
  try {
    const predictions = [];
    for (const [name, url] of Object.entries(modelEndpoints)) {
      try {
        predictions.push({name, prediction: await axios.get(url + "predict", { params: req.query })});
      }
      catch (error) {
        console.log(`Error fetching prediction from ${name} model: ${error.message}`);
      }
    }

    const classSums = { setosa: 0, versicolor: 0, virginica: 0 };
    const classCounts = { setosa: 0, versicolor: 0, virginica: 0 };

    predictions.forEach(({ name, prediction }) => {
      const weight = modelWeights[name];
      const probabilities = prediction.data.data.class_probabilities;
      console.log(probabilities);
      Object.keys(probabilities).forEach(className => {
        classSums[className] += probabilities[className] * weight;
        classCounts[className] += weight;
      });
    });
    const classMeans = {};
    Object.keys(classSums).forEach(className => {
      classMeans[className] = classSums[className] / classCounts[className];
    });


    res.json({
      status: 'success',
      averagePrediction: predictions.map(prediction => ({
        name: prediction.name,
        message: prediction.prediction.data.message,
        data: prediction.prediction.data.data
      })),
      mean: classMeans
    });

  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'There was a problem collecting predictions from the models',
      error: error.message
    });
  }
});

app.listen(port, () => {
  console.log(`Aggregator service is running on http://localhost:${port}`);
});