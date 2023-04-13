import { SessionAttachedData, TLSSession } from '../types/sessions';
declare const newSession: (host: string, port: number, attachedData: SessionAttachedData) => Promise<TLSSession>;
export default newSession;
