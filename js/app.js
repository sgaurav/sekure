$(function(){
	var journeyDetail = jQuery('#journeyDetail'),
	cabDetail = jQuery('#cabDetail'),
	snapURI = jQuery('#snapURI'),
	submitButton = jQuery('#saveDetailsButton'),
	wrapper = jQuery('#wrapper');



	//TODO Load previously saved data


	// Add new details
	submitButton.on('click', function(e){
		e.preventDefault();
		$.publish('/addNew/', []);
	});


	//TODO Remove details


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

			$.publish('/clear/', []);
		} else {

			$.publish('/clear/', []);
			//TODO put error message here
		}

	});

	$.subscribe('/recreate/', function(){
		//TODO
	});

	$.subscribe('/clear/', function(){
		jQuery('#journeyDetail').val('');
		jQuery('#cabDetail').val('');
		jQuery('#snapURI').val('');

		jQuery( "#set1" ).trigger( "collapse" );

	});

	//TODO create a clear all
	$.subscribe('/clearAll', function(){
			//function to clear all images stored
		localStorage.clear();
		jQuery('.wrapper').empty();
	});

});