'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Drug = mongoose.model('Drug'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Drug
 */
exports.create = function(req, res) {
  var drug = new Drug(req.body);
  drug.user = req.user;

  drug.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(drug);
    }
  });
};

/**
 * Create a new Drug
 */
exports.addNew = function(req, res) {
  var drug = new Drug(req.body);
  drug.user = req.user;

  drug.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(drug);
    }
  });
};

/**
 * Show the current Drug
 */
exports.read = function(req, res) {
    // convert mongoose document to JSON
  var drug = req.drug ? req.drug.toJSON() : {};

    // Add a custom field to the Article, for determining if the current User is the "owner".
    // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  drug.isCurrentUserOwner = req.user && drug.user && drug.user._id.toString() === req.user._id.toString();

  res.jsonp(drug);
};

/**
 * Update a Drug
 */
exports.update = function(req, res) {
  var drug = req.drug;

  drug = _.extend(drug, req.body);

  drug.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(drug);
    }
  });
};

/**
 * Delete an Drug
 */

exports.delete = function(req, res) {
  var drug = req.drug;

  drug.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(drug);
    }
  });
};

/**
 * List of Drugs
 */
exports.list = function(req, res) {
  Drug.find().sort('-created').populate('user', 'displayName').exec(function(err, drugs) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(drugs);
    }
  });
};

exports.newDrugList = function (req, res) {
  Drug.find().sort('-created').populate('user', 'displayName').exec(function(err, drugs) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(drugs);
    }
  });
};

/**
 * Drug middleware
 */
exports.drugByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Drug is invalid'
    });
  }

  Drug.findById(id).populate('user', 'displayName').exec(function (err, drug) {
    if (err) {
      return next(err);
    } else if (!drug) {
      return res.status(404).send({
        message: 'No Drug with that identifier has been found'
      });
    }
    req.drug = drug;
    next();
  });
};
