/**
 * Created by i327364 on 19/08/2016.
 */
var express = require('express');
var apiRouter = express.Router();
var Event = require('./../models/event');
var Item = require('./../models/item');
var mongoose = require('mongoose');

apiRouter.use(function(req, res, next) {
	console.log("api used!");
	next();
});

apiRouter.route('/events')
	.get(function(req, res) {
		Event.find(function(err, events) {
			if (err) {
				res.json({
					success: false,
					msg: err
				});
			}
			res.json(events);
		})
	});

apiRouter.route('/events/:event_id')
	.get(function(req, res) {
		Event.findById(req.params.event_id, function(err, event) {
			if (err) {
				res.json({
					success: false,
					msg: err
				});
			}
			res.json(event);
		});
	})
	.put(function(req, res) {
		Event.findById(req.params.event_id, function(err, event) {
			if (err) {
				res.json({
					success: false,
					msg: err
				});
			}
			if (req.body.name) {
				event.name = req.body.name;
			}
			event.save(function(err) {
				if (err) {
					res.json({
						success: false,
						msg: err
					});
				}
				res.send({
					success: true,
					msg: "event updated"
				});
			});
		});
	})
	.delete(function(req, res) {
		Event.remove({
			_id: req.params.event_id
		}, function(err, event) {
			if (err) {
				res.json({
					success: false,
					msg: err
				});
			}
			res.json({
				success: true,
				msg: event.name + "was deleted successfully"
			});
		});

	});

apiRouter.route('/events/create')
	.post(function(req, res) {
		var event = new Event();
		//TODO: post an event
		event.name = req.body.name;
		event.startDate = req.body.startDate;
		event.numberOfParticipants = req.body.numberOfParticipants;
		event.save(function(err) {
			if (err) {
				res.json({
					success: false,
					msg: err
				});
			}
			res.json({
				success: true,
				msg: event._id
			})
		})
	});

apiRouter.route('/events/:event_id/addUser')
	.post(function(req, res) {
		Event.findById(req.params.event_id, function(err, event) {
			if (err) {
				res.json({
					success: false,
					msg: err
				});
			} else {
				event.participants.push({
					name: req.body.name,
					rsvp: req.body.rsvp
				});
				event.save(function(err) {
					if (err) {
						res.json({
							success: false,
							msg: err
						});
					} else {
						res.send(event);
					}
				})
			}

		});
	});

apiRouter.route('/events/:event_id/addItem')
	.post(function(req, res) {
		Event.findById(req.params.event_id, function(err, event) {
			if (err) {
				res.json({
					success: false,
					msg: err
				});
			} else {
				var item = new Item();
				item.name = req.body.name;
				item.isChecked = req.body.isChecked;
				item.responsibilityUserID = req.body.responsibilityUserID;
				item.save(function(err) {
					if (err) {
						res.json({
							success: false,
							msg: err
						});
					}
					console.log(item._id);
				});
				event.items.push(mongoose.Types.ObjectId(item._id));
				event.save(function(err) {
					if (err) {
						res.json({
							success: false,
							msg: err
						});
					}
					console.log("event " + event.name + " saved successfully");
				});
				res.send({
					success: true,
					msg: item
				});
			}
		});
	});

apiRouter.route('/events/:event_id/getItems')
	.get(function(req, res) {
		Event.findById(req.params.event_id, function(err, event) {
			if (err) {
				res.json({
					success: false,
					msg: err
				});
			} else {
				event.getByIds({
					success: function(items) {
						res.send({
							success: true,
							msg: items
						});
					}, error: function(err) {
						res.send({
							success: false,
							msg: err
						});
					}
				});
			}

		});
	});

module.exports = apiRouter;