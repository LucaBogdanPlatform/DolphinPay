$(document).ready(function() {
	var win = $(window);
	// Each time the user scrolls
	win.scroll(function() {
		// End of the document reached?
		if ($(document).height() - win.height() <= win.scrollTop()) {
			//$('#loading').show();
			/*$.ajax({
				url: 'get-post.php',
				dataType: 'html',
				success: function(html) {
					$('#scrollable-content').append(html);
					//$('#loading').hide();
				}
			});*/
			setTimeout(function(){
                for(var i = 0 ; i<5 ;i++){
                                    $('#scrollable-content').append(
                                            '<div class="media flex-column" style="border-radius:15px;">'+
                                            ' <br>'+
                                            '<span class="message_userpic">'+
                                            '<img class="d-flex mr-3" src="../img/user-header.png" alt="Generic user image"'+
                                            '<span class="user-status bg-success "></span>'+
                                            '</span>'+
                                            '<div class="media-body">'+
                                            '<h6 class="mt-0 mb-1">Chiosco delfino</h6>'+
                                            'Bibione, IT'+
                                            '</div>'+
                                            '<br>'+
                                            '</div>'
                                         );
                            }
            }, 2000);

		}
	});
});
