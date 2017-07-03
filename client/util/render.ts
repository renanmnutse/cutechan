// Utility functions for reducing layout thrashing, by batching DOM writes and
// reads. Basically a stripped down version of FastDOM.
// Also contains utilities for HTML template tags.

import * as Mustache from "mustache"

// Holds cached references to all out HTML template tags' contents
const templates: { [name: string]: DocumentFragment } = {}

// Import a prepared template and return it's HTML contents
export function importTemplate(name: string): DocumentFragment {
	return document.importNode(templates[name], true) as DocumentFragment
}

// Load HTML templates
for (let el of document.head.querySelectorAll("template")) {
	templates[el.getAttribute("name")] = (el as HTMLTemplateElement).content
}

// Toggle an optional style element in the head
export function toggleHeadStyle(
	name: string,
	css: string,
): (toggle: boolean) => void {
	return toggle => {
		const id = name + "-toggle"
		if (!document.getElementById(id)) {
			const html = `<style id="${id}">${css}</style>`
			document.head.append(makeEl(html))
		}

		// The disabled property only exists on elements in the DOM, so we do
		// another query
		(document.getElementById(id) as HTMLInputElement).disabled = !toggle
	}
}

// Parse HTML string to a single Node
export function makeEl(DOMString: string): HTMLElement {
	const el = document.createElement('div')
	el.innerHTML = DOMString
	return el.firstChild as HTMLElement
}

// FIXME(Kagami): This naming sucks.
export type Ctx = { [key: string]: any }

export class TemplateContext {
	private template: string
	private ctx: Ctx

	constructor(name: string, ctx: Ctx) {
		this.template = (window as any).CUTE_TEMPLATES[name]
		this.ctx = ctx
	}

	render(): string {
		return Mustache.render(this.template, this.ctx)
	}

	renderNode(): HTMLElement {
		return makeEl(this.render())
	}
}
