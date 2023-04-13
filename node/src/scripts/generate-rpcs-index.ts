import { readdir, stat, writeFile } from 'fs/promises'
import { join, parse, } from 'path'

const ROUTES_FOLDER = 'src/rpcs'

const readdirRecursive = async(dir: string): Promise<string[]> => {
	const subdirs = await readdir(dir)
	const files = await Promise.all(
		subdirs.map(
			async(subdir) => {
				const res = join(dir, subdir)
				return (await stat(res)).isDirectory() ? readdirRecursive(res) : [res]
			}
		)
	)
	return files.reduce((a, f) => a.concat(f), [])
}

const generateRoutesIndex = async() => {
	const files = await readdirRecursive(ROUTES_FOLDER)

	let indexTs = '/** @eslint-disable */\n'
	indexTs += '// generated file, run \'yarn generate:rpcs-index\' to update\n\n'
	indexTs += "import { ServiceImplementation } from '../types'\n"

	let mapConstructor = 'const rpcs: ServiceImplementation = {\n'

	for(let file of files) {
		const { name, ext } = parse(file)
		if(ext.endsWith('ts') && name !== 'index') {
			// strip relative path, use path from inside routes folder
			// also -3 to remove ".ts" extension
			file = '.' + file.slice(ROUTES_FOLDER.length, -3)
			indexTs += `import ${name} from '${file}'\n`
			mapConstructor += `\t${name},\n`
		}
	}

	mapConstructor += '}'

	indexTs += `\n${mapConstructor}\n`
	indexTs += '\nexport default rpcs'

	await writeFile(join(ROUTES_FOLDER, 'index.ts'), indexTs)
	console.log('updated routes')
}

generateRoutesIndex()