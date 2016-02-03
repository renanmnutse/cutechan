'use strict';System.register(['underscore','./memory','./util','./model','./collection'],function(_export,_context){var extend,Memory,randomID,getID,Model,Collection;return {setters:[function(_underscore){extend=_underscore.extend;},function(_memory){Memory=_memory.default;},function(_util){randomID=_util.randomID;getID=_util.getID;},function(_model){Model=_model.default;},function(_collection){Collection=_collection.default;}],execute:function(){function read(href){const state={board:href.match(/\/([a-zA-Z0-9]+?)\//)[1],thread:href.match(/\/(\d+)(:?#\d+)?(?:[\?&]\w+=\w+)*$/),lastN:href.match(/[\?&]last=(\d+)/)};for(let key of ['thread','lastN']){const val=state[key];state[key]=val?parseInt(val[1]):0;}return state;}_export('read',read);const initial=read(location.href);initial.tabID=randomID(32);let page=new Model(initial);_export('page',page);let syncs={};_export('syncs',syncs);const ownPosts={};_export('ownPosts',ownPosts);const config=window.config;_export('config',config);const configHash=window.configHash;_export('configHash',configHash);const isMobile=window.isMobile;_export('isMobile',isMobile);const $threads=document.query('threads');_export('$threads',$threads);const $name=document.query('#name');_export('$name',$name);const $email=document.query('#email');_export('$email',$email);const $banner=document.query('#banner');_export('$banner',$banner);const mine=new Memory('mine',2);_export('mine',mine);const posts=new Collection();_export('posts',posts);function clear(){$threads.innerHTML='';models.each(model => model.dispatch('stopListening'));posts.reset();exports.syncs={};events.request('massExpander:unset');}_export('clear',clear);function getModel(el){const id=getID(el);if(!id){return null;}return posts.get(id);}_export('getModel',getModel);}};});
//# sourceMappingURL=maps/state.js.map
