/**
 * Created by Tomer on 8/30/2016.
 */
$(document).ready(function() {
	$("#createEvent").hide();
	$("#userProfile").hide();
	$("#eventManagerYourEvents").hide();
	$("#addParticipants").hide();
	$("#eventManagerInvitedEvents").hide();
	$("#eventInfo").hide();
	$("#addItemsToEvent").hide();
	$("#addParticipantsToEvent").hide();
	$("#sideTile").hide();
	$("#successContainer").hide();
});
var eventID;
$("#createEventButton").click(function() {
	$("#overviewContent").hide();
	$("#userProfile").hide();
	$("#eventManagerYourEvents").hide();
	$("#eventManagerInvitedEvents").hide();
	$("#eventInfo").hide();
	$("#createEvent").fadeIn(600);
	$("#addParticipants").fadeIn(600);
});
$("#overviewContentButton").click(function() {
	$("#createEvent").hide();
	$("#addParticipants").hide();
	$("#eventManager").hide();
	$("#userProfile").hide();
	$("#eventManagerYourEvents").hide();
	$("#eventManagerInvitedEvents").hide();
	$("#eventInfo").hide();
	$("#overviewContent").fadeIn(600);
});

$("#eventManagerButton").click(function() {
	$("#overviewContent").hide();
	$("#addParticipants").hide();
	$("#createEvent").hide();
	$("#userProfile").hide();
	$("#eventManagerYourEvents").fadeIn(600);
	$("#eventManagerInvitedEvents").fadeIn(600);
	$("#eventInfo").fadeIn(600);
	$.ajax({
		url: '/api/events',
		method: 'get',
		success: function(obj) {
			obj.success = true;
			if (obj.success) {
				var allEvents = obj.msg;
				for (var i = 0; i < allEvents.length; ++i) {
					showSingleEvent(allEvents[i])
				}
			}
		},
		error: function(obj) {
			$('#msgFromServer').text(obj.msg);
		}
	});
	$.ajax({
		url: '/api/events/invited',
		method: 'get',
		success: function(obj) {
			obj.success = true;
			if (obj.success) {
				var allEvents = obj.msg;
				for (var i = 0; i < allEvents.length; ++i) {
					showSingleInvitedEvent(allEvents[i])
				}

			} else {
				$('#msgFromServer').text(obj.msg);
			}
		},
		error: function(obj) {
			$('#msgFromServer').text(obj.msg);
		}
	});
});


$("#userProfileButton").click(function() {
	$("#overviewContent").hide();
	$("#addParticipants").hide();
	$("#createEvent").hide();
	$("#eventManagerYourEvents").hide();
	$("#eventManagerInvitedEvents").hide();
	$("#eventInfo").hide();
	$("#eventManager").hide();
	$("#userProfile").fadeIn(600);
});

$('#logOutBtn').click(function() {
	$.ajax({
		url: '/user/logout',
		method: 'get',
		success: function() {
			console.log("User logged out");
			window.location.href='/index.html';
		},
		error: function() {
			console.log("Error logging out");
		}
	});
});

$("#createEventButtonNext").click(function() {
	var eventToCreate = {
		name: $('#eventName').val(),
		startDate: $('#eventStartDate').val(),
		numberOfParticipants: 10 // TODO: ADD PARCITIPANTS NUMBERS (?)
	};
	$.ajax({
		url: '/api/events/create',
		method: 'post',
		data: eventToCreate,
		success: function(obj) {
			if (obj.success) {
				eventID = obj.msg;
				$("#createEvent").hide();
				$("#addItemsToEvent").fadeIn(1500);
				// moveToItemsDialog(eventID); // TODO: Open up a function with ajax call to create items (for loop that do ajax call for each item). after it do the same for partic.
			} else {
				$('#msgFromServer').text(obj.msg);
			}
		},
		error: function(obj) {
			$('#msgFromServer').text(obj.msg);
		}
	});
});

$("#createEventButtonNextToParticipants").click(function() {
	var eventFullAds = "/api/events/" + eventID + "/addItem";
	var listItems = $('#listItems').find('li');
	for (var i = 0; i < listItems.length; ++i) {
		var itemName = $(listItems[i]).find('span')[0].innerHTML;
		$.ajax({
			url: eventFullAds,
			method: 'post',
			data: {name: itemName},
			success: function(obj) {
				if (obj.success) {
					console.log("happy items was added")
				} else {
					$('#msgFromServer').text(obj.msg);
				}
			},
			error: function(obj) {
				$('#msgFromServer').text(obj.msg);
			}
		});

	}

	$("#addItemsToEvent").hide();
	$("#addParticipantsToEvent").fadeIn(1500);
});

$("#createEventButtonNextToFinish").click(function() {
	var eventFullAds = "/api/events/" + eventID + "/addUser";
	var listParticipants = $('#listParticipants').find('li');
	for (var i = 0; i < listParticipants.length; ++i) {
		var pEmail = $(listParticipants[i]).find('span')[0].innerHTML; //TODO: FIX THE NAME - WITHOUT SPAN
		console.log(pEmail);
		$.ajax({
			url: eventFullAds,
			method: 'post',
			data: {email: pEmail},
			success: function(obj) {
				if (obj.success) {
					eventID = obj.msg;

					// moveToItemsDialog(eventID); // TODO: Open up a function with ajax call to create items (for loop that do ajax call for each item). after it do the same for partic.
				} else {
					$('#msgFromServer').text(obj.msg);
				}
			},
			error: function(obj) {
				$('#msgFromServer').text(obj.msg);
			}
		});
		$("#addParticipantsToEvent").hide();
		$("#successContainer").fadeIn(1500);
	}
});

function saveItem() {
	var itemName = $('#itemInfo').val();
	var closeSpan = $('<span />').text('x').addClass('w3-closebtn w3-margin-right w3-large').on('click', function() {
		$(this.parentElement).remove();
	});
	var textSpan = $('<span />').text(itemName).addClass('itemTextSpan');
	var listItem = $('<li />').append(textSpan, closeSpan);
	$('#listItems').append(listItem);
}

function saveParticipant() {
	var participantEmail = $('#participantEmail').val();
	var closeSpan = $('<span />');
	closeSpan.text('x').addClass('w3-closebtn w3-margin-right w3-large').on('click', function() {
		$(this.parentElement).remove();
	});
	var emailSpan = $('<span>').text(participantEmail);
	var listPartici = $('<li />').append(emailSpan, closeSpan);
	$('#listParticipants').append(listPartici);
}

function showSingleEvent(event) {
	var listItem = $('<li />').text(event.name).data(event).click(showEventInfo);
	$('#eventsListManager').append(listItem);
}

function showSingleInvitedEvent(event) {
	var eventStatusID = event._id;
	var maybeButton = $('<button />').addClass("w3-btn w3-orange statusBtn").text("Maybe").click(function() {
		updateStatus('Maybe', eventStatusID);
	});
	var goingButton = $('<button />').addClass("w3-btn w3-green statusBtn").text("Going").click(function() {
		updateStatus('Going', eventStatusID);
	});
	var notGoingButton = $('<button />').addClass("w3-btn w3-red statusBtn").text("Not Going").click(function() {
		updateStatus('Not Going', eventStatusID);
	});

	var listItem = $('<li />').text(event.name).append(goingButton, maybeButton, notGoingButton).data(event).click(showEventInfo);
	$('#invitedeventsListManager').append(listItem);
}

function showEventInfo(oEvent) {
	var elem = $(oEvent.target);
	var specificEvent = elem.data();
	var eventIdToBring = elem.data()._id;
	$("#sideTile").fadeIn(500);
	$("#sideName").text(specificEvent.name);
	$("#sideDate").text(specificEvent.startDate);
	$("#sideDateEnd").text(specificEvent.endDate);
}

function updateStatus(statusArrival, eventStatusID) {
	$.ajax({
		url: 'api/events/updateRSVP/' + eventStatusID,
		method: 'put',
		data: {rsvp: statusArrival},
		success: function(obj) {
			if (obj.success) {
				toastr.info('Event Updated Successfully')
			}
		},
		error: function(obj) {
			$('#msgFromServer').text(obj.msg);
		}
	});
}


function initEventInfo() {
	$('#sideName').text(' ');
	$('#sideDate').text(' ');
	$('#sideDateEnd').text(' ');
	$('#sideParticipants').text(' ');
	$('#sideItems').text(' ');
}

function showEventInfo(oEvent) {
	var elem = $(oEvent.target);
	initEventInfo();
	var specificEvent = elem.data();
	var eventIdToBring = elem.data()._id;

	$("#sideTile").fadeIn(500);
	$("#sideName").text(specificEvent.name);
	$("#sideDate").text(specificEvent.startDate);
	$("#sideDateEnd").text(specificEvent.endDate);

	var participantsToEvent;
	var getParticipantsAds = "/api/events/" + eventIdToBring + "/getParticipants";
	$.ajax({
		url: getParticipantsAds,
		method: 'get',
		data: {event_id: eventIdToBring},
		success: function(obj) {
			if (obj.success) {
				participantsToEvent = obj.msg;
				for (var i = 0; i < participantsToEvent.length; ++i) {
					var eventInfoParticipant = $('<div />').addClass('participantOnEventInfo').append($('<span />').text(participantsToEvent[i].email));
					$("#sideParticipants").append(eventInfoParticipant);
				}
			}
		},
		error: function(obj) {
			$('#msgFromServer').text(obj.msg);
		}
	});

	var getItemsAds = "/api/events/" + eventIdToBring + "/getItems";
	$.ajax({
		url: getItemsAds,
		method: 'get',
		data: {event_id: eventIdToBring},
		success: function(obj) {
			if (obj.success) {
				obj.msg.length > 0 ? addItemsToEvent(obj.msg) : $("#sideItems").append($('<span />').text('There are no items'));
			}
		},
		error: function(obj) {
			$('#msgFromServer').text(obj.msg);
		}
	});

}

var addItemsToEvent = function(items) {
	items.forEach(function(item) {
		var eventItemID = item._id;
		var itemDiv = $('<div />').addClass('itemDiv');
		var itemText = $('<span />').text(item.name).addClass('itemText');
		var itemSwitch = $('<input />').attr('type', 'checkbox').addClass('itemSwitch').click(function(event) {
			$.ajax({
				url: 'api/events/updateItem/' + eventItemID,
				method: 'put',
				data: {isChecked: true},
				success: function(obj) {
					if (obj.success) {

					}
				},
				error: function(obj) {
					$('#msgFromServer').text(obj.msg);
				}
			});
		}).prop('disabled', item.isChecked);
		itemDiv.append(itemSwitch, itemText);
		$("#sideItems").append(itemDiv);
	});
}