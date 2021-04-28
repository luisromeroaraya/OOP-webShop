const Joi = require('joi'); // loads joi module (validation)
const express = require('express'); // loads express module
const app = express(); // creates express object

app.use(express.json());

const courses = [
    {id: 1, name: "course1"},
    {id: 2, name: "course2"},
    {id: 3, name: "course3"}
];


// GET handler (READ)
app.get("/", function(req, res) {
    res.send("Hello World!");
});

app.get("/api/users/:id/:name", function(req,res) {
    res.send(`id: ${req.params.id} name: ${req.params.name}`);
});

app.get("/api/posts/:year/:month", function(req,res) {
    // res.send(req.query);
    res.send(req.params);
});

app.get("/api/courses", function(req,res) {
    res.send(courses);
});

app.get("/api/courses/:id", function(req,res) {
    const course = courses.find(function(element) { // loooks for an element in the array where its [id] corresponds to :id
        return element.id === parseInt(req.params.id); // we parseInt to make sure that id is an integer
    });
    if (!course) { // if object not found we show an error 404 message
        res.status(404).send("The course with the given ID was not found");
    }
    else { // if object exists then we show the course object
        res.send(course);
    }
});


// POST handler (CREATE)
app.post("/api/courses", function(req, res) {
    const validation = validateCourse(req.body);
    if (validation.error) { // if body doesn't exist or name too short then 400 Bad request
        res.status(400).send(validation.error.details[0].message);
        return;
    }
    const course = {
        id: courses.length + 1,
        name: req.body.name
    }
    courses.push(course);
    res.send(course);
});

// PUT handler (UPDATE)
app.put("/api/courses/:id", function(req,res) {
    const course = courses.find(function(element) { // loooks for an element in the array where its [id] corresponds to :id
        return element.id === parseInt(req.params.id); // we parseInt to make sure that id is an integer
    });
    if (!course) { // if object not found we show an error 404 message
        res.status(404).send("The course with the given ID was not found");
        return;
    }
    const validation = validateCourse(req.body);
    if (validation.error) { // if body doesn't exist or name too short then 400 Bad request
        res.status(400).send(validation.error.details[0].message);
        return;
    }
    course.name = req.body.name; // if everything is OK we change the course name
    res.send(course); // we show the updated course
});

// DELETE handler (DELETE)
app.delete("/api/courses/:id", function(req,res) {
    const course = courses.find(function(element) { // loooks for an element in the array where its [id] corresponds to :id
        return element.id === parseInt(req.params.id); // we parseInt to make sure that id is an integer
    });
    if (!course) { // if object not found we show an error 404 message
        res.status(404).send("The course with the given ID was not found");
        return;
    }
    const index = courses.indexOf(course); // looks for the index where the object is
    courses.splice(index, 1); // deletes object from courses array
    res.send(course); // we show the updated course
});

// PORT
const port = process.env.PORT || 3000; // port will use the environment PORT if is set or else 3000
app.listen(port, function() { //register listener
    console.log(`Listening on port ${port}...`);
});

// VALIDATION function using Joi
function validateCourse(course) {
    const schema = Joi.object({ // we create a joi object with the valid schema to be verified
        name: Joi.string().min(3).required()
    });
    return schema.validate(course);
}