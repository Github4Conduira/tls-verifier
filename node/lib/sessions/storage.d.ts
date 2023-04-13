import { TLSSession } from '../types/sessions';
declare const storage: {
    [id: string]: TLSSession;
};
export declare function closeAllSessions(): void;
export default storage;
