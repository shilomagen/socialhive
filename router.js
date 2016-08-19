/**
 * Created by i327364 on 19/08/2016.
 */
var express = require('express');
var apiRouter = express.Router();
var Event = require('./models/event');

apiRouter.use(function(req, res, next) {

	//TODO: user authenticaion
	console.log("api used!");
	next();
});

apiRouter.route('/events')
	.get(function(req, res) {
		Event.find(function(err, events){
			if (err){
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


module.exports = apiRouter;