$(function(){
	var journeyDetail = jQuery('#journeyDetail'),
	cabDetail = jQuery('#cabDetail'),
	snapURI = jQuery('#snapURI'),
	submitButton = jQuery('#saveDetailsButton'),
	cameraButton = jQuery('#cameraButton'),
	wrapper = jQuery('#wrapper'),
	pictureSource, destinationType, db;

 function initDB(tx) {
         tx.executeSql('CREATE TABLE IF NOT EXISTS cabData (id unique, data)');
         tx.executeSql('INSERT INTO DEMO (id, data) VALUES (1, "First row")');
         tx.executeSql('INSERT INTO DEMO (id, data) VALUES (2, "Second row")');
    }

    // Transaction error callback
    //
    function dbErrorHandler(tx, err) {
        alert("Error processing SQL: "+err);
    }

    // Transaction success callback
    //
    function dbSuccess() {
        alert("success!");
    }

    document.addEventListener("deviceready",onDeviceReady,false);

    function onDeviceReady() {
      pictureSource=navigator.camera.PictureSourceType;
      destinationType=navigator.camera.DestinationType;

	  	db = window.openDatabase("sekure", "1.0", "sekure", 20000);
        db.transaction(initDB, dbErrorHandler, dbSuccess);
    }

    

		//a dirty hack to animate collapsible
	// jQuery('#set1').on('expand', function () {
	//     jQuery(this).children().next().hide();
	//     jQuery(this).children().next().slideDown(200);
	// }).on('collapse', function () {
 	//     jQuery(this).children().next().slideUp(200);
	// });

		//TODO create this at page init
	var localData = localStorage;
	var length = localStorage.length;

	for(var i=0; i<length; i++) {
		var tempLocalData = localStorage[i];
	}

		// Add new details
	submitButton.on('touchend', function(e){
		e.preventDefault();
		$.publish('/addNew/', []);
	});

		// take a snap
	cameraButton.on('touchend', function(e){
		e.preventDefault();
		$.publish('/takeSnap/', []);
	});

	//TODO Delete details


	//TODO Clear all

		//TODO find a way to do this using pub/sub
	function onPhotoDataSuccess(imageData) {
	    alert(imageData);
	    snapURI.val(imageData);
      	var smallImage = document.getElementById('smallImage');
      	smallImage.style.display = 'block';
      	smallImage.src = snapURI.val();
    }

    function onFail(message) {
      alert('Something went wrong. Please restart app.');
    }

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

			//data = JSON.stringify(data);

			//localStorage.setItem(
				//now, data
				//);
			sekure.saveRecord(data)
			

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

	$.subscribe('/takeSnap/', function(){
		navigator.camera.getPicture(onPhotoDataSuccess, onFail, { 
	      quality: 50,
	      destinationType: destinationType.FILE_URI,
	      encodingType: Camera.EncodingType.JPEG, 
	      saveToPhotoAlbum: true
	      });
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

	$.subscribe('/clearAll/', function(){
			//TODO function to clear all images stored
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