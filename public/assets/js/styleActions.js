var triggerArrow =  document.getElementById('arrowShowNHide');
var triggerArrowBack = document.getElementById('btnSmallSideBar');
var isSideBarBig = false;

$(".navStatus").removeClass("active");
$(".miniNavOptions").removeClass("active");
if(window.location.pathname.substr(9) == "availability") {
	$(".nav5J").addClass("active");
	$(".miniNav5J").addClass("miniNavActive");
}else if(window.location.pathname.substr(9)== "record"){
	$(".navRecord").addClass("active");
	$(".miniNavRecord").addClass("miniNavActive");
}else if(window.location.pathname.substr(9) == "IBEavailability"){
	$(".navIBE").addClass("active");
	$(".miniNavIBE").addClass("miniNavActive");
}else{

}

$( window ).resize(function() {
	var timeInputWidth = $('#txtDepartureTime').width();
	$('.ui-timepicker-wrapper').width(timeInputWidth);

	if ($(window).width() < 992) {
		document.getElementById('btnSmallSideBar').setAttribute("style","display:none;");
	    $("#main").width("100%"); 
	    document.getElementById('expand-on-click').setAttribute("style","display:none;");
	    document.getElementById('hide-on-small').setAttribute("style","display:block;");
	}	
	else {
		document.getElementById('btnSmallSideBar').setAttribute("style","display:block;");
		if(isSideBarBig){
			$("#main").width("calc(100% - 260px)");
			document.getElementById('expand-on-click').setAttribute("style","display:none;");
	    	document.getElementById('hide-on-small').setAttribute("style","display:block;");
		}else{
			$("#main").width("calc(100% - 60px)");
			document.getElementById('expand-on-click').setAttribute("style","display:block;");
	    	document.getElementById('hide-on-small').setAttribute("style","display:none;");
		}
		
	}
});	



function changeSideBarBigger() {

	isSideBarBig = true;

	$("#main").width("calc(100% - 260px)");

	document.getElementById('expand-on-click').setAttribute("style","display:none;");
	$(".sidebar").animate(
		{width: "260px"},
		{duration: 500,
    	complete: function() {
    		document.getElementById('hide-on-small').setAttribute("style","display:block;");
			
		}}
	);
    	
}

function changeSideBarSmaller() {

	isSideBarBig = false;

	$("#main").width("calc(100% - 60px)");

	document.getElementById('hide-on-small').setAttribute("style","display:none;");
	$(".sidebar").animate(
		{width: '60px'},
		{duration: 500,
    	complete: function() {
    		document.getElementById('expand-on-click').setAttribute("style","display:block;");
			
		}}
	);
    	
}

triggerArrow.onclick = changeSideBarBigger;
triggerArrowBack.onclick = changeSideBarSmaller;