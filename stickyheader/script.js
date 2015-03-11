window.onscroll = function() {
	var elem = document.getElementById('hd');
	var elem2 = document.body;
	var rectObject = elem.getBoundingClientRect();
	var rectObject2 = elem2.getBoundingClientRect();

	var headTop = rectObject.bottom;
	var winTop = -rectObject2.top;

	var compTops = headTop > winTop;

	if (compTops){
		elem.classList.remove("sticky");
	}
	else{
		elem.classList.add("sticky");
	}
};
