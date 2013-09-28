$(function(){
	var journeyDetail = jQuery('#journeyDetail'),
	cabDetail = jQuery('#cabDetail'),
	snapURI = jQuery('#snapURI'),
	submitButton = jQuery('#saveDetailsButton'),
	wrapper = jQuery('#wrapper');

		//a dirty hack to animate collapsible
	jQuery('#set1').on('expand', function () {
	    jQuery(this).children().next().hide();
	    jQuery(this).children().next().slideDown(200);
	}).on('collapse', function () {
   		jQuery(this).children().next().slideUp(200);
	});

	//TODO Load previously saved data


		// Add new details
	submitButton.on('click', function(e){
		e.preventDefault();
		$.publish('/addNew/', []);
	});


	//TODO Delete details


	//TODO Clear all


	//Subscribes
	$.subscribe('/addNew/', function(){
		var _journeyDetail = journeyDetail.val() || 'Location not mentioned' //TODO get Geolocation

		if (cabDetail.val() !== '') {
			var now = Date.now(),
			data = new Object();

			data.journeyDetail = _journeyDetail;
			data.cabDetail = cabDetail.val();
			data.snapURI = snapURI.val();
			data.date = now;

			data = JSON.stringify(data);

			localStorage.setItem(
				now, data
			);

			//TODO Add item to template

			$.publish('/recreate/', []);

			$.publish('/clear/', [true]);

			$.publish('/message/', ["Data successfully saved"]);
		} 
		else {
			$.publish('/clear/', []);

			$.publish('/message/', ["Vehicle Number Missing."]);
		}

	});

	$.subscribe('/recreate/', function(){
		//TODO
	});

	$.subscribe('/clear/', function(collapse){
		jQuery('#journeyDetail').val('');
		jQuery('#cabDetail').val('');
		jQuery('#snapURI').val('');

		if(collapse){
			jQuery( "#set1" ).trigger( "collapse" );
		}
	});

	//TODO create a clear all
	$.subscribe('/clearAll/', function(){
			//function to clear all images stored
		localStorage.clear();
		jQuery('.wrapper').empty();
	});

	$.subscribe('/message/', function(message){
		var self = jQuery('#popupMessage');
		var prepareMessage = '<p>' + message + '</p>';
		self.html(prepareMessage);
		
		self.popup('open', {positionTo: 'window'});

		var tempTimeout = setTimeout(function(){
    			jQuery('#popupMessage').popup('close');
    			clearTimeout(tempTimeout);
			}, 2000);
	});

});