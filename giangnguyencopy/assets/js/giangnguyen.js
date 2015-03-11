$('body > *').css("visibility", "hidden");
$(document).ready(function() {
	setTimeout(function() {
    	$('body > *').hide().css("visibility", "visible").fadeIn(1000)
	});
});



/* navigation changes on scrolling */

$(window).scroll(function () {
	
	if ($(window).scrollTop() > 400) { 
        $('body#index #index_link').fadeIn(200);
    } else {
        $('body#index #index_link').fadeOut(200);
    }

	var scrollBottom = $(document).height() - $(window).height() - $(window).scrollTop();
	
	if (scrollBottom <= 50) {
		$('#index nav a').css({'color': '#FBF9F6', 'border-color': '#FBF9F6'});
		
	} else {
	    $('#index nav a').css({'color': '#222222', 'border-color': '#222222'});
	}
});



/* scroll down / up */

$(document).ready(function() {
     $('a[href*=#]').click(function(){
		$('html, body').animate({
    		scrollTop: $( $.attr(this, 'href') ).offset().top
		}, 500);
	return false;
	});
	$('body#index #index_link').click(function(){
		$('html, body').animate({
    		scrollTop: 0
		}, 500);
	return false;
	});
	$('#back_to_top').click(function(){
		$('html, body').animate({
    		scrollTop: 0
		}, 500);
	return false;
	});
});



/* welcome text */

$(document).ready(function() {
	sayHello();
	setInterval('sayHello()', 10000);
});

function sayHello() {
	var now = new Date();
	var month = now.getMonth();
	var date = now.getDate();
	var hours = now.getHours();
	var msg;
	if (date == 1 && month == 0) {
		msg = "happy new year.";
	} else if (date == 24 && month == 11) {
		msg = "merry christmas."
	} else if (hours < 12) {
	   	msg = "good morning.";
	} else if (hours < 18) {
	   	msg = "good afternoon.";
	} else {
	  	msg = "good evening.";
	}
	$('#header_hello h2').text(msg);
}


/* profile text scrolling */

$(document).ready(function() {
	setupRotator();
});


function setupRotator() {
    if($('.text-item').length > 1) {
		$('.text-item:first').addClass('current').fadeIn(500);
        var interval = setInterval('textRotate()', 5000);
	}
}
function textRotate() {
    var current = $('#random > .current');
	if(current.next().length == 0) {
    	current.removeClass('current').fadeOut(500);
    	current.dequeue();
		$('.text-item:first').addClass('current').fadeIn(500);
	} else {
    	current.removeClass('current').fadeOut(500);
    	current.dequeue();
        current.next().addClass('current').fadeIn(500);
    }
}


/* profile background */

$(document).ready(function() {
	var link = "bg_0" + Math.floor(Math.random()*5) + ".jpg";
	$('#info').css('background-image', 'url(' + template_url + '/img/' + link + ')');
});



/* nav styling */

$(document).ready(function() {
	$('nav a').css({
		'padding-bottom': 8, 
	});
	$('nav a')
	.mouseover(function() {
		$(this).animate({
			'padding-bottom': 4, 
		}, 100);
	})
	.mouseout(function() {
		$(this).animate({
			'padding-bottom': 8, 
		}, 100); 
	});
});


/* profile background */

$(document).ready(function() {
	var link = "bg_0" + Math.floor(Math.random()*5) + ".jpg";
	$('#info').css('background-image', 'url(' + template_url + '/img/' + link + ')');
});



