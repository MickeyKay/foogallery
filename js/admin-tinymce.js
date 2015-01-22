(function() {
	tinymce.PluginManager.add('foogallery', function( editor, url ) {

		

		editor.on( 'LoadContent', function( event ) {
			if ( ! event.content ) {
				return;
			}

			var dom = editor.dom;

			// Replace the foogallery node with the shortcode
			tinymce.each( dom.select( 'div[data-foogallery]', event.node ), function( node ) {

				if ( !dom.hasClass(node, 'foogallery-tinymce-databound') ) {
					dom.addClass(node, 'foogallery-tinymce-databound');

					//we need to post to our ajax handler and get some gallery info
					var id = dom.getAttrib( node, 'data-foogallery-id'),
						nonce = jQuery('#foogallery-timnymce-action-nonce').val(),
						data = 'action=foogallery_tinymce_load_info&foogallery_id=' + id + '&nonce=' + nonce;

					jQuery.ajax({
						type: "POST",
						url: ajaxurl,
						data: data,
						dataType: 'JSON',
						success: function(data) {
							var titleDiv = dom.select( '.foogallery-tinymce-title', node),
								countDiv = dom.select( '.foogallery-tinymce-count', node),
								galleryImg = dom.select( '.foogallery-pile-inner-thumb', node );

							if (titleDiv && titleDiv.length) {
								titleDiv[0].textContent = data.name;
							}
							if (countDiv && countDiv.length) {
								countDiv[0].textContent = data.count;
							}
							if (galleryImg && galleryImg.length) {
								jQuery(galleryImg[0]).replaceWith('<img src="' + data.src + '" />');
							}
						}
					});
				}
			});
		});

		editor.on( 'PreProcess', function( event ) {
			var dom = editor.dom;

			// Replace the foogallery node with the shortcode
			tinymce.each( dom.select( 'div[data-foogallery]', event.node ), function( node ) {
				// Empty the wrap node
				if ( 'textContent' in node ) {
					node.textContent = '\u00a0';
				} else {
					node.innerText = '\u00a0';
				}
			});
		});

		editor.on( 'PostProcess', function( event ) {
			if ( event.content ) {
				event.content = event.content.replace( /<div [^>]*?data-foogallery="([^"]*)"[^>]*>[\s\S]*?<\/div>/g, function( match, shortcode ) {
					if ( shortcode ) {
						return '<p>' + window.decodeURIComponent( shortcode ) + '</p>';
					}
					return ''; // If error, remove the foogallery view
				});
			}
		});

		editor.on( 'mouseup', function( event ) {
			var dom = editor.dom,
				node = event.target,
				fg = getParentFooGallery( node );

			// Don't trigger on right-click
			if ( event.button !== 2 ) {



				if (fg) {
					//we have clicked somewhere in the foogallery element

					if (node.nodeName === 'A' && dom.hasClass(node, 'foogallery-tinymce-toolbar-edit')) {
						//alert('EDIT : ' + dom.getAttrib( fg, 'data-foogallery-id' ))
					} else if (node.nodeName === 'DIV' && dom.hasClass(node, 'foogallery-tinymce-toolbar-delete')) {
						//alert('DELETE : ' + dom.getAttrib( fg, 'data-foogallery-id' ))
						dom.remove(fg);
					} else {

						if (!dom.hasClass(fg, 'foogallery-tinymce-selected')) {
							unselectFooGallery(dom);
							dom.addClass(fg, 'foogallery-tinymce-selected');
						}

					}
				} else {
					unselectFooGallery(dom);
				}
			}
		});
	});
})();