import { createContext, PropsWithChildren, useCallback, useMemo, useRef } from 'react'
import { View } from 'react-native'
import WebView from 'react-native-webview'
import type { ZKOperator } from '@questbook/reclaim-zk'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RPCResult = ({ result: any } | { error: string })
type RPCMessage = ({ id: string } & RPCResult)
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	| { type: 'console', level: 'log' | 'info' | 'warn' | 'error', data: any[] }

type WebViewZkOperatorState = {
	operator: ZKOperator
}

const initialState: WebViewZkOperatorState = {
	operator: {
		groth16FullProve() {
			throw new Error('operator not initialised')
		},
		groth16Verify() {
			throw new Error('operator not initialised')
		}
	}
}

export const WebViewZKOperatorContext = createContext(initialState)

export function WebViewZkOperatorProvider({ children }: PropsWithChildren<{}>) {
	const { operator, webview } = useWebviewZkOperator()

	return (
		<WebViewZKOperatorContext.Provider value={{ operator }}>
			{/**
			 * hide the webview,
			 * this will just run in the background
			 * and will run the ZK operations when required
			 * */}
			<View
				// eslint-disable-next-line react-native/no-inline-styles
				style={{ height: 0 }}>
				{webview}
			</View>
			{children}
		</WebViewZKOperatorContext.Provider>
	)
}

/**
 * Since snarkjs doesn't work directly on RN,
 * we need to use a webview to do the work.
 */
export function useWebviewZkOperator() {
	const webviewRef = useRef<WebView | null>()
	const pendingRpcs = useRef<{ [_: string]: (r: RPCResult) => void }>({})

	/**
	 * Execute some code in the webview & expect a result.
	 * @param code the code to execute
	 * For eg. `snarkjs.groth16.fullProve(...)`
	 * @returns the result of the code
	 */
	const rpc = useCallback(
		async(code: string) => {
			const requestId = Math.random().toString(16).replace('.', '')
			// unique function name
			const rpcName = `rpc_${requestId}`
			// generate code to execute in the webview
			const fullCode = `
				async function ${rpcName}() {
					try {
						// in case snarkjs or the zkparams are not ready
						// wait for them to be ready
						while(!window.snarkjs) {
							await new Promise(resolve => setTimeout(resolve, 100))
						}
						while(!window.zkParams) {
							await new Promise(resolve => setTimeout(resolve, 100))
						}
						const result = await ${code}
						window.ReactNativeWebView.postMessage(JSON.stringify({
							id: '${requestId}',
							result
						}))
					} catch(err) {
						console.error('err in RPC: ' + err.stack)
						window.ReactNativeWebView.postMessage(JSON.stringify({
							id: '${requestId}',
							error: err.message
						}))
					}
				}
	
				${rpcName}()
				// some weird requirement from react-native-webview
				// to add true to the end of the injected code
				true
			`

			// create a promise that will be resolved when the webview
			// sends a message with the result
			const promise = new Promise<RPCResult>(resolve => {
				pendingRpcs.current[requestId] = resolve
			})

			// execute the code in the webview
			webviewRef.current!.injectJavaScript(fullCode)

			// wait for the result
			// and return the result or throw an error
			const result = await promise
			delete pendingRpcs.current[requestId]

			if('error' in result) {
				throw new Error(`RPC error: '${result.error}'`)
			}

			return result.result
		},
		[]
	)

	const operator = useMemo<ZKOperator>(
		() => {
			return {
				groth16FullProve(input) {
					return rpc(`snarkjs.groth16.fullProve(
							${JSON.stringify(input)},
							window.zkParams.wasm,
							window.zkParams.zkey,
							console
						)`)
				},
				groth16Verify() {
					throw new Error('Not implemented')
				},
			}
		},
		[rpc]
	)

	return {
		operator,
		webview: (
			<WebView
				ref={r => webviewRef.current = r}
				originWhitelist={['*']}
				source={{ html: HTML }}
				onMessage={
					data => {
						const rpcResult = data.nativeEvent.data
						const parsed = JSON.parse(rpcResult) as RPCMessage
						// log console messages from the webview
						if('type' in parsed && parsed.type === 'console') {
							// eslint-disable-next-line no-console
							console[parsed.level]('[WebView]', ...parsed.data)
							return
						} else if('id' in parsed) {
							const { id } = parsed
							const callback = pendingRpcs.current[id]
							callback?.(parsed)
						}
					}
				}
			/>
		)
	}
}

const HTML = `
<html>
<head>
	<script>
		// load async, because raw github content type is text/plain
		// which prevents the browser from executing it
		async function loadSnarkJs() {
			const result = await fetch(
				'https://raw.githubusercontent.com/iden3/snarkjs/v0.5.0/build/snarkjs.min.js'
			)
			const txt = await result.text()
			
			const elem = document.createElement('script')
			elem.innerText = txt
			document.body.appendChild(elem)

			console.log('loaded snarkjs')
		}

		loadSnarkJs()
	</script>

	<script>
		// from: https://stackoverflow.com/a/21797381
		function base64ToArrayBuffer(base64) {
			var binary_string = window.atob(base64)
			var len = binary_string.length
			var bytes = new Uint8Array(len)
			for (var i = 0; i < len; i++) {
				bytes[i] = binary_string.charCodeAt(i)
			}
			return bytes
		}

		// load ZK params from a hosted JSON
		// as the JSON is too large to be included in the HTML directly
		async function loadZkParams() {
			const result = await fetch(
				// tmp url till we make the repo public,
				// then we'll use the github url
				'https://s3.ap-east-1.amazonaws.com/chatdaddy-media-store/938e3450c3f324b1'
			)
			const json = await result.json()
			window.zkParams = {
				wasm: base64ToArrayBuffer(json.wasm),
				zkey: base64ToArrayBuffer(json.zkey.data),
			}
			console.log('got zk params')
		}

		loadZkParams()
	</script>

	<script>
		// code to send logs to RN
		const consoleLog = (level, log) => 
			window.ReactNativeWebView.postMessage(
				JSON.stringify({ 'type': 'console', level, 'data': [log] })
			)
		console = {
			log: (log) => consoleLog('log', log),
			debug: (log) => consoleLog('debug', log),
			info: (log) => consoleLog('info', log),
			warn: (log) => consoleLog('warn', log),
			error: (log) => consoleLog('error', log),
		};

		window.onunhandledrejection = (err) => {
			console.error(\`unhandled reject: \$\{err\}\`)
		}
	</script>
</head>
<body>
	snarkJS runner
</body>
</html>
`