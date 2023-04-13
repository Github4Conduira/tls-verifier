/// <reference types="node" />
import { KEY_UPDATE_TYPE_MAP } from './constants';
export declare function packKeyUpdateRecord(type: keyof typeof KEY_UPDATE_TYPE_MAP): Buffer;
