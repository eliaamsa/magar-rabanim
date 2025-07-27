const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

const dbPath = path.join(__dirname, 'database.json');

// API: קבלת כל המידע עבור התמונה האינטראקטיבית
app.get('/api/rabbis', (req, res) => {
    fs.readFile(dbPath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading database');
        }
        res.json(JSON.parse(data));
    });
});

// API: קבלת מידע ספציפי של רב לצורך עריכה (באמצעות טוקן)
app.get('/api/rabbi/:token', (req, res) => {
    const token = req.params.token;
    fs.readFile(dbPath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading database');
        }
        const rabbis = JSON.parse(data);
        const rabbi = rabbis.find(r => r.token === token);
        if (rabbi) {
            res.json(rabbi);
        } else {
            res.status(404).send('Rabbi not found or invalid token');
        }
    });
});

// API: שמירת עדכון פרטים של רב
app.post('/api/rabbi/:token', (req, res) => {
    const token = req.params.token;
    const updatedRabbiData = req.body;

    fs.readFile(dbPath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading database');
        }
        let rabbis = JSON.parse(data);
        const rabbiIndex = rabbis.findIndex(r => r.token === token);

        if (rabbiIndex !== -1) {
            // שומרים את ה-id וה-token המקוריים
            updatedRabbiData.id = rabbis[rabbiIndex].id;
            updatedRabbiData.token = rabbis[rabbiIndex].token;
            rabbis[rabbiIndex] = updatedRabbiData;
            
            fs.writeFile(dbPath, JSON.stringify(rabbis, null, 2), (err) => {
                if (err) {
                    return res.status(500).send('Error saving data');
                }
                res.json({ message: 'Profile updated successfully!' });
            });
        } else {
            res.status(404).send('Rabbi not found or invalid token');
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
    console.log('Main page: http://localhost:3000');
});
