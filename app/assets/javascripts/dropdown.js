
// Create the dropdown menus
function load_dropdowns() {

	$('.first-item').click(function(evt) {
		$(this).next('.query-menu').toggle('fade', {}, 'fast');
	});

	$('.top-level-item').click(function(evt) {
		if ($(this).hasClass('open')) return;
		
		var currOpen = $(this).parents('.query-menu').find('.open');
		currOpen.children().children().toggle(function() {
			$(this).children().children().toggle('slide', {direction: 'left'}, 'fast');
		});

		currOpen.removeClass('open');
		$(this).addClass('open');
	});

	$('.top-level-item, .sub-item').click(function(evt) {
		if (evt.target !== this) return;
		$(this).children().children().toggle('slide', {direction: 'left'}, 'fast');
	});

	$('.leaf-item').click(function(evt) {
		var menuParent = $(this).parents('.query-menu');
		var formParent = $(this).parents('.query');
		var label = $(this).text();
		var val = $(this).data('form-value');

		menuParent.find('.selected').removeClass('selected');
		$(this).addClass('selected');
		formParent.find('.first-item a').text(label);
		formParent.find('.church-property-hidden').val(val);
		menuParent.toggle('fade', {}, 'fast');
	});

}
