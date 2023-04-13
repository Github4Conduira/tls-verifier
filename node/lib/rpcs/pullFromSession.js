"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert_session_1 = require("../sessions/assert-session");
// eslint-disable-next-line func-style
const pullFromSession = async function* ({ sessionId }, { signal, logger }) {
    const session = (0, assert_session_1.assertActiveSession)(sessionId);
    let pendingEvents = [];
    let nextPromise = Promise.resolve();
    let nextPromiseResolve = () => { };
    const cancel = registerForServerData(message => {
        onEventRecv({ message });
    });
    signal.addEventListener('abort', () => nextPromiseResolve(undefined));
    logger.debug('listening for events');
    while (!signal.aborted) {
        await nextPromise;
        const eventsToRelease = pendingEvents;
        pendingEvents = [];
        if (!signal.aborted) {
            newNextPromise();
            for (const event of eventsToRelease) {
                yield event;
            }
        }
    }
    try {
        await cancel();
        logger.debug('cancelled stream');
    }
    catch (error) {
        logger.error({ trace: error.stack }, 'failed to cancel stream');
    }
    function onEventRecv(data) {
        pendingEvents.push(data);
        nextPromiseResolve();
    }
    function newNextPromise() {
        nextPromise = new Promise((resolve) => {
            nextPromiseResolve = resolve;
        });
    }
    function registerForServerData(onServerData) {
        const socket = session.socket;
        socket.on('server-data', onServerData);
        return () => {
            socket.off('server-data', onServerData);
        };
    }
};
exports.default = pullFromSession;
