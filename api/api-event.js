/**
 * Created by i327364 on 19/08/2016.
 */
var express = require('express');
var apiRouter = express.Router();
var Event = require('./../models/event');
var Item = require('./../models/item');
var User = require('./../models/user');
var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
mongoose.Promise = Promise;
var consts = require('./../consts');

var Schema = mongoose.Schema;

apiRouter.use(function(req, res, next) {
	jwt.verify(req.cookies.jwtToken, "TEMP_SECRET", function(err, decoder) {
			if (err) {
				res.send({
					success: false,
					msg: "not authenticated"
				});
				//TODO: redirect to login page
			} else {
				next();
			}
		}
	);
});

apiRouter.route('/events')
	.get(function(req, res) {
		User.findById(req.cookies.userId, function(err, user) {
			if (err) {
				res.send({success: false, msg: err});
			} else {
				user.getEvents({
					success: function(events) {
						res.send({
							success: true,
							msg: events
						});
					}, error: function(err) {
						res.send({
							success: false,
							msg: err
						});
					},
					isCreated: true
				});

			}
		});
	});

apiRouter.put('/events/updateRSVP/:event_to_update', function(req, res) {
	User.findOne({
		'eventInvited': {
			'$eq': req.params.event_to_update
		}
	}, function(err, obj) {
		if (err) {
			res.send({success: false, msg: err});
		}
		else {
			console.log("user is invited to event " + req.params.event_to_update);
			Event.update({
					"_id": req.params.event_to_update,
					"participants": {
						"$elemMatch": {
							"userID": req.cookies.userId
						}
					}
				},
				{
					"$set": {"participants.$.rsvp": req.body.rsvp}
				}, function(err, doc) {
					if (err) {
						res.send({success: false, msg: err});
					} else {
						res.send({success: true});
					}
				});
		}
	});
});

apiRouter.put('/events/updateItem/:item_id', function(req, res) {
	Item.findById(req.params.item_id, function(err, item) {
		if (err) {
			res.send({success: false, msg: err});
		} else {
			item.isChecked = req.body.isChecked;
			item.responsibilityUserID = req.cookies.userId;
			item.save(function(err) {
				if (err) {
					res.send({success: false, msg: err});
				}
			});
			res.send({
				success: true,
				msg: item.name + " was updated"
			});
		}
	});
});

apiRouter.route('/events/invited')
	.get(function(req, res) {
		User.findById(req.cookies.userId, function(err, user) {
			if (err) {
				res.send({success: false, msg: err});
			} else {
				user.getEvents({
					success: function(events) {
						res.send({
							success: true,
							msg: events
						});
					}, error: function(err) {
						res.send({
							success: false,
							msg: err
						});
					},
					isCreated: false
				});

			}
		});
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
		var eventInfo = {
			name: req.body.name,
			startDate: req.body.startDate,
			endDate: req.body.endDate,
			organizerID: req.cookies.userId
		};
		Event.createNewEvent(eventInfo)
			.then(User.updateUserEventCreated)
			.then(function(event) {
				console.log("Event " + event.name + " was created successfully");
				res.send({success: true, msg: event});
			})
			.catch(console.log)
			.done();
	});

var addUserToEvent = function addUserToEvent(req, res) {
	var event;
	Event.findById(req.params.event_id).exec()
		.then(eventFromDB=> {
			event = eventFromDB;
			return User.findOne({'email': req.body.email}).exec()
		})
		.then(user => user ? event.addUserToEvent(user, res) : User.handleNonRegisteredUser(req.body.email))
		.catch((err)=>{
			console.log(err);
			res.send({success: false, msg: err})
		});
};

apiRouter.route('/events/:event_id/addUser').post(addUserToEvent);




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
					msg: item.name + " was added to event"
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
				},
				userSchema: User
			});
		}
	});
});


module.exports = apiRouter;