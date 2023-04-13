import { join } from "path";
import { ZKParams } from "./types";

export function loadZKParamsLocally(): ZKParams {
	return {
		zkey: {
			data: join(
				__dirname,
				'../resources/circuit_final.zkey'
			)
		},
		circuitWasm: join(
			__dirname,
			'../resources/circuit.wasm'
		)
	}
}