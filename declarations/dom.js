/*
 More specific and up to date interfaces for standard Browser JS types
*/
/* @flow */

declare class Event {
	target :Element;
}

declare type EventHandler = (event :Event) => void

declare class Element {
	addEventListener(type :string, handler :EventHandler) :void;
	removeEventListener(type :string, handler :EventHandler) :void;
	matches(selector :string) :void;
	remove() :void;
}
