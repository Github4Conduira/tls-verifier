// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@questbook/reclaim-contracts/contracts/Reclaim.sol";

/**
 * Credentials wallet is a smart contract wallet
 * that can be used by submitted a proof of credential
 * via the Reclaim smart contract
 */
contract CredentialsWallet {

	struct PendingLogin {
		uint256 requestId;
	}

	uint32 public constant CREDENTIAL_EXPIRY_S = 1 hours;

	/** The selected application on which the authentication is proved */
	string public application;
	/** The parameters for authentication */
	string public jsonParams;
	/** Addresses that can send txs via this wallet */
	address[] public authorisedSigners;
	/** Addresses where txs can be sent */
	address[] public authorisedEndpoints;

	mapping(address => PendingLogin) private pendingLogins;

	Reclaim private credSc;

	/**
	 * @dev Constructor
	 * @param _application The selected application on which the authentication is proved
	 * @param _jsonParams The parameters for authentication
	 * @param credScAddress The address of the Reclaim smart contract
	 */
	constructor(
		string memory _application,
		string memory _jsonParams,
		address credScAddress
	) {
		credSc = Reclaim(credScAddress);
		application = _application;
		jsonParams = _jsonParams;
	}

	/**
	 * @dev Login with an already claimed credential on the Reclaim smart contract
	 * @param credentialId The ID of the credential
	 */
	function loginWithRequestId(uint256 credentialId) external {
		(
			string memory _application,
			string memory _jsonParams,
			address identity,
			uint32 timestampS,
		) = credSc.mintedCredentials(credentialId);
		require(_areStringsEqual(_application, application), "CredentialsWallet: Wrong application");
		require(_areStringsEqual(_jsonParams, jsonParams), "CredentialsWallet: Wrong jsonParams");
		require(identity == msg.sender, "CredentialsWallet: Identity must be msg.sender");
		require(block.timestamp-timestampS < CREDENTIAL_EXPIRY_S, "CredentialsWallet: Credential expired");

		authorisedSigners.push(msg.sender);
	}

	/**
	 * @dev Start the login process by requesting a credential
	 */
	function startLoginRequest() external payable returns (string[] memory oracleHosts) {
		uint256 requestId;
		(requestId, oracleHosts) = credSc.requestCredentialMint{ value: msg.value }(application, jsonParams);

		pendingLogins[msg.sender] = PendingLogin(requestId);
	}

	/**
	 * @dev Complete the login process by submitting the credential
	 */
	function completeLoginRequest(
		Reclaim.CredentialSignatureData[] calldata credentials
	) external {
		PendingLogin storage pendingLogin = pendingLogins[msg.sender];
		require(pendingLogin.requestId != 0, "CredentialsWallet: No pending login request for this wallet");

		credSc.finaliseCredentialMint(pendingLogin.requestId, credentials);
		authorisedSigners.push(msg.sender);
	}

	/**
	 * from: https://github.com/argentlabs/argent-contracts/blob/320e3d82a8a0625b896e1380e9088812e22db759/contracts/wallet/BaseWallet.sol#L126
     * @notice Performs a generic transaction.
     * @param _target The address for the transaction.
     * @param _data The data of the transaction.
     */
    function invoke(address _target, bytes calldata _data) external payable onlyAuthorisedSigners returns (bytes memory _result) {
        bool success;
        (success, _result) = _target.call{value: msg.value}(_data);
        if(!success) {
            // solhint-disable-next-line no-inline-assembly
            assembly {
                returndatacopy(0, 0, returndatasize())
                revert(0, returndatasize())
            }
        }
    }

	/**
	 * @dev Transfer funds from this contract to another wallet
	 * @param to The address to send the funds to
	 * @param amount The amount of wei to send
	 */
	function transfer(address to, uint256 amount) external onlyAuthorisedSigners {
		payable(to).transfer(amount);
	}

	/**
	 * @dev Remove all authorised signers, leaving only msg.sender
	 */
	function logoutFromAll() external onlyAuthorisedSigners {
		authorisedSigners = [msg.sender];
	}

	/**
	 * @dev Check if a given address is an authorised signer
	 */
	function isAuthorisedSigner(address addr) external view returns (bool) {
		for (uint256 i = 0; i < authorisedSigners.length; i++) {
			if (authorisedSigners[i] == addr) {
				return true;
			}
		}
		return false;
	}

	modifier onlyAuthorisedSigners() {
		bool isAuthorised = false;
		for (uint256 i = 0; i < authorisedSigners.length; i++) {
			if (authorisedSigners[i] == msg.sender) {
				isAuthorised = true;
				break;
			}
		}
		require(isAuthorised, "CredentialsWallet: Not authorised");
		_;
	}

	function _areStringsEqual(string memory a, string storage b) internal pure returns (bool) {
		return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
	}
}