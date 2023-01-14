const express = require("express");

const bodyParser = require("body-parser");

const Contacts = require("../models/contacts");

const contactRouter = express.Router();

contactRouter.use(bodyParser.json());

contactRouter
  .route("/")
  .get((req, res, next) => {
    Contacts.find({})
      .then(
        (Contacts) => {
          res.statusCode = 200;
          res.setHeader("Content-type", "application/json");
          res.json(Contacts);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    Contacts.create(req.body)
      .then(
        (contact) => {
          console.log("contact created", contact);
          res.statusCode = 200;
          res.setHeader("Content-type", "application/json");
          res.json(contact);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end("Put request not supported on /Contacts");
  })
  .delete((req, res, next) => {
    Contacts.remove({})
      .then(
        (res) => {
          res.statusCode = 200;
          res.setHeader("Content-type", "application/json");
          res.json(res);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

contactRouter
  .route("/:contactId")
  .get((req, res, next) => {
    Contacts.findById(req.params.contactId)
      .then(
        (contact) => {
          res.statusCode = 200;
          res.setHeader("Content-type", "application/json");
          res.json(contact);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    res.statusCode = 403;
    res.end("Post request not supported on /Contacts/" + req.params.contactId);
  })
  .put((req, res, next) => {
    Contacts.findByIdAndUpdate(
      req.params.contactId,
      {
        $set: req.body,
      },
      { new: true }
    )
      .then(
        (contact) => {
          res.statusCode = 200;
          res.setHeader("Content-type", "application/json");
          res.json(contact);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .delete((req, res, next) => {
    Contacts.findByIdAndRemove(req.params.contactId)
      .then(
        (contact) => {
          res.statusCode = 200;
          res.setHeader("Content-type", "application/json");
          res.json(contact);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

module.exports = contactRouter;
