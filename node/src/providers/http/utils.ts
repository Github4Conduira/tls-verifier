import { JSDOM } from 'jsdom'
import { JSONPath } from 'jsonpath-plus'

export function extractHTMLElement(html, xPath: string) {
	try {
		const dom = new JSDOM(html), doc = dom?.window?.document
		return doc.evaluate(xPath, doc, null, 2).stringValue
	} catch(e) {
		throw new Error(`error while evaluating xPath: ${e}`)
	}
}

export function extractJSONElement(json, jsonPath: string) {
	try {
		return JSONPath({ path: jsonPath, json: JSON.parse(json), wrap:false })
	} catch(e) {
		throw new Error(`error while evaluating xPath: ${e}`)
	}
}