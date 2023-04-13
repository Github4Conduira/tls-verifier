"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const fs_1 = require("fs");
const privateKey = `0x${(0, crypto_1.randomBytes)(32).toString('hex')}`;
const envFile = `PRIVATE_KEY=${privateKey}`;
(0, fs_1.writeFileSync)('./resources/keypair.json', envFile);
console.log('Wrote .env.production w private key');
