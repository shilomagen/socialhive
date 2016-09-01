/**
 * Created by Tomer on 8/30/2016.
 */
$(document).ready(function(){
    $("#createEvent").hide();
    $("#userProfile").hide();
    $("#eventManagerYourEvents").hide();
    $("#addParticipants").hide();
    $("#eventManagerInvitedEvents").hide();
    $("#eventInfo").hide();



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


});



function onButtonClick_GetItemInfo()
{
    var nameOfItem = document.getElementById("itemInfo").value;

    saveItem(nameOfItem);
}


function saveItem(nameOfItem){
    var closeSpan = $('<span />');
    closeSpan.text('x').addClass('w3-closebtn w3-margin-right w3-large').on('click', function(){
        this.parentElement.style.display='none';
    });
    var listItem = $('<li />').text(nameOfItem).append(closeSpan);
    $('#listItems').append(listItem);
}



// Get the Sidenav
var mySidenav = document.getElementById("mySidenav");

// Get the DIV with overlay effect
//var overlayBg = document.getElementById("myOverlay");

