// create web server 
// create router object 
const express = require('express');
const router = express.Router();
const Joi = require('joi'); // for validation 
const comments = require('../models/comments'); // for comments 

// get all comments 
router.get('/', (req, res) => {
    res.send(comments);
});

// get comment by id 
router.get('/:id', (req, res) => {
    const comment = comments.find(c => c.id === parseInt(req.params.id));
    if (!comment) return res.status(404).send('The comment with the given ID was not found.');
    res.send(comment);
});

// create new comment 
router.post('/', (req, res) => {
    const { error } = validateComment(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const comment = {
        id: comments.length + 1,
        comment: req.body.comment
    };
    comments.push(comment);
    res.send(comment);
});

// update comment 
router.put('/:id', (req, res) => {
    const comment = comments.find(c => c.id === parseInt(req.params.id));
    if (!comment) return res.status(404).send('The comment with the given ID was not found.');

    const { error } = validateComment(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    comment.comment = req.body.comment;
    res.send(comment);
});

// delete comment 
router.delete('/:id', (req, res) => {
    const comment = comments.find(c => c.id === parseInt(req.params.id));
    if (!comment) return res.status(404).send('The comment with the given ID was not found.');

    const index = comments.indexOf(comment);
    comments.splice(index, 1);

    res.send(comment);
});

// validate comment 
function validateComment(comment) {
    const schema = {
        comment: Joi.string().required()
    };
    return Joi.validate(comment, schema);
}

module.exports = router;