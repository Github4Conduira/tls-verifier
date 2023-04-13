import { Logger } from 'pino';
import { TlsCipherSuiteType, TLSReceipt } from '../proto/api';
import { TLSSession } from '../types/sessions';
export declare function generateSessionReceipt(session: TLSSession, cipherSuiteType: TlsCipherSuiteType, logger?: Logger): Promise<TLSReceipt>;
