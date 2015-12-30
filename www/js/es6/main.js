require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';var _createClass=(function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value" in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};})();Object.defineProperty(exports,"__esModule",{value:true});function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}3;var FSM=(function(){function FSM(start){_classCallCheck(this,FSM);this.state=start;this.spec={acts:{},ons:{},wilds:{},preflights:{}};}_createClass(FSM,[{key:'clone',value:function clone(){var second=new FSM(this.state);second.spec=this.spec;return second;}},{key:'on',value:function on(key,f){var ons=this.spec.ons[key];if(ons){ons.push(f);}else {this.spec.ons[key]=[f];}}},{key:'preflight',value:function preflight(key,f){var pres=this.spec.preflights[key];if(pres){pres.push(f);}else {this.spec.preflights[key]=[f];}}},{key:'act',value:function act(trans_spec,on_func){var halves=trans_spec.split('->');if(halves.length!=2){throw new Error("Bad FSM spec: "+trans_spec);}var parts=halves[0].split(','),dest=halves[1].match(/^\s*(\w+)\s*$/)[1];var tok=undefined;for(var i=parts.length-1;i>=0;i--){var part=parts[i],m=part.match(/^\s*(\*|\w+)\s*(?:\+\s*(\w+)\s*)?$/);if(!m){throw new Error("Bad FSM spec portion: "+part);}if(m[2]){tok=m[2];}if(!tok){throw new Error("Tokenless FSM action: "+part);}var src=m[1];if(src=='*'){this.spec.wilds[tok]=dest;}else {var acts=this.spec.acts[src];if(!acts){this.spec.acts[src]=acts={};}acts[tok]=dest;}}if(on_func){this.on(dest,on_func);}}},{key:'feed',value:function feed(ev,param){var spec=this.spec;var from=this.state;var acts=spec.acts[from];var to=acts&&acts[ev]||spec.wilds[ev];if(to&&from!=to){var ps=spec.preflights[to];for(var i=0;ps&&i<ps.length;i++){if(!ps[i].call(this,param)){return false;}}this.state=to;var fs=spec.ons[to];for(var i=0;fs&&i<fs.length;i++){fs[i].call(this,param);}}return true;}},{key:'feeder',value:function feeder(ev){var _this=this;return function(param){return _this.feed(ev,param);};}}]);return FSM;})();exports.default=FSM;

},{}],2:[function(require,module,exports){
'use strict';var _createClass=(function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value" in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};})();function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}var main=require('./main');var _=main._;var Cookie=main.Cookie;var Memory=(function(){function Memory(key,expiry,needCookie){_classCallCheck(this,Memory);this.key=key;this.expiry=expiry;this.needCookie=needCookie;main.defer(this.purgeExpired.bind(this));}_createClass(Memory,[{key:'bakeCookie',value:function bakeCookie(object){if(!this.needCookie)return;var nums=Object.keys(object);nums.sort(function(a,b){return parseInt(a,10)-parseInt(b,10);});Cookie.set(this.key,nums.join('/'));}},{key:'now',value:function now(){return Math.floor(Date.now()/1000);}},{key:'purgeAll',value:function purgeAll(){localStorage.removeItem(this.key);if(this.needCookie)Cookie.remove(this.key);}},{key:'readAll',value:function readAll(){var key=localStorage.getItem(this.key);if(!key)return {};var val=undefined;try{val=JSON.parse(key);}catch(e) {}return _.isObject(val)?val:{};}},{key:'writeAll',value:function writeAll(object){if(_.isEmpty(object))return this.purgeAll();localStorage.setItem(this.key,JSON.stringify(object));this.bakeCookie(object);}},{key:'write',value:function write(key){var object=this.readAll();object[key]=this.now();this.writeAll(object);return _.size(object);}},{key:'size',value:function size(){return _.size(this.readAll());}},{key:'purgeExpired',value:function purgeExpired(){if(!this.expiry)return;var object=this.readAll();var now=this.now(),limit=86400*this.expiry;var expired=[];for(var key in object){var time=object[key];if(time&&now>time+limit)expired.push(key);}if(!expired.length)return;for(var i=0,lim=expired.length;i<lim;i++){delete object[expired[i]];}this.writeAll(object);}}]);return Memory;})();module.exports=Memory;

},{"./main":"main"}],3:[function(require,module,exports){
'use strict';var _createClass=(function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value" in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};})();Object.defineProperty(exports,"__esModule",{value:true});var _main=require('main');var _opts=require('./opts');var _opts2=_interopRequireDefault(_opts);var _render=require('./render');var _render2=_interopRequireDefault(_render);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}var options=undefined;try{options=JSON.parse(localStorage.options);}catch(e) {}if(!options){options={};}exports.default=options=new _main.Backbone.Model(options);var optionModels={};var OptionModel=(function(){function OptionModel(model){var _this=this;_classCallCheck(this,OptionModel);if(model.load!==undefined&&!model.load){return;}_main._.extend(this,model);if(!this.type){this.type='checkbox';}var val=options.attributes[this.id]=this.get();options.on('change:'+this.id,function(options,val){return _this.onchange(val);});if(this.execOnStart!==false){this.execute(this.val);}optionModels[this.id]=this;}_createClass(OptionModel,[{key:'read',value:function read(){return localStorage.getItem(this.id);}},{key:'get',value:function get(){var stored=this.read();if(!stored){return this.default;}else {if(stored==='false'){return false;}if(stored==="true"){return true;}var num=parseInt(stored,10);if(num||num===0){return num;}return this.default;}}},{key:'onChange',value:function onChange(val){this.execute(val);this.set(val);}},{key:'execute',value:function execute(val){if(this.exec){this.exec(val);}}},{key:'set',value:function set(val){if(val!==this.default||this.read()){localStorage.setItem(this.id,val);}}},{key:'validate',value:function validate(val){if(this.validation){return this.validation(val);}return true;}}]);return OptionModel;})();(function(){if(localStorage.getItem('options')){return;}var el=document.query('#options');el.style.opacity=1;var out=true,clicked=undefined;el.addEventListener("click",function(){return clicked=true;});tick();function tick(){if(clicked){el.style.opacity=1;return;}el.style.opacity=+el.style.opacity+(out?-0.02:0.02);var now=+el.style.opacity;if(out&&now<=0||!out&&now>=1){out=!out;}requestAnimationFrame(tick);}})();var OptionsView=_main.Backbone.View.extend({initialize:function initialize(){this.setElement((0,_render2.default)());document.body.append(this.el);this.assignValues();this.hidden=this.el.query('#hidden');_main.events.reply('hide:render',this.renderHidden,this);},events:{'click .option_tab_sel>li>a':'switchTab','change':'applyChange','click #export':'export','click #import':'import','click #hidden':'clearHidden'},assignValues:function assignValues(){for(var _id in optionModels){var model=optionModels[_id],el=this.el.query('#'+_id);var type=model.type;var val=model.get();if(type==='checkbox'){el.checked=val;}else if(type==='number'||type instanceof Array){el.value=val;}else if(type==='shortcut'){el.value=String.fromCharCode(val).toUpperCase();}}},switchTab:function switchTab(event){event.preventDefault();var el=event.target;var _iteratorNormalCompletion=true;var _didIteratorError=false;var _iteratorError=undefined;try{for(var _iterator=el.children[Symbol.iterator](),_step;!(_iteratorNormalCompletion=(_step=_iterator.next()).done);_iteratorNormalCompletion=true){var child=_step.value;child.query('.tab_sel').classList.remove('tab_sel');}}catch(err) {_didIteratorError=true;_iteratorError=err;}finally {try{if(!_iteratorNormalCompletion&&_iterator.return){_iterator.return();}}finally {if(_didIteratorError){throw _iteratorError;}}}el.classList.add('tab_sel');_main._.filter(this.el.lastChild.children,function(li){return li.classList.has(el.getAttribute('data-content'));}).classList.add('tab_sel');},applyChange:function applyChange(event){var el=event.target,model=optionModels[el.getAttribute('id')];var val=undefined;switch(model.type){case 'checkbox':val=el.checked;break;case 'number':val=parseInt(el.value);break;case 'image':return _main.events.request('background:store',event.target);case 'shortcut':val=el.value.toUpperCase().charCodeAt(0);break;default:val=el.value;}if(!model.validate(val)){el.value='';}else {options.set(id,val);}},export:function _export(){var a=document.getElementById('export');a.setAttribute('href',window.URL.createObjectURL(new Blob([JSON.stringify(localStorage)],{type:'octet/stream'})));a.setAttribute('download','meguca-config.json');},import:function _import(event){event.preventDefault();var el=document.query('#importSettings');el.click();_main.util.once(el,'change',function(){var reader=new FileReader();reader.readAsText(input.files[0]);reader.onload=function(event){var json=undefined;try{json=JSON.parse(event.target.result);}catch(err) {alert('Import failed. File corrupt');return;}localStorage.clear();for(var key in json){localStorage[key]=json[key];}alert('Import successfull. The page will now reload.');location.reload();};});},renderHidden:function renderHidden(count){var el=this.hidden;el.textContent=el.textContent.replace(/\d+$/,count);},clearHidden:function clearHidden(){main.request('hide:clear');this.renderHidden(0);}});var _iteratorNormalCompletion2=true;var _didIteratorError2=false;var _iteratorError2=undefined;try{for(var _iterator2=_opts2.default[Symbol.iterator](),_step2;!(_iteratorNormalCompletion2=(_step2=_iterator2.next()).done);_iteratorNormalCompletion2=true){var spec=_step2.value;new OptionModel(spec);}}catch(err) {_didIteratorError2=true;_iteratorError2=err;}finally {try{if(!_iteratorNormalCompletion2&&_iterator2.return){_iterator2.return();}}finally {if(_didIteratorError2){throw _iteratorError2;}}}var optionsPanel=undefined;(0,_main.defer)(function(){return optionsPanel=new OptionsView();});

},{"./opts":4,"./render":5,"main":"main"}],4:[function(require,module,exports){
'use strict';Object.defineProperty(exports,"__esModule",{value:true});var _main=require('main');var notMobile=!_main.isMobile;var opts=[{id:'lang',type:_main.config.lang.enabled,tab:0,default:_main.config.lang.default,execOnStart:false,exec:function exec(type){alert(_main.lang.langApplied);location.reload();}},{id:'inlinefit',type:['none','full','width','height','both'],tab:1,default:'width'},{id:'thumbs',type:_main.util.thumbStyles,tab:1,default:'small'},{id:'imageHover',default:true,load:notMobile,tab:0},{id:'webmHover',load:notMobile,tab:0},{id:'autogif',load:notMobile,tab:1},{id:'spoilers',tab:1,default:true},{id:'linkify',tab:0,default:true},{id:'notification',load:notMobile,tab:0,exec:function exec(notifToggle){if(notifToggle&&Notification.permission!=="granted")Notification.requestPermission();}},{id:'anonymise',tab:0},{id:'relativeTime',tab:0,default:true},{id:'nowPlaying',load:notMobile&&_main.config.radio,tab:3,default:true,exec:function exec(toggle){if(toggle){main.send({type:'radio'});}else {main.request('banner:radio:clear');}}},{id:'illyaBGToggle',load:notMobile&&_main.config.illyaDance,tab:3},{id:'illyaMuteToggle',load:notMobile&&_main.config.illyaDance,tab:3},{id:'horizontalPosting',tab:3,exec:toggleHeadStyle('horizontal','article,aside{display:inline-block;}')},{id:'replyright',tab:1,exec:toggleHeadStyle('reply-at-right','section>aside{margin: -26px 0 2px auto;}')},{id:'theme',type:['moe','gar','mawaru','moon','ashita','console','tea','higan','ocean','rave','tavern','glass'],tab:1,default:_main.config.defaultCSS,exec:function exec(theme){if(!theme){return;}document.getElementById('theme').setAttribute('href',_main.config.MEDIA_URL+'css/'+theme+'.css?v='+main.cssHash);}},{id:'userBG',load:notMobile,tab:1},{id:'userBGimage',load:notMobile,type:'image',tab:1,execOnStart:false,exec:function exec(upload){main.request('background:store',upload);}},{id:'lastn',type:'number',tab:0,validation:_main.util.resonableLastN,default:100},{id:'alwaysLock',tab:0}];var _arr=['google','iqdb','saucenao','desustorage','exhentai'];for(var _i=0;_i<_arr.length;_i++){var engine=_arr[_i];opts.push({id:engine,lang:'imageSearch',tab:2,default:engine==='google',exec:toggleHeadStyle(engine+'Toggle','.'+engine+'{display:initial;}')});}var shorts=[{id:'new',default:78},{id:'togglespoiler',default:73},{id:'textSpoiler',default:68},{id:'done',default:83},{id:'expandAll',default:69},{id:'workMode',default:66}];var _iteratorNormalCompletion=true;var _didIteratorError=false;var _iteratorError=undefined;try{for(var _iterator=shorts[Symbol.iterator](),_step;!(_iteratorNormalCompletion=(_step=_iterator.next()).done);_iteratorNormalCompletion=true){var short=_step.value;short.type='shortcut';short.tab=4;short.load=notMobile;opts.push(short);}}catch(err) {_didIteratorError=true;_iteratorError=err;}finally {try{if(!_iteratorNormalCompletion&&_iterator.return){_iterator.return();}}finally {if(_didIteratorError){throw _iteratorError;}}}function toggleHeadStyle(id,css){return function(toggle){if(!document.getElementById(id)){document.head.appendChild(_main.util.parseEl('<style id="'+id+'">'+css+'</style>'));}document.getElementById(id).disabled=!toggle;};}exports.default=opts;

},{"main":"main"}],5:[function(require,module,exports){
'use strict';var _slicedToArray=(function(){function sliceIterator(arr,i){var _arr=[];var _n=true;var _d=false;var _e=undefined;try{for(var _i=arr[Symbol.iterator](),_s;!(_n=(_s=_i.next()).done);_n=true){_arr.push(_s.value);if(i&&_arr.length===i)break;}}catch(err) {_d=true;_e=err;}finally {try{if(!_n&&_i["return"])_i["return"]();}finally {if(_d)throw _e;}}return _arr;}return function(arr,i){if(Array.isArray(arr)){return arr;}else if(Symbol.iterator in Object(arr)){return sliceIterator(arr,i);}else {throw new TypeError("Invalid attempt to destructure non-iterable instance");}};})();var _templateObject=_taggedTemplateLiteral(['<option value="','">\n                    ','\n                </option>'],['<option value="','">\n                    ','\n                </option>']),_templateObject2=_taggedTemplateLiteral(['<input ','>'],['<input ','>']);Object.defineProperty(exports,"__esModule",{value:true});exports.default=render;var _main=require('main');var _opts=require('./opts');var _opts2=_interopRequireDefault(_opts);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _taggedTemplateLiteral(strings,raw){return Object.freeze(Object.defineProperties(strings,{raw:{value:Object.freeze(raw)}}));}var lang=_main.lang.opts;function render(){var html='<div class="bmodal glass" id="options-panel">'+'<ul class="option_tab_sel">';var tabs=lang.tabs;var opts=[];var _loop=function _loop(i){opts[i]=_main._.filter(_opts2.default,function(opt){return opt.tab===i&&(opt.load===undefined||opt.load)&&!opt.hidden;});if(!opts[i].length){return 'continue';}html+='<li><a data-content="tab-'+i+'"';if(i===0){html+=' class="tab_sel"';}html+='>'+tabs[i]+'</a></li>';};for(var i=0;i<tabs.length;i++){var _ret=_loop(i);if(_ret==='continue')continue;}html+='</ul><ul class="option_tab_cont">';for(var i=0;i<opts.length;i++){html+=renderTab(opts[i],i);}html+='</ul></div>';return (0,_main.parseEl)(html);}function renderTab(opts,i){if(!opts.length){return '';}var html="";html+='<li class="tab-'+i;if(i===0){html+=' tab_sel';}html+='">';var _iteratorNormalCompletion=true;var _didIteratorError=false;var _iteratorError=undefined;try{for(var _iterator=opts[Symbol.iterator](),_step;!(_iteratorNormalCompletion=(_step=_iterator.next()).done);_iteratorNormalCompletion=true){var opt=_step.value;html+=renderOption(opt);}}catch(err) {_didIteratorError=true;_iteratorError=err;}finally {try{if(!_iteratorNormalCompletion&&_iterator.return){_iterator.return();}}finally {if(_didIteratorError){throw _iteratorError;}}}if(i===0){html+=renderExtras();}html+='</li>';return html;}function renderOption(opt){var html='';var isShortcut=opt.type==='shortcut',isList=opt.type instanceof Array,isCheckbox=opt.type==='checkbox'||opt.type===undefined,isNumber=opt.type==='number',isImage=opt.type==='image';if(isShortcut){html+='Alt+';}if(!isList){html+='<input';if(isCheckbox||isImage)html+=' type="'+(isCheckbox?'checkbox':'file')+'"';else if(isNumber)html+=' style="width: 4em;" maxlength="4"';else if(isShortcut)html+=' maxlength="1"';}else {html+='<select';}var _lang$labels$opt$id=_slicedToArray(lang.labels[opt.id],2);var label=_lang$labels$opt$id[0];var title=_lang$labels$opt$id[1];html+=' id="'+opt.id+'" title="'+title+'">';if(isList){var _iteratorNormalCompletion2=true;var _didIteratorError2=false;var _iteratorError2=undefined;try{for(var _iterator2=opt.type[Symbol.iterator](),_step2;!(_iteratorNormalCompletion2=(_step2=_iterator2.next()).done);_iteratorNormalCompletion2=true){var item=_step2.value;html+=(0,_main.parseHTML)(_templateObject,item,lang.modes[item]||item);}}catch(err) {_didIteratorError2=true;_iteratorError2=err;}finally {try{if(!_iteratorNormalCompletion2&&_iterator2.return){_iterator2.return();}}finally {if(_didIteratorError2){throw _iteratorError2;}}}html+='</select>';}html+='<label for="'+opt.id+'" title="'+title+'">'+label+'</label><br>';return html;}function renderExtras(){var html='<br>';var links=['export','import','hidden'];var _iteratorNormalCompletion3=true;var _didIteratorError3=false;var _iteratorError3=undefined;try{for(var _iterator3=links[Symbol.iterator](),_step3;!(_iteratorNormalCompletion3=(_step3=_iterator3.next()).done);_iteratorNormalCompletion3=true){var id=_step3.value;var _lang$labels$id=_slicedToArray(lang.labels[id],2);var label=_lang$labels$id[0];var title=_lang$labels$id[1];html+='<a id="'+id+'" title="'+_main.lang[1]+'">'+_main.lang[0]+'</a> ';}}catch(err) {_didIteratorError3=true;_iteratorError3=err;}finally {try{if(!_iteratorNormalCompletion3&&_iterator3.return){_iterator3.return();}}finally {if(_didIteratorError3){throw _iteratorError3;}}}var attrs={type:'file',id:'importSettings',name:"Import Settings"};html+=(0,_main.parseHTML)(_templateObject2,attrs);return html;}

},{"./opts":4,"main":"main"}],6:[function(require,module,exports){
'use strict';Object.defineProperty(exports,"__esModule",{value:true});exports.links=exports.posts=exports.mine=exports.ownPosts=exports.syncs=exports.page=undefined;exports.read=read;exports.addLinks=addLinks;var _main=require('main');function read(href){var state={board:href.match(/\/([a-zA-Z0-9]+?)\//)[1],thread:href.match(/\/(\d+)(:?#\d+)?(?:[\?&]\w+=\w+)*$/),lastN:href.match(/[\?&]last=(\d+)/)};var _arr=['thread','lastN'];for(var _i=0;_i<_arr.length;_i++){var key=_arr[_i];var val=state[key];state[key]=val?parseInt(val[1]):0;}return state;}var page=exports.page=new _main.Backbone.Model(read(location.href));var syncs=exports.syncs={};var ownPosts=exports.ownPosts={};var mine=exports.mine=new _main.Memory('mine',2,true);var posts=exports.posts=new _main.Backbone.Collection();_main.events.on('state:clear',function(){main.$threads.innerHTML='';models.each(function(model){return model.dispatch('stopListening');});posts.reset();exports.syncs={};main.request('massExpander:unset');});var links=exports.links={};function addLinks(addition){if(addition){_main._.extend(links,addition);}}

},{"main":"main"}],7:[function(require,module,exports){
'use strict';var _templateObject=_taggedTemplateLiteral(['<syncwatch ','>\n\t\t\tsyncwatch\n\t\t</syncwatch>'],['<syncwatch ','>\n\t\t\tsyncwatch\n\t\t</syncwatch>']),_templateObject2=_taggedTemplateLiteral(['<span class="act">\n\t\t\t<a href="','"\n\t\t\t\t','\n\t\t\t\t','\n\t\t\t>\n\t\t\t\t','\n\t\t\t</a>\n\t\t</span>'],['<span class="act">\n\t\t\t<a href="','"\n\t\t\t\t','\n\t\t\t\t','\n\t\t\t>\n\t\t\t\t','\n\t\t\t</a>\n\t\t</span>']);Object.defineProperty(exports,"__esModule",{value:true});exports.thumbStyles=undefined;exports.touchable_spoiler_tag=touchable_spoiler_tag;exports.imageUploadURL=imageUploadURL;exports.getNum=getNum;exports.getID=getID;exports.getModel=getModel;exports.parseEls=parseEls;exports.parseEl=parseEl;exports.listener=listener;exports.once=once;exports.outerWidth=outerWidth;exports.isSage=isSage;exports.serverTime=serverTime;exports.readable_dice=readable_dice;exports.pick_spoiler=pick_spoiler;exports.readable_filesize=readable_filesize;exports.pad=pad;exports.action_link_html=action_link_html;exports.resonableLastN=resonableLastN;exports.parse_name=parse_name;exports.randomID=randomID;exports.parseHTML=parseHTML;exports.commaList=commaList;exports.checkAuth=checkAuth;var _main=require('main');function _toArray(arr){return Array.isArray(arr)?arr:Array.from(arr);}function _taggedTemplateLiteral(strings,raw){return Object.freeze(Object.defineProperties(strings,{raw:{value:Object.freeze(raw)}}));}function touchable_spoiler_tag(del){del.html='<del onclick="void(0)">';}function imageUploadURL(){return (_main.config.hard.HTTP.upload||'../upload/')+'?id='+_main.state.page.get('connID');}function getNum(el){if(!el){return 0;}return parseInt(el.getAttribute('id').slice(1),10);}function getID(el){if(!el){return 0;}return getNum(el.closest('article, section'));}function getModel(el){var id=getID(el);if(!id)return null;return _main.state.posts.get(id);}function parseEls(string){var el=document.createElement('div');el.innerHTML=string;var children=el.childNodes;return Array.from(children);}function parseEl(string){var el=document.createElement('div');el.innerHTML=string;return el.firstChild;}function listener(el,type,selector,handler){el.addEventListener(type,function(event){if(event.target.matches(selector))handler.call(this,event);});}function once(el,type,handler){el.addEventListener(type,function(event){handler.call(this,event);el.removeEventListener(type,handler);});}function outerWidth(el){var style=getComputedStyle(el),props=['marginLeft','marginRight','paddingLeft','paddingRight'];var width=0;var _iteratorNormalCompletion=true;var _didIteratorError=false;var _iteratorError=undefined;try{for(var _iterator=props[Symbol.iterator](),_step;!(_iteratorNormalCompletion=(_step=_iterator.next()).done);_iteratorNormalCompletion=true){var prop=_step.value;width+=parseInt(style[prop]);}}catch(err) {_didIteratorError=true;_iteratorError=err;}finally {try{if(!_iteratorNormalCompletion&&_iterator.return){_iterator.return();}}finally {if(_didIteratorError){throw _iteratorError;}}}return width;}function isSage(email){return email&&email.trim()==='sage';}var cachedOffset=undefined;function serverTime(){var d=Date.now();if(imports.isNode)return d;if(!cachedOffset)cachedOffset=imports.main.request('time:offset');return d+cachedOffset;}function readable_dice(bit,dice){var inner=undefined;switch(bit){case '#flip':inner=(dice[2]==2).toString();break;case '#8ball':inner=imports.hotConfig.EIGHT_BALL[dice[2]-1];break;case '#pyu':case '#pcount':case '#q':inner=dice[0];break;}if(inner!==undefined)return _main._.escape(bit+' ('+inner+')');if(/^#sw/.test(bit))return readableSyncwatch(dice[0]);return readableRegularDice(bit,dice);}function readableSyncwatch(dice){dice.class='embed';return parseHTML(_templateObject,dice);}function readableRegularDice(bit,_ref){var _ref2=_toArray(_ref);var max=_ref2[0];var bias=_ref2[1];var rolls=_ref2.slice(2);bit+=' (';var eq=rolls.length>1||bias;if(eq)bit+=rolls.join(', ');if(bias)bit+=bias<0?' - '+-bias:' + '+bias;var sum=bias;var _iteratorNormalCompletion2=true;var _didIteratorError2=false;var _iteratorError2=undefined;try{for(var _iterator2=rolls[Symbol.iterator](),_step2;!(_iteratorNormalCompletion2=(_step2=_iterator2.next()).done);_iteratorNormalCompletion2=true){var roll=_step2.value;sum+=roll;}}catch(err) {_didIteratorError2=true;_iteratorError2=err;}finally {try{if(!_iteratorNormalCompletion2&&_iterator2.return){_iterator2.return();}}finally {if(_didIteratorError2){throw _iteratorError2;}}}return bit+(eq?' = ':'')+sum+')';}function pick_spoiler(metaIndex){var imgs=imports.config.SPOILER_IMAGES,n=imgs.length;var i=undefined;if(metaIndex<0)i=Math.floor(Math.random()*n);else i=metaIndex%n;return {index:imgs[i],next:(i+1)%n};}var thumbStyles=exports.thumbStyles=['small','sharp','hide'];function readable_filesize(size){if(size<1024)return size+' B';if(size<1048576)return Math.round(size/1024)+' KB';size=Math.round(size/104857.6).toString();return size.slice(0,-1)+'.'+size.slice(-1)+' MB';}function pad(n){return (n<10?'0':'')+n;}function action_link_html(href,name,id,cls){return parseHTML(_templateObject2,href,id&&' id="'+id+'"',cls&&' class="'+cls+'"',name);}function resonableLastN(n){return Number.isInteger(n)&&n<=500;}function parse_name(name){var tripcode='',secure='';var hash=name.indexOf('#');if(hash>=0){tripcode=name.substr(hash+1);name=name.substr(0,hash);hash=tripcode.indexOf('#');if(hash>=0){secure=_main._.escape(tripcode.substr(hash+1));tripcode=tripcode.substr(0,hash);}tripcode=_main._.escape(tripcode);}name=name.trim().replace(imports.hotConfig.EXCLUDE_REGEXP,'');return [name.substr(0,100),tripcode.substr(0,128),secure.substr(0,128)];}function randomID(len){var id='';for(var i=0;i<len;i++){var char=(Math.random()*36).toString(36)[0];if(Math.random()<0.5)char=char.toUpperCase();id+=char;}return id;}function parseHTML(callSite){if(typeof callSite==='string')return formatHTML(callSite);if(typeof callSite==='function')return formatHTML(callSite(args));var len=arguments.length;var args=[];for(var i=1;i<len;i++){args[i-1]=arguments[i];}var output=callSite.slice(0,len).map(function(text,i){var arg=args[i-1];var result=undefined;if(i===0||!arg&&arg!==0)result='';else if(arg instanceof Object)result=elementAttributes(arg);else result=arg;return result+text;}).join('');return formatHTML(output);}function formatHTML(str){var size=-1;return str.replace(/\n(\s+)/g,function(m,m1){if(size<0)size=m1.replace(/\t/g,'    ').length;return m1.slice(Math.min(m1.length,size));}).replace(/^\s*\n/gm,'');}function elementAttributes(attrs){var html='';for(var key in attrs){html+=' ';var val=attrs[key];if(val===true)html+=key;else if(val||val===0)html+=key+'="'+val+'"';}return html;}function commaList(items){var html='';var _iteratorNormalCompletion3=true;var _didIteratorError3=false;var _iteratorError3=undefined;try{for(var _iterator3=items[Symbol.iterator](),_step3;!(_iteratorNormalCompletion3=(_step3=_iterator3.next()).done);_iteratorNormalCompletion3=true){var item=_step3.value;if(!item&&item!==0)continue;if(html)html+=', ';html+=item;}}catch(err) {_didIteratorError3=true;_iteratorError3=err;}finally {try{if(!_iteratorNormalCompletion3&&_iterator3.return){_iterator3.return();}}finally {if(_didIteratorError3){throw _iteratorError3;}}}return html;}function checkAuth(action){var cls=_main.config.staff.classes[main.ident&&main.ident.auth];return cls&&!!cls.rights[action];}

},{"main":"main"}],"main":[function(require,module,exports){
'use strict';var _fsm=require('./fsm');var _fsm2=_interopRequireDefault(_fsm);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}var _=require('underscore'),Backbone=require('backbone'),Cookie=require('js-cookie'),radio=require('backbone.radio');require('core-js');require('dom4');require('backbone.nativeview');Backbone.View=Backbone.NativeView;var main=module.exports={_:_,Backbone:Backbone,Cookie:Cookie,FSM:_fsm2.default,$script:require('scriptjs'),SockJS:require('sockjs-client'),events:radio.channel('main'),_deferred:[],defer:function defer(func){main._deferred.push(func);return main;},execDefered:function execDefered(){var _iteratorNormalCompletion=true;var _didIteratorError=false;var _iteratorError=undefined;try{for(var _iterator=this._deferred[Symbol.iterator](),_step;!(_iteratorNormalCompletion=(_step=_iterator.next()).done);_iteratorNormalCompletion=true){var func=_step.value;func();}}catch(err) {_didIteratorError=true;_iteratorError=err;}finally {try{if(!_iteratorNormalCompletion&&_iterator.return){_iterator.return();}}finally {if(_didIteratorError){throw _iteratorError;}}}},dispatcher:{}};_.extend(main,{config:config,configHash:configHash,clientHash:clientHash,isMobile:isMobile});var cookieVersion=3;if(localStorage.cookieVersion!=cookieVersion){for(var cookie in Cookie.get()){var paths=main.config.boards.enabled.slice();paths.push('');var _iteratorNormalCompletion2=true;var _didIteratorError2=false;var _iteratorError2=undefined;try{for(var _iterator2=paths[Symbol.iterator](),_step2;!(_iteratorNormalCompletion2=(_step2=_iterator2.next()).done);_iteratorNormalCompletion2=true){var path=_step2.value;Cookie.remove(cookie,{path:path});}}catch(err) {_didIteratorError2=true;_iteratorError2=err;}finally {try{if(!_iteratorNormalCompletion2&&_iterator2.return){_iterator2.return();}}finally {if(_didIteratorError2){throw _iteratorError2;}}}}localStorage.cookieVersion=cookieVersion;}if(/[&\?]debug=true/.test(location.href))main.config.hard.debug=true;if(main.config.hard.debug){radio.DEBUG=true;window.Backbone=Backbone;radio.tuneIn('main');}main.Memory=require('./memory');var lang=main.lang=require('lang'),state=main.state=require('./state'),util=main.util=require('./util');main.send=main.events.request.bind(main.events,'send');var _arr=['parseHTML','parseEl','parseEls'];for(var _i=0;_i<_arr.length;_i++){var fn=_arr[_i];main[fn]=util[fn];}main.options=require('./options');main.execDefered();main.events.request('loading:hide');

},{"./fsm":1,"./memory":2,"./options":3,"./state":6,"./util":7,"backbone":undefined,"backbone.nativeview":undefined,"backbone.radio":undefined,"core-js":undefined,"dom4":undefined,"js-cookie":undefined,"lang":undefined,"scriptjs":undefined,"sockjs-client":undefined,"underscore":undefined}]},{},["main"])


//# sourceMappingURL=main.js.map
