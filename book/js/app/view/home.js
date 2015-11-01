/*jslint white: true, nomen: true */
(function (win) {

	'use strict';
	/*global window, Backbone, $, templateMaster, APP */

	win.APP = win.APP || {};

	win.APP.BB = win.APP.BB || {};

	APP.BB.HomeView = APP.BB.BaseView.extend({

		events: {
			'click .js-story-by-story': 'setStoryByStory',
			'click .js-title-book-wrapper': 'openBook'
			//'click .js-show-popup': 'testShowPopup'
		},

		initialize: function () {

			var view = this,
				hintViewAutoplay;

			view.$el = $(view.tmpl.home({
				shelf: view.getBooksOnShelfNumber()
				//booksOnShelf:
			}));

			view.proto.initialize.apply(view, arguments);

			view.bindEventListeners();

			view.render();

			view.setVerticalSwiper();

			view.scrollToTop();

			// show hint if needed
			if ( !view.info.hintIsDone('autoplay') ) {
				hintViewAutoplay = new win.APP.BB.HintView({ name: 'autoplay' });
				hintViewAutoplay.onHide(function () {
					if ( view.info.isNormal ) {
						new win.APP.BB.HintView({ name: 'removeAds' });
					} else {
						new win.APP.BB.HintView({ name: 'thanksForBuy' });
					}
				});
			}

			//win.APP.bg.changeBg();

		},

		getBooksOnShelfNumber: function () {

			var view = this,
				device = win.APP.bb.device,
				remSize = view.info.get('remSize', true),
				bookWidth = 8.8, // SEE CSS
				availableWidth = device.get('width') / remSize,
				booksOnShelf = Math.floor(availableWidth / bookWidth),
				firstBookMarginLeft = (availableWidth % bookWidth) / 2 + 0.6; // SEE CSS

			return {
				firstBookMarginLeft: firstBookMarginLeft + 'rem',
				booksOnShelf: booksOnShelf
			};

		},

		setStoryByStory: function (e) {

			var view = this,
				$this = $(e.currentTarget),
				info = view.info,
				lang = win.APP.lang,
				notification = lang.get('notification'),
				popupText,
				isStoryByStory = info.get('storyByStory') === 'on';

			if (isStoryByStory) {
				$this.removeClass('active-on-off');
				info.set('storyByStory', 'off');
				popupText = notification.storyByStoryOff;
			} else {
				$this.addClass('active-on-off');
				info.set('storyByStory', 'on');
				popupText = notification.storyByStoryOn;
			}

			view.showPopup({
				name: 'notification',
				timeout: 3e3,
				data: {
					text: popupText
				}
			});

		},

		bindEventListeners: function () {

			var view = this,
				device = win.APP.bb.device,
				rateUsTimeoutId;

			view.listenTo(device, 'change:orientation', function () {
				$('.js-hint-wrapper').trigger('hide', { doNotTrack: true });
				view.loadUrl();
			});

			rateUsTimeoutId = setTimeout(function () {
				// check for rate up popup
				if ( Date.now() - view.info.get('installTime') > 20e3 ) {
					view.rateUsPopup();
				}
			}, 2e3);

			view.set('rateUsTimeoutId', rateUsTimeoutId);

		},

		unbindEventListeners: function () {

			var view = this,
				device = win.APP.bb.device,
				rateUsTimeoutId = view.get('rateUsTimeoutId');

			view.stopListening(device);

			view.get('vertical-swiper').destroy();

			clearTimeout(rateUsTimeoutId);

		},

		openBook: function (e) {

			var view = this,
				$node = $(e.currentTarget),
				isClicked = $node.attr('data-is-clicked');

			if (isClicked) {
				view.routeByUrl($node.attr('data-js-route'), true);
				return;
			}

			$node
				.attr('data-is-clicked', '1')
				.addClass('book-titles-wrapper-clicked');

		}

		//testShowPopup: function () {
		//
		//	var view = this;
		//
		//	view.showPopup({
		//		name: 'popup-text',
		//		//timeout: 2.5e3,
		//		sound: {
		//			sound: 'good-answer.mp3',
		//			isLoop: false,
		//			road: 3
		//		},
		//		data: {
		//			text: 'TEXT!!!!!!!!!'
		//		}
		//		//,onHide: { // see popup view source code
		//		//	fn: 'newQuestion',
		//		//	context: view
		//		//}
		//	});
		//
		//}


	});

}(window));