"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert_session_1 = require("./assert-session");
exports.default = async (id, packet) => {
    const session = (0, assert_session_1.assertActiveSession)(id);
    const { recordHeader, content, authenticationTag } = packet;
    session.transcript.push({ sender: 'client', packet });
    const data = Buffer.concat([
        recordHeader,
        content,
        authenticationTag,
    ]);
    session.logger.trace({ data: data.toString('hex') }, 'wrote packet');
    await new Promise((resolve, reject) => {
        session.socket.write(data, err => {
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }
        });
    });
};
