(function ($) {
	'use strict';

	var
	// Variables Declaration
	body = null,
	container = null,
	mobileMenu = null,
	resizeTime = null,
	loginForm = null,
	residenceField = null,

	// Show Mobile Menu after button is clicked
	_showMobileMenu = function (e) {
		e.preventDefault();
		body.addClass('show-mobile-menu');
		_checkLogoutPosition();
	},

	_checkLogoutPosition = function () {
		var win = $(window), nav = mobileMenu.find('nav');
		if (nav.height() + 50 > win.height()) mobileMenu.addClass('mobile-menu-resized');
		else mobileMenu.removeClass('mobile-menu-resized');
	},

	// Hide Mobile Menu after link is chosen
	_hideMobileMenu = function (e) {
		if (e.type === 'touchstart' && e.target.nodeName === 'A') return;
		body.removeClass('show-mobile-menu');
	},

	_radioButtonsChanger = function () {
		var elem = $(this), mobileElem;

		if (elem.hasClass('mobile-radio')) {
			elem.addClass('mobile-radio-checked')
				.siblings('.mobile-radio')
				.removeClass('mobile-radio-checked')
				.closest('.item').find('#' + elem.data('id'))
				.prop('checked', true)
				.trigger('change');
		}
		else {
			mobileElem = elem.closest('.item').find('.mobile-radio[data-id=' + elem.attr('id') + ']');
			mobileElem.addClass('mobile-radio-checked').siblings('.mobile-radio').removeClass('mobile-radio-checked');
		}
	},

	_toggleSection = function (e) {
		e.preventDefault();
		var btn = $(this),
			sectionToShow = '.' + btn.data('section');

		container.find('.mobile-section-block').addClass('hidden');
		container.find('.footer').removeClass('hidden-xs');
		container.find(sectionToShow).removeClass('hidden');
		window.scrollTo(0, 0);
	},

	_startChat = function (e) {
		e.preventDefault();
		var windowName = 'ChatPopUp',
			windowSize = 'width=660, height=520, left=300, top=200, toolbar=no, location=no, titlebar=no, resizable=no, menubar=no,status=no',
			chatWindow = window.open('', windowName, windowSize);
		try {
			if (chatWindow.location.href.indexOf('blank') > -1) {	// should break here because the URL is an external URL
				chatWindow.location.replace(ChatURL);
			}
		}
		catch (err) {}
		chatWindow.focus();
		return false;
	},

	setLayoutHeight = function () {
		var dHeight = $(window).outerHeight(),
			border = body.find('.body-border').length ? 16 : 0,
			footerH = body.find('.footer-container').outerHeight(),
			headerH = body.find('.header-container').outerHeight(),
			titleH = body.find('.top-title-container').outerHeight(),
			contentH = container.outerHeight();

		if (footerH + headerH + titleH + contentH < dHeight) container.height(dHeight - footerH - headerH - titleH - 30);
	},

	breadcrumbBg = function () {
		body.find('.breadcrumb-bg').css('width', ($(window).width() - container.find('.container').outerWidth()) / 2);
	},

	toggleTable = function () {
		var table = $(this).closest('.x-table, .x-panel'),
			isActive = !table.hasClass('inactive');

		table.toggleClass('inactive', isActive).find('.x-table-container, .panel-body')[isActive ? 'slideUp' : 'slideDown'](200);
	},

	// Initialize events and handlers
	_init = function () {
		body = $('body');
		container = $('#container');
		mobileMenu = $('#mobileNavigation');

		window.FastClick.attach(document.body);
		body.find('.loader-div').hide();

		$('input').placeholder();

		if (localStorage.getItem("chat") === 'collapsed') body.find('.chat-container').addClass('inactive');

		// EVENT LISTENERS
		//
		container
			.on('change click', 'input[type=radio], .mobile-radio', _radioButtonsChanger)
			.on('click', '.open-close, .bottom-collapse', toggleTable)
			.on('click', '.m-menu-icon', _showMobileMenu)
			.on('click', '.section-button', _toggleSection)
			.on('mouseenter', '.ttip', function () { $(this).find('.ttip-text').fadeIn(300); })
			.on('mouseenter', '.ttip', function () { $(this).find('.ttip-text').fadeIn(300); })
			.on('mouseleave', '.ttip', function () { $(this).find('.ttip-text').stop(true).fadeOut(100); })
			.on('mouseleave', '.ttip', function () { $(this).find('.ttip-text').stop(true).fadeOut(100); });

		container.find('.ssn-field').formatter({ 'pattern': '{{999}}-{{99}}-{{9999}}' });

		mobileMenu.on('click', _hideMobileMenu);

		body.on('click', 'a', function (e) { $.publish('app/show-loader', [e.target]); })
			.on('click', '.chat-now-button,#LiveChat', _startChat)
			.on('click', '.chat-close', function () {
				$(this).closest('.chat-container').addClass('inactive');
				localStorage.setItem('chat', 'collapsed');
			})
			.on('click', '.chat-collapsed', function () {
				$(this).closest('.chat-container').removeClass('inactive');
				localStorage.setItem('chat', '');
			});

		$(window).on('resize', function () {
			if (resizeTime) clearTimeout(resizeTime);
			resizeTime = setTimeout(_checkLogoutPosition, 300);
			breadcrumbBg();
		});

		setLayoutHeight();
		breadcrumbBg();
	};

	/// APP
	$.subscribe('app/ready', _init);

	$(document).ready(function () {
		$.publish('app/ready');
		try { window.Typekit.load(); } catch (e) { }
	});


})(jQuery);