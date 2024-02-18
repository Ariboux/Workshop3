const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const { spawn } = require('child_process');

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.get('/predict', async (req, res) => {
    const { sepal_length, sepal_width, petal_length, petal_width } = req.query;

    const pythonProcess = spawn('python', ['predict.py', sepal_length, sepal_width, petal_length, petal_width]);

    pythonProcess.stdout.on('data', (data) => {
        try {
            const prediction = JSON.parse(data.toString());
            res.status(200).json({
                status: 'success',
                data: prediction,
                message: 'Régression logistique'
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                error: {
                    code: 500,
                    message: 'Error parsing prediction output.'
                }
            });
        }
    });

    pythonProcess.stderr.on('data', (data) => {
        res.status(500).json({
            status: 'error',
            error: {
                code: 500,
                message: data.toString()
            }
        });
    });
});

app.listen(port, () => {
    console.log(`Serveur API démarré sur http://localhost:${port}`);
});
