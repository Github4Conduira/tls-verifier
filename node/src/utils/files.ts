export function readFile(filename: string) {
	try {
		const { existsSync, readFileSync } = require('fs')
		if(!existsSync(filename)) {
			return
		}

		const data = readFileSync(filename, 'utf8')
		return data as string
	} catch{

	}
}