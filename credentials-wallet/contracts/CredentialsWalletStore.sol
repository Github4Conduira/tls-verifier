// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./CredentialsWallet.sol";

/**
 * The credentials wallet store contains a map
 * of all deployed credential wallets that are uniquely identified
 * by the tuple (application,jsonParams).
 * Eg. a user can have a wallet by proving access to their LinkedIn account
 * that can be easily fetched from this contract
 * using the tuple ('linkedin','{"username":"abcd"}').
 */
contract CredentialsWalletStore {

	/** map of all deployed contracts */
	mapping(bytes32 => CredentialsWallet) public deployedWallets;
	/** address of the reclaim smart contract */
	address public credScAddress;

	event DeployedCredentialsWallet(address web2WalletAddress);

	constructor(address _credScAddress) {
		credScAddress = _credScAddress;
	}

	/**
	 * @dev Deploy a new CredentialsWallet contract.
	 * Each CredentialsWallet contract is uniquely identified
	 * by the application and jsonParams.
	 */
	function deployCredentialsWallet(
		string calldata application,
		string calldata jsonParams
	) external returns (address) {
		bytes32 key = serialiseApplicationJsonParams(application, jsonParams);
		// ensure the wallet hasn't already been deployed
		require(deployedWallets[key] == CredentialsWallet(address(0)), "CredentialsWalletStore: Wallet already deployed");
		deployedWallets[key] = new CredentialsWallet(application, jsonParams, credScAddress);

		address web2WalletAddress = address(deployedWallets[key]);

		emit DeployedCredentialsWallet(web2WalletAddress);

		return web2WalletAddress;
	}
	/**
	 * @dev Get the address of the CredentialsWallet contract
	 * for the given application and jsonParams
	 */
	function getCredentialsWalletAddress(
		string calldata application,
		string calldata jsonParams
	) external view returns (address) {
		bytes32 key = serialiseApplicationJsonParams(application, jsonParams);
		address web2WalletAddress = address(deployedWallets[key]);
		require(web2WalletAddress != address(0), "CredentialsWalletStore: Wallet not deployed");
		return web2WalletAddress;
	}

	/**
	 * @dev serialise application & jsonParams into a usable key in a map
	 * */
	function serialiseApplicationJsonParams(
		string calldata application,
		string calldata jsonParams
	) internal pure returns (bytes32) {
		return keccak256(abi.encodePacked(application, jsonParams));
	}
}