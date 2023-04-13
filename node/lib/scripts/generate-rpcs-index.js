"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = require("fs/promises");
const path_1 = require("path");
const ROUTES_FOLDER = 'src/rpcs';
const readdirRecursive = async (dir) => {
    const subdirs = await (0, promises_1.readdir)(dir);
    const files = await Promise.all(subdirs.map(async (subdir) => {
        const res = (0, path_1.join)(dir, subdir);
        return (await (0, promises_1.stat)(res)).isDirectory() ? readdirRecursive(res) : [res];
    }));
    return files.reduce((a, f) => a.concat(f), []);
};
const generateRoutesIndex = async () => {
    const files = await readdirRecursive(ROUTES_FOLDER);
    let indexTs = '/** @eslint-disable */\n';
    indexTs += '// generated file, run \'yarn generate:rpcs-index\' to update\n\n';
    indexTs += "import { ServiceImplementation } from '../types'\n";
    let mapConstructor = 'const rpcs: ServiceImplementation = {\n';
    for (let file of files) {
        const { name, ext } = (0, path_1.parse)(file);
        if (ext.endsWith('ts') && name !== 'index') {
            // strip relative path, use path from inside routes folder
            // also -3 to remove ".ts" extension
            file = '.' + file.slice(ROUTES_FOLDER.length, -3);
            indexTs += `import ${name} from '${file}'\n`;
            mapConstructor += `\t${name},\n`;
        }
    }
    mapConstructor += '}';
    indexTs += `\n${mapConstructor}\n`;
    indexTs += '\nexport default rpcs';
    await (0, promises_1.writeFile)((0, path_1.join)(ROUTES_FOLDER, 'index.ts'), indexTs);
    console.log('updated routes');
};
generateRoutesIndex();
