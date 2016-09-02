/**
 * Created by i327364 on 19/08/2016.
 */
var express = require('express');
var apiRouter = express.Router();
var Event = require('./../models/event');
var Item = require('./../models/item');
var User = require('./../models/user');
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
					var userEmail = req.body.email;
					User.findOne({
						'email': {
							'$eq': userEmail
						}
					}, function(err, user) {
						if (err) {
							res.send({
								success: false,
								msg: err
							});
						} else {
							if (!user) {
								res.send({
									success: false,
									msg: 'user with mail ' + req.body.email + ' was not found'
								});
							} else {
								event.participants.push({
									userID: user._id,
									rsvp: "INVITED"
								});
								user.eventInvited.push(event._id);
								user.save(function(err){
									if (err){
										res.send({
											success: false,
											msg: err
										});
									} else {
										console.log("event was added to user " + user.email);
									}
								});
								event.save(function(err) {
									if (err) {
										res.json({
											success: false,
											msg: err
										});
									} else {
										res.send({
											success: true,
											msg: 'user ' + user.email + ' was added to event ' + event.name
										});
									}
								});
							}

						}
					});
				}
			});
		}
	);

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
				event.getItemsByIds({
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

apiRouter.get('/events/:event_id/getParticipants', function(req, res) {
	Event.findById(req.params.event_id, function(err, event) {
		if (err) {
			res.json({
				success: false,
				msg: err
			});
		} else {
			event.getParticipantsByIds({
				success: function(users) {
					res.send({
						success: true,
						msg: users
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