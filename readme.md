# Reclaim Protocol

A decentralised protocol to generate trustless proofs of API access and use the proof on chain.

## The Problem 

Right now, most of the world's data is locked up in web2 servers and there is no trustless way to use this data on-chain. Here is where our protocol comes in.

1. Let's say you want to prove you have access to a certain gmail account to everyone. The only way you can do that is by either:
	- sharing a screenshot of your gmail account (of course, this is easily spoofed)
	- share your password (A bit obvious why this wouldn't be a good option)
2. Let's look at google's people API for a second now.
	- Its [get people API](https://developers.google.com/people/api/rest/v1/people/get) lets one fetch their email address via an access token
	- Imagine, if you could make this API request and prove to everyone that you made this request to Google's servers -- you could prove, without a doubt, that you own a certain email address.
	- Example of a request & response:
		- request:
		``` http
		GET /v1/people/me?personFields=emailAddresses HTTP/1.1
		Host: people.googleapis.com
		Connection: close
		Content-Length: 0
		Authorization: Bearer {secret-token}


		```
		- response:
		``` http
		HTTP/1.1 200 OK
		Content-length: 382
		X-xss-protection: 0
		Content-location: https://people.googleapis.com/v1/people/me?personFields=emailAddresses
		X-content-type-options: nosniff
		Transfer-encoding: chunked
		Content-type: application/json; charset=UTF-8
		{
			"resourceName": "people/12323123123", 
			"emailAddresses": [
				{
					"value": "abcd@creatoros.co", 
					"metadata": {
						"source": {
						"type": "DOMAIN_PROFILE", 
						"id": "12323123123"
						}, 
						"verified": true, 
						"primary": true, 
						"sourcePrimary": true
					}
				}
			], 
			"etag": "%EgUBCS43PhoEAQIFBw=="
		}
		```
	
3. The Reclaim protocol allows you to fire an API request to gmail proxied through a "verifier" node that observes the traffic sent & received. The protocol allows you to hide certain packets from the verifier (which contain your password or API secret -- in the eg. above it'll be "{secret-token}") & hence, trustlessly prove you've access to an email address.

Read the whitepaper [here](TODO)

## User Flow

The platform is structured as an oracle & smart contract.

1. Alice makes a transaction to the Reclaim smart contract requesting a credential "mint". She provides:
	1. the application -- what app to claim to claim the credential on (eg. "google-login")
	2. parameters of the claim -- parameters specific to the application that she wants to claim. For eg. on google-login, the parameters could be "email":"alice@gmail.com". This implies that Alice wants to claim ownership of the email address `alice@gmail.com`
	3. her identity -- in this case, her wallet address

	This all comes together in the smart contract function `requestCredentialMint(app, jsonParams, identity)`
2. Alice also pays the smart contract an additional fee to mint the credential
3. The Reclaim smart contract then assigns an "ID" to her request & randomly selects N oracles for Alice's request. The request ID & the hostnames of the oracles are then emitted in an event:
	``` solidity
	emit CredentialMintRequested(requestId, oracleHosts);
	```
3. Alice now makes an API request to each of the N oracles to prove she has access to the email address she is trying to claim
4. Each oracle in turn:
	- verifies Alice has paid the fees to the smart contract
	- it also fetches the request parameters from the same, denoted by `(application,jsonParams,identity)`
	- verifies her claim & if valid, returns a signature of the application data which is denoted by `(application,jsonParams,identity,timestamp,requestId)`
5. Alice now sends the Reclaim smart contract the N signatures she received and contract in turn:
	- validates that the signatures sent in by alice were done by the assigned oracles, and no other
	- it also ensures the signatures are valid
	- and finally, marks the request as complete -- releasing part of the fees to each of the oracles & emitting an event
		``` solidity
		emit CredentialMinted(
			application,
			jsonParams,
			identity
		);
		```

## Becoming an Oracle

One can become an oracle only via a whitelist at the moment. A permissionless system is currently in the works.

## Folder Structure

- `node` -- the library & oracle that enables the generation of trustless proofs
- `smart-contract` -- smart contract that mediates the generation of requests
- `browser-example` -- an example of the "google-login" application running in the browser
- `credentials-wallet` -- a smart contract built using Reclaim, enables wallet access using a user specified credential
- `resources` -- common resources that can be used by all packages

## Implementing your own provider

1. Clone tls-receipt-verifier repo
2. Make a new branch from `main`
3. Implement interface `Application` from `node/src/types/applications.cs`. Implementation should be in `node/src/applications` folder
4. You can take `google-login.ts` or `mock-login.ts` as an example
5. Add your application to `index.ts` in `node/src/applications` folder
6. Create a PR

See [node readme](node/README.md) for more info 