/*jslint white: true, nomen: true */
(function (win, doc) {

	'use strict';
	/*global window, document */
	/*global APP, doT */

	win.APP = win.APP || {};

	var templateMaster;

	templateMaster = {
		templateSelector: 'script[type="text/x-template"]',
		tmplText: {},
		tmplFn: {},

		init: function () {

			var templates = doc.querySelectorAll(this.templateSelector);

			Array.prototype.forEach.call(templates, function(tmplNode) {

				var name = tmplNode.getAttribute('data-name'),
					text = tmplNode.textContent;

				this.tmplText[name] = text;
				this.tmplFn[name] = doT.template(text);

				tmplNode.parentNode.removeChild(tmplNode);

			}, this);

		}

	};

	win.APP.templateMaster = templateMaster;

}(window, document));

