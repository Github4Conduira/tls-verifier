/** @eslint-disable */
// generated file, run 'yarn generate:rpcs-index' to update

import { ServiceImplementation } from '../types'
import cancelSession from './cancelSession'
import finaliseSession from './finaliseSession'
import getVerifierPublicKey from './getVerifierPublicKey'
import initialiseSession from './initialiseSession'
import pullFromSession from './pullFromSession'
import pushToSession from './pushToSession'

const rpcs: ServiceImplementation = {
	cancelSession,
	finaliseSession,
	getVerifierPublicKey,
	initialiseSession,
	pullFromSession,
	pushToSession,
}

export default rpcs