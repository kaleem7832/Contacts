const express = require("express");

const bodyParser = require("body-parser");

const Contacts = require("../models/contacts");

const contactRouter = express.Router();

contactRouter.use(bodyParser.json());

contactRouter
  .route("/")
  .get((req, res, next) => {
    const { start, size, filters, sorting, globalFilter } = req.query;

    Contacts.find({
      $or: [
        { name: { $regex: globalFilter } },
        { designation: { $regex: globalFilter } },
        { email: { $regex: globalFilter } },
        { country: { $regex: globalFilter } },
        { company: { $regex: globalFilter } },
        { city: { $regex: globalFilter } },
        { phone: { $regex: globalFilter } },
      ],
    })
      .select(["-createdAt", "-updatedAt", "-__v"])

      .then(
        (Contacts) => {
          const parsedColumnFilters = JSON.parse(filters);
          if (!!parsedColumnFilters?.length) {
            parsedColumnFilters.map((filter) => {
              const { id: columnId, value: filterValue } = filter;
              Contacts = Contacts.filter((row) => {
                return row[columnId]
                  ?.toString()
                  ?.toLowerCase()
                  ?.includes?.(filterValue.toLowerCase());
              });
            });
          }
          res.statusCode = 200;
          res.setHeader("Content-type", "application/json");
          res.json({
            data:
              Contacts?.slice(
                parseInt(start),
                parseInt(start) + parseInt(size)
              ) ?? [],
            meta: { totalRowCount: Contacts.length },
          });
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
    Contacts.deleteMany(
      {
        _id: {
          $in: req.body.ids,
        },
      },
      function (err, result) {
        if (err) {
          res.send(err);
        } else {
          res.send(result);
        }
      }
    );
    // Contacts.deleteMany({
    //   _id: {
    //     $in: req.body.ids,
    //   },
    // })
    //   .then(
    //     (res) => {
    //       res.statusCode = 200;
    //       res.setHeader("Content-type", "application/json");
    //       res.json(res);
    //     },
    //     (err) => next(err)
    //   )
    //   .catch((err) => next(err));
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
