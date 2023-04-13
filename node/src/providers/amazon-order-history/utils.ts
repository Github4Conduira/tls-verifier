import parse, { HTMLElement } from 'node-html-parser'
import sanitize from 'sanitize-html'

type AmazonOrder = {
	name: string
	url: string
}

//const DATE_REGEX = /[0-9]{1,2} [a-z]{1,15} [0-9]{4}/i

/**
 * Parse the html response for the amazon order history provider
 * Note: the classes may seem arbitrary,
 * but they are the only way to select the correct nodes
 */
export function parseResponse(html: string) {

	const good = sanitize(html, {
		allowedTags: [ 'div', 'a' ],
		allowedAttributes: {
			'a': [ 'class', 'href'],
			'div':['class']
		},
		allowedClasses: {
			'img':['yo-critical-feature']
		},
		disallowedTagsMode:'discard'
	})


	const elem = parse(good)

	const aNodes = elem.querySelectorAll('.a-link-normal')

	if(!aNodes.length) {
		throw new Error('No orders found in response')
	}

	return aNodes.filter(value => {
		return value.attributes['href'].startsWith('/gp/product/')
	}).map(parseOrderNode)
}

function parseOrderNode(node: HTMLElement, i: string | number): AmazonOrder {
	const url = node.attributes['href']
	if(!url) {
		throw new Error(`Invalid order url: ${i}`)
	}


	const name = cleanText(node.innerText)
	return {
		name,
		url
	}
}

/** remove excess whitespace */
function cleanText(txt: string) {
	return txt.trim().replace(/\s+/g, ' ')
}