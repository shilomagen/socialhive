/**
 * Created by Tomer on 8/30/2016.
 */
$(document).ready(function() {
	$("#signUp").hide();
	$("#login").hide();
});

$("#signUpButton").click(function() {
	$("#login").hide();
	$("#signUp").fadeToggle(600);

});

$("#loginButton").click(function() {
	$("#signUp").hide();
	$("#login").fadeToggle(600);

});


$("#registerButton").click(function(e) {
	e.preventDefault();
	var user = {
		fname: $('#fname').val(),
		lname: $('#lname').val(),
		email: $('#email').val(),
		password: $('#password').val()
	};
	$.ajax({
		url: '/user/register',
		method: 'post',
		data: user,
		success: function(obj) {
			if (obj.success) {
				$('.server-response').css('background', 'green');
				$('#msgFromServer').text(obj.msg);
			} else {
				$('.server-response').css('background', 'red');
				$('#msgFromServer').text(obj.msg);
			}
		},
		error: function(obj) {
			$('.server-response').css('background', 'red');
			$('#msgFromServer').text(obj.msg);
		}
	});

	//TODO: clear register form
});


$("#loginUserButton").click(function(e) {
	var userToLogin = {
		email: $('#userEmail').val(),
		password: $('#userPasswordLogin').val()
	};

	$.ajax({
		url: '/user/login',
		method: 'post',
		data: userToLogin,
		success: function(obj) {
			if (obj.success) {
				$('.server-response').css('background', 'blue');
				$('#msgFromServer').text(obj.msg);
				window.location.href = '/profile.html';
			} else {
				$('.server-response').css('background', 'yellow');
				$('#msgFromServer').text(obj.msg);
			}
		},
		error: function(obj) {
			$('.server-response').css('background', 'yellow');
			$('#msgFromServer').text(obj.msg);
		}
	});

});







// Get the Sidenav
var mySidenav = document.getElementById("mySidenav");

// Get the DIV with overlay effect
var overlayBg = document.getElementById("myOverlay");

// Toggle between showing and hiding the sidenav, and add overlay effect
function w3_open() {
	if (mySidenav.style.display === 'block') {
		mySidenav.style.display = 'none';
		overlayBg.style.display = "none";
	} else {
		mySidenav.style.display = 'block';
		overlayBg.style.display = "block";
	}
}

// Close the sidenav with the close button
function w3_close() {
	mySidenav.style.display = "none";
	overlayBg.style.display = "none";
}