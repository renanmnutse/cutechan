/*
 * Houses both the actual options controler and the options panel renderring
 * logic
 */

var _ = require('underscore'),
	$ = require('jquery'),
	Backbone = require('backbone'),
	background = require('./background'),
	banner = require('./banner'),
	common = require('../common'),
	lang = require('../lang/'),
	main = require('./main'),
	state = require('./state');

var notMobile = !main.isMobile;

// Try to get options from local storage
var options;
try {
	options = JSON.parse(localStorage.options);
}
catch(e) {
}
if (!options)
	options = {};
options = module.exports = new Backbone.Model(options);

// Persists entire model to localStorage on change
options.on('change', function() {
	try {
		localStorage.options = JSON.stringify(options);
	}
	catch(e) {
	}
});

var optionsCollection = new Backbone.Collection();
const tabs = ['General', 'Style', 'ImageSearch', 'Fun', 'Shortcuts'];

// Controller template for each individual option
var OptionModel = Backbone.Model.extend({
	initialize: function(obj) {
		// Condition for loading option. Optional.
		if (obj.load !== undefined && !obj.load)
			return;
		this.set(obj);
		// No type = checkbox + default false
		if (!obj.type)
			this.set({type: 'checkbox', default: false});
		/*
		 * Read label and tooltip from the language file. If .lang is defined,
		 * use it as localisation function instead and pass the option id as
		 * argument.
		 */
		const lang = main.oneeSama.lang.opts;
		var label, tooltip;
		if (obj.lang) {
			label = lang[obj.lang][0](obj.id);
			tooltip = lang[obj.lang][1](obj.id);
		}
		else {
			label = lang[obj.id][0];
			tooltip  = lang[obj.id][1];
		}
		this.set({
			label: label,
			tooltip: tooltip
		});
		/*
		 * Some options differ per board. Store the id that will be used in the
		 * options model for searching purposes.
		 */
		var id = obj.id;
		if (obj.boardSpecific)
			id = 'board.' + state.page.get('board') + '.' + id;
		this.set('storedId', id);

		if (obj.exec !== undefined) {
			var opts = {};
			opts['change:' + id] = this.execListen;
			this.listenTo(options, opts);
			// Execute with current value
			obj.exec(this.getValue());
		}
		optionsCollection.add(this);
	},
	// Set the option, taking into acount board specifics
	setStored: function(val) {
		options.set(this.get('storedId'), val);
	},
	// Return default, if unset
	getValue: function() {
		const val = options.get(this.get('storedId'));
		return val === undefined ? this.get('default') : val;
	},
	validate: function(val) {
		const valid = this.get('validation');
		return valid ? valid(val) : true;
	},
	// Exec wrapper for listening events
	execListen: function(model, val) {
		this.get('exec')(val);
	}
});

/* LANGUAGE SELECTION */
new OptionModel({
	id: 'lang',
	type: state.config.get('LANGS'),
	tab: 'General',
	default: state.config.get('DEFAULT_LANG'),
	exec: function(type) {
		$.cookie('lang', type);
		main.oneeSama.lang = lang[type];
	}
});
/* INLINE EXPANSION */
new OptionModel({
	id: 'inlinefit',
	type: ['none', 'full', 'width', 'height', 'both'],
	tab: 'Style',
	default: 'width'
});
/* THUMBNAIL OPTIONS */
new OptionModel({
	id: 'thumbs',
	boardSpecific: true,
	type: common.thumbStyles,
	tab: 'Style',
	default: 'small',
	exec: function(type) {
		$.cookie('thumb', type);
		main.oneeSama.thumbStyle = type;
	}
});
/* IMAGE HOVER EXPANSION */
new OptionModel({
	id: 'imageHover',
	load: notMobile,
	tab: 'General',
});
new OptionModel({
	id: 'webmHover',
	load: notMobile,
	tab: 'General'
});
/* Autogif TOGGLE */
new OptionModel({
	id: 'autogif',
	load: notMobile,
	tab: 'Style',
	exec: function(autogif) {
		$.cookie('agif', autogif, {path: '/'});
		main.oneeSama.autoGif = autogif;
	}
});
/* SPOILER TOGGLE */
new OptionModel({
	id: 'noSpoilers',
	boardSpecific: true,
	type: 'checkbox',
	tab: 'Style',
	default: true,
	exec: function(spoilertoggle) {
		$.cookie('spoil', spoilertoggle, {path: '/'});
		main.oneeSama.spoilToggle = spoilertoggle;
	}
});
/* BACKLINKS */
new OptionModel({
	id: 'nobacklinks',
	type: 'checkbox',
	tab: 'General',
	default: true,
	// TODO: Implement backlinks in models.js
	exec: function() {}
});
/* LINKIFY TEXT URLS */
new OptionModel({
	id: 'linkify',
	tab: 'General',
	exec: function(toggle) {
		$.cookie('linkify', toggle, {path: '/'});
	}
});
/* DESKTOP NOTIFICATIONS */
new OptionModel({
	id: 'notification',
	load: notMobile,
	tab: 'General',
	exec: function(notifToggle) {
		if (notifToggle && (Notification.permission !== "granted"))
			Notification.requestPermission();
	}
});
/* ANONIMISE ALL POSTER NAMES */
new OptionModel({
	id: 'anonymise',
	tab: 'General'
});
/* RELATIVE POST TIMESTAMPS */
new OptionModel({
	id: 'relativeTime',
	tab: 'General',
	exec: function(toggle) {
		$.cookie('rTime', toggle, {path: '/'});
	}
});
/* R/A/DIO NOW PLAYING BANNER */
new OptionModel({
	id: 'nowPlaying',
	load: notMobile && state.config.get('RADIO'),
	type: 'checkbox',
	tab: 'Fun',
	default: true,
	exec: function(toggle) {
		if (toggle)
			banner.view.clearRadio();
		// Query the server for current stream info
		else
			main.send([common.RADIO]);
	}
});
/* IMAGE SEARCH LINK TOGGLE */
['google', 'iqdb', 'saucenao', 'foolz', 'exhentai'].forEach(function(search) {
	$('<style/>', {id: search + 'Toggle'})
		.html('.' + search + '{display:none;}')
		.appendTo('head');

	new OptionModel({
		id: search,
		// Use a custom internatiolisation function
		lang: 'imageSearch',
		tab: 'ImageSearch',
		exec: function(toggle) {
			$('#' + search + 'Toggle').prop('disabled', toggle);
		}
	});
});
/* ILLYA DANCE */
var illyaDance = new OptionModel({
	id: 'illyaBGToggle',
	load: notMobile && state.hotConfig.get('ILLYA_DANCE'),
	boardSpecific: true,
	tab: 'Fun',
	exec: function(illyatoggle) {
		var muted = ' ';
		if (options.get('illyaMuteToggle'))
			muted = 'muted';
		var dancer = '<video autoplay ' + muted + ' loop id="bgvid" >' +
			'<source src="' + mediaURL + 'illya.webm" type="video/webm">' +
			'<source src="' + mediaURL + 'illya.mp4" type="video/mp4">' +
			'</video>';
		if (illyatoggle)
			$("body").append(dancer);
		else
			$("#bgvid").remove();
	}
});
new OptionModel({
	id: 'illyaMuteToggle',
	load: notMobile && state.hotConfig.get('ILLYA_DANCE'),
	boardSpecific: true,
	tab: 'Fun',
	exec: function() {
		if (options.get('illyaBGToggle')) {
			illyaDance.exec(false);
			illyaDance.exec(true);
		}
	}
});
/* HORIZONTAL POSTING */
new OptionModel({
	id: 'horizontalPosting',
	boardSpecific: true,
	tab: 'Fun',
	exec: function(toggle) {
		var style = '<style id="horizontal">article,aside{display:inline-block;}</style>';
		if (toggle)
			$('head').append(style);
		else
			$('#horizontal').remove();
	}
});
/* REPLY AT RIGHT */
new OptionModel({
	id: 'replyright',
	tab: 'Style',
	exec: function(r) {
		if (r)
			$('<style/>', {
				id: 'reply-at-right',
				text: 'aside { margin: -26px 0 2px auto; }',
			}).appendTo('head');
		else
			$('#reply-at-right').remove();
	}
});
/* THEMES */
new OptionModel({
	id: 'theme',
	boardSpecific: true,
	// Arrays will turn into selection boxes
	type: [
		'moe',
		'gar',
		'mawaru',
		'moon',
		'ashita',
		'console',
		'tea',
		'higan',
		'rave',
		'tavern',
		'glass'
	],
	tab: 'Style',
	default: state.hotConfig.get('BOARD_CSS')[state.page.get('board')],
	exec: function(theme) {
		if (theme) {
			var css = hotConfig.css[theme + '.css'];
			$('#theme').attr('href', state.imagerConfig.get('MEDIA_URL')
				+ 'css/' + css);
		}
		// FIXME: temp stub
		// Call the background controller to generate, remove and/or append the glass
		//background.glass(theme);
	}
});
/* CUSTOM USER-SET BACKGROUND */
new OptionModel({
	id: 'userBG',
	load: notMobile,
	tab: 'Style',
});
new OptionModel({
	id: 'userBGimage',
	load: notMobile,
	type: 'image',
	tab: 'Style',
	// FIXME
	//exec: background.set
});
/* LAST N CONFIG */
new OptionModel({
	// Key name in the options model
	id: 'lastn',
	// Type of toggle
	type: 'number',
	// Tab of options panel
	tab: 'General',
	// Function for assesing if value is valid. Optional.
	validation: common.reasonable_last_n,
	default: state.hotConfig.get('THREAD_LAST_N'),
	// Function to execute on change. Optional.
	exec: function(n) {
		main.oneeSama.lastN = n;
		$.cookie('lastn', n, {path: '/'});
	}
});
/* KEEP THREAD LENGTH WITHIN LASTN */
new OptionModel({
	id: 'postUnloading',
	tab: 'General',
});
/* LOCK TO BOTTOM EVEN WHEN DOCUMENT HIDDEN*/
new OptionModel({
	id: 'alwaysLock',
	tab: 'General',
});
/* SHORTCUT KEYS */
[
	{
		id: 'new',
		default: 78,
	}, {
		id: 'togglespoiler',
		default: 73,
	}, {
		id: 'textSpoiler',
		default: 68,
	}, {
		id: 'done',
		default: 83,
	}, {
		id: 'expandAll',
		default: 69,
	}
].forEach(function(short) {
	short.type = 'shortcut';
	short.tab = 'Shortcuts';
	new OptionModel(short);
});

// Highlight options button, if no options are set
(function() {
	if (localStorage.getItem('options'))
		return;
	var $el = $('#options');
	$el.addClass('noOptions');

	function fadeout() {
		$el.filter('.noOptions').fadeOut(fadein);
	}

	function fadein() {
		$el.fadeIn();
		// Stop animation, if options pannel is opened
		if ($el.filter('.noOptions').length)
			fadeout();
	}

	fadeout();

	$el.click(function() {
		$el.removeClass('noOptions');
	});
})();

// Render options panel
var OptionsView = Backbone.View.extend({
	initialize: function() {
		this.render();
	},
	tagName: 'div',
	className: 'bmodal',
	id: 'options-panel',
	render: function() {
		var $tabSel = $('<ul/>', {class: 'option_tab_sel'}),
			$tabCont = $('<ul/>', {class: 'option_tab_cont'});
		// Render tabs
		tabs.forEach(function(tab) {
			$('<li/>').append(
				$('<a/>', {
					'data-content': tab,
					href: '#' + tab,
					class: tab
				})
				.html(tab)
				)
				.appendTo($tabSel);
			$('<li/>', {
				'data-content': tab,
				class: tab
			})
				.appendTo($tabCont);
		});
		// Render all the options
		optionsCollection.models.forEach(function(model) {
			var $tab = $tabCont.children('.' + model.get('tab')),
				$input;
			const val = model.getValue(),
				type = model.get('type'),
				id = model.get('id'),
				tooltip = model.get('tooltip');

			if (type == 'checkbox') {
				$input = $('<input/>', {
					type: 'checkbox',
					checked: val
				});
			}
			else if (type == 'number') {
				$input = $('<input/>', {
					width: '4em',
					maxlength: 4,
					val: val
				});
			}
			else if (type == 'image') {
				$input = $('<input/>', {
					type: 'file'
				});
			}
			else if (type instanceof Array) {
				$input = $('<select/>');
				type.forEach(function(opt) {
					$input.append('<option value="' + opt + '">'
						+ (main.oneeSama.lang[opt] || opt) + '</option>');
				});
				$input.val(model.getValue());
			}
			else if (type == 'shortcut') {
				$tab.append('Alt+');
				$input = $('<input/>', {
					id: id,
					maxlength: 1,
					val: String.fromCharCode(val)
				});
			}
			$tab.append([
				$input.attr({
					id: id,
					title: tooltip
				}),
				$('<label/>', {
					for : id,
					title: tooltip
				})
					.html(model.get('label')),
				'<br>'
			]);
		});

		var $general = $tabCont.children().first();
		// Show the first tab by default
		$tabSel.children().first().addClass('tab_sel');
		$general.addClass('tab_sel');

		// Configuration export and import links
		$general.append([
			'<br>',
			$('<a/>', {
				title: "Export settings to file",
			})
				.html('Export')
				// A bit roundabout, but we need to generate the file on click,
				// not link render
				.click(function() {
					var a = document.createElement('a');
					a.setAttribute('href',
						window.URL.createObjectURL(new Blob(
							[JSON.stringify(localStorage)], {
							type: 'octet/stream'
						})));
					a.setAttribute('download', 'meguca-config.json');
					a.click();
				}),
			' ',
			$('<a/>', {
				title: 'Import settings from file'
			})
				.html('Import')
				.click(function(e) {
					// Proxy to hidden file input
					e.preventDefault();
					var $input = $('#importSettings');
					$input.click();
					$input.one('change', function() {
						var reader = new FileReader();
						reader.readAsText($input[0].files[0]);
						reader.onload = function(e) {
							var json;
							// In case of curruption
							try {
								json = JSON.parse(e.target.result);
							}
							catch(e) {
								alert('Import failed. File corrupt');
							}
							if (!json)
								return;
							localStorage.clear();
							for (var key in json) {
								localStorage[key] = json[key];
							}
							alert('Import successfull. The page will now reload.');
							location.reload();
						};
					});
				}),
			$('<input/>', {
				type: 'file',
				style: 'display: none;',
				id: 'importSettings',
				name: 'Import Settings'
			}),
			'<br>'
		]);

		this.$el.append($tabSel, $tabCont);
		this.$el.appendTo('body');
	},
	events: {
		'click .option_tab_sel>li>a': 'switchTab',
		'change': 'applyChange'
	},
	switchTab: function(event) {
		event.preventDefault();
		var $a = $(event.target);
		// Unhighight all tabs
		this.$el.children('.option_tab_sel').find('a').removeClass('tab_sel');
		// Hightlight the new one
		$a.addClass('tab_sel');
		// Switch tabs
		var $li = this.$el.children('.option_tab_cont').children('li');
		$li.removeClass('tab_sel');
		$li.filter('.' + $a.data('content')).addClass('tab_sel');
	},
	applyChange: function(event) {
		const target = event.target;
		var	val,
			model = optionsCollection.findWhere({
				id: target.id
			});
		if (!model)
			return;
		var type = model.get('type');
		if (type == 'checkbox')
			val = !!target.checked;
		else if (type == 'number')
			val = parseInt(val);
		// Not recorded; extracted directly by the background handler
		else if (type == 'image')
			// FIXME
			return; //background.genCustom(target.result);
		else if (type == 'shortcut')
			val = target.val.charCodeAt(0);
		else
			val = target.value;

		if (!model.validate(val))
			return target.val = '';
		model.setStored(val);
	}
});

var optionsView;
// Render it after the current stack clears,for a bit more responsiveness
_.defer(function() {
	optionsView = new OptionsView();
});

// TODO: BoardSpecific option unloading code for inter-board push state navigation