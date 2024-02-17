require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Course = require('./models/courses'); // Ensure this matches the actual file path

// Connect to MongoDB
const dbURI = process.env.MONGODB_URI;
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        // Listen after successful connection to DB
        const port = process.env.PORT || 5555;
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((err) => console.log(err));

app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));


// courses
app.post('/add-course', (req, res) => {
    const { name, description, subjectArea, credits } = req.body;
    const course = new Course({
        name,
        description,
        subjectArea,
        credits
    });
    course.save()
        .then(result => res.send('Course added successfully'))
        .catch(err => console.log(err));
});

app.get('/add-course', (req, res) => {
    const course = new Course({
        name: 'BIOL 121: General Biology I',
       subjectArea: 'Life Sciences',
        credits: 4,
        description: 'Students will be introduced to those biological and chemical principles associated with cell structure and function, photosynthesis, cellular respiration, mitosis, meiosis, molecular and Mendelian genetics, enzyme function and energetics. An overview of natural selection and biotechnology as it applies to prokaryotes and eukaryotes.'
    });

    course.save() // saving 'course'
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
        });
});

// class-list

app.get('/courses', (req, res) => {
    Course.find()
        .then(result => res.json(result))
        .catch(err => console.error(err));
});


// indivdual classes
app.get('/courses/:id', (req, res) => {
    Course.findById(req.params.id)
        .then(course => {
            if (course) {
                res.json(course);
            } else {
                res.status(404).send('Course not found');
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Error fetching course');
        });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Somethings broken!');
});