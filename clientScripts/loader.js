/*
 Selects and loads the client files
 Use only pure ES5.
*/

(function () {
	// Check for browser compatibility by trying to detect some ES6 features
	function check(func) {
		try {
			return eval('(function(){' + func + '})();')
		}
		catch(e) {
			return false
		}
	}

	var tests = [
		// Arrow functions
		'return (()=>5)()===5;',
		// Block scopped const
		'"use strict";  const bar = 123; {const bar = 456;} return bar===123;',
		// Block-scoped let
		'"use strict"; let bar = 123;{ let bar = 456; }return bar === 123;',
		// Computed object properties
		"var x='y';return ({ [x]: 1 }).y === 1;",
		// Shorthand object properties
		"var a=7,b=8,c={a,b};return c.a===7 && c.b===8;",
		// Template strings
		'var a = "ba"; return `foo bar${a + "z"}` === "foo barbaz";',
		// for...of
		'var arr = [5]; for (var item of arr) return item === 5;',
		// Spread operator
		'return Math.max(...[1, 2, 3]) === 3',
		// Class statement
		'"use strict"; class C {}; return typeof C === "function"',
		// Super call
		'"use strict"; var passed = false;'
			+ 'class B {constructor(a) {  passed = (a === "barbaz")}};'
			+ 'class C extends B {constructor(a) {super("bar" + a)}};'
			+ 'new C("baz"); return passed;',
		// Promises
		'return typeof Promise === "function"',
		// Default parameters
		'return (function (a = 1, b = 2) { return a === 3 && b === 2; }(3));',
		// Destructuring decliration
		'var [a,,[b],c] = [5,null,[6]];return a===5 && b===6 && c===undefined',
		// Parameter destructuring
		'return function([a,,[b],c]){return a===5 && b===6 && c===undefined;}'
			+ '([5,null,[6]])',
		// Fetch API
		'return typeof window.fetch === "function"'
	]

	for (var i = 0; i < tests.length; i++) {
		if (!check(tests[i])) {
			window.legacy = true
			break
		}
	}

	var scriptCount = 0,
		polyfills = ['dom4'],
		legacy = window.legacy

	// Stuff them full of hot, fat and juicy polyfills, if even one test failed.
	if (legacy) {
		polyfills.push('core.min', 'fetch')
	}

	var head = document.getElementsByTagName('head')[0]

	// Load apropriate language pack
	scriptCount++
	var xhr = new XMLHttpRequest()
	xhr.open(
		'GET',
		'/ass/lang/' + (localStorage.lang || config.lang.default) + '.json'
	)
	xhr.responseType = 'json'
	xhr.onload = function () {
		if (this.status !== 200) {
			throw new Error("Error fetching language pack: " + this.status)
		}
		window.lang = this.response
		loadClient()
	}
	xhr.send()

	for (var i = 0; i < polyfills.length; i++) {
		scriptCount++
		var script = document.createElement('script')
		script.type = 'text/javascript'
		script.src = '/ass/js/vendor/' + polyfills[i] + '.js'
		script.onload = loadClient
		head.appendChild(script)
	}

	function loadClient() {
		// This function might be called multiple times. Only load the client,
		// when all polyfills are loaded.
		scriptCount--
		if (scriptCount !== 0) {
			return
		}

		// Load all client modules as precompiled System.register format
		// modules
		var meta = {}
		meta['es5/*'] = meta['es6/*'] = {format: 'register'}

		System.config({
			baseURL: '/ass/js',
			defaultJSExtensions: true,
			meta: meta
		})

		System.import('es' + (legacy ? 5 : 6) + '/main')
	}
})()
