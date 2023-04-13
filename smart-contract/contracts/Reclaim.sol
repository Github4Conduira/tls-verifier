// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "./lib/Claims.sol";
import "./lib/Random.sol";

contract Reclaim is Initializable, UUPSUpgradeable, OwnableUpgradeable {
	struct Witness {
		/** ETH address of the witness */
		address addr;
		/** Host to connect to the witness */
		string host;
	}

	struct ClaimCreate {
		Claims.Claim claim;
		/** address who made the create request */
		address requestor;
		/** fee paid for the request */
		uint256 feesPaid;
		/** witnesses assigned to this request */
		address[] assignedWitnesses;
	}

	/** list of all registered witnesses */
	Witness[] public witnesses;
	/** mapping of request ID to paid created claim */
	mapping(uint256 => ClaimCreate) public claimCreations;
	/** latest request ID counter */
	uint256 public latestRequestId;
	/** fees to create a claim */
	uint256 public createFees;
	/** the percentage of the fees the smart contract keeps */
	uint8 public scFeesKeepPercentage;
	/** the minimum number of witnesses required to create a claim */
	uint8 public minimumWitnessesForClaimCreation;
	/** whitelist of addresses that can become witnesses */
	mapping(address => bool) private witnessWhitelistMap;
	/** used expiry timestamps, that act as a nonce for requesting creation for others */
	mapping(uint64 => bool) private usedExpiryTimestamps;

	/** max lifetime for a claim to be sent in from an witness */
	uint256 public constant MAX_CLAIM_LIFETIME_S = 15 * 60; // 15 minutes

	event ClaimCreated(uint256 requestId);

	event ClaimCreationRequested(
		uint256 claimId,
		bytes32 infoHash,
		address owner,
		uint32 timestampS,
		address requestor,
		string[] witnessHosts,
		address[] witnessAddresses,
		uint256 feesPaid
	);

	/**
	 * @notice Calls initialize on the base contracts
	 *
	 * @dev This acts as a constructor for the upgradeable proxy contract
	 */
	function initialize() external initializer {
		__Ownable_init();
		/** latest request ID counter */
		latestRequestId = 0;
		/** fees to create a claim */
		createFees = 0.001 ether;
		/** the percentage of the fees the smart contract keeps */
		scFeesKeepPercentage = 1;
		/** the minimum number of witnesses required to create a claim */
		minimumWitnessesForClaimCreation = 5;
	}

	/**
	 * @notice Override of UUPSUpgradeable virtual function
	 *
	 * @dev Function that should revert when `msg.sender` is not authorized to upgrade the contract. Called by
	 * {upgradeTo} and {upgradeToAndCall}.
	 */
	function _authorizeUpgrade(address) internal view override onlyOwner {}

	/**
	 * @dev Request a claim creation for another address
	 * @param signature signature done by the address being created for,
	 *  to ensure the person does consent to claim creation
	 * @param infoHash hash of the information to be included in the claim
	 * @param expiryTimestampMs Unix timestamp in milliseconds when the request expires;
	 *		after this time, the request will be rejected.
	 *		If a request with the same expiry is sent again, it will be rejected.
	 * 		This is to prevent replay attacks.
	 * @return ID of the request, hosts of the witnesses assigned to the request
	 */
	function requestClaimCreateForAnother(
		bytes calldata signature,
		bytes32 infoHash,
		uint64 expiryTimestampMs
	) external payable returns (uint256, string[] memory) {
		uint32 expiryTimestampS = uint32(expiryTimestampMs / 1000);
		require(expiryTimestampS >= block.timestamp, "Request expired");
		require(!usedExpiryTimestamps[expiryTimestampS], "Request already used");

		Claims.SignedClaim memory cred = Claims.SignedClaim(
			Claims.Claim(infoHash, msg.sender, expiryTimestampS, 0),
			signature
		);
		// finally check the signature & timestamp
		address identity = Claims.recoverSigner(cred);

		usedExpiryTimestamps[expiryTimestampMs] = true;

		return _requestClaimCreate(identity, infoHash);
	}

	/**
	 * @dev Request a claim creation
	 * @param infoHash hash of the information to be included in the claim
	 */
	function requestClaimCreate(
		bytes32 infoHash
	) external payable returns (uint256, string[] memory) {
		return _requestClaimCreate(msg.sender, infoHash);
	}

	/**
	 * @dev Request claim creation
	 */
	function _requestClaimCreate(
		address owner,
		bytes32 infoHash
	) internal returns (uint256, string[] memory) {
		require(msg.value >= createFees, "Insufficient fees paid");
		uint32 timestampS = uint32(block.timestamp);
		address requestor = msg.sender;

		latestRequestId += 1;
		// get the requisite number of witnesses to create a claim
		uint8 requisiteWitnesses = requisiteWitnessesForClaimCreate();
		require(requisiteWitnesses > 0, "No witnesses registered");
		// store the request data
		claimCreations[latestRequestId] = ClaimCreate(
			Claims.Claim(infoHash, owner, timestampS, latestRequestId),
			requestor,
			msg.value,
			new address[](requisiteWitnesses)
		);

		// pick random witnesses to assign to the request
		string[] memory witnessHosts = pickRandomWitnesses(
			claimCreations[latestRequestId].assignedWitnesses,
			latestRequestId
		);
		emit ClaimCreationRequested(
			latestRequestId,
			infoHash,
			owner,
			timestampS,
			requestor,
			witnessHosts,
			claimCreations[latestRequestId].assignedWitnesses,
			msg.value
		);

		return (latestRequestId, witnessHosts);
	}

	/**
	 * Get the assigned witnesses for a request
	 * @param requestId ID of the request
	 */
	function getClaimWitnesses(
		uint256 requestId
	) external view returns (address[] memory) {
		return claimCreations[requestId].assignedWitnesses;
	}

	// witness functions ---

	/**
	 * @dev Remove the sender from the list of witnesses
	 * @notice any pending requests with this witness will continue to be processed
	 * However, no new requests will be assigned to this witness
	 */
	function removeAsWitness(address witnessAddress) external {
		require(
			msg.sender == owner() || msg.sender == witnessAddress,
			"Only owner or witness can remove itself"
		);

		for (uint256 i = 0; i < witnesses.length; i++) {
			if (witnesses[i].addr == witnessAddress) {
				witnesses[i] = witnesses[witnesses.length - 1];
				witnesses.pop();
				return;
			}
		}

		revert("Not an witness");
	}

	/**
	 * @dev Add the given address as an witness to the list of witnesses
	 * @param witnessAddress address of the witness
	 * @param host host:port of the witness (must be grpc-web compatible)
	 */
	function addAsWitness(address witnessAddress, string calldata host) external {
		require(
			canAddAsWitness(witnessAddress) &&
				(msg.sender == owner() || witnessAddress == msg.sender),
			"Only owner or the whitelisted wallet can add an witness"
		);

		for (uint256 i = 0; i < witnesses.length; i++) {
			require(witnesses[i].addr != witnessAddress, "Witness already exists");
		}

		witnesses.push(Witness(witnessAddress, host));
	}

	// admin functions ---

	function updateCreationFees(uint256 newCreationFees) external onlyOwner {
		createFees = newCreationFees;
	}

	function updateWitnessWhitelist(address addr, bool isWhitelisted) external onlyOwner {
		if (isWhitelisted) {
			witnessWhitelistMap[addr] = true;
		} else {
			delete witnessWhitelistMap[addr];
		}
	}

	function updateSmartContractFeesKeepPercentage(
		uint8 newPercentage
	) external onlyOwner {
		require(newPercentage <= 100, "Percentage must be between 0 and 100");
		scFeesKeepPercentage = newPercentage;
	}

	/**
	 * @dev Transfer some ETH to the given address
	 */
	function transfer(address to, uint256 amount) external onlyOwner {
		payable(to).transfer(amount);
	}

	// internal code -----

	/**
	 * @dev Pick a random set of witnesses from the available list of witnesses
	 * @param witnessAddresses Array to store the addresses of the witnesses
	 * @return Array of the hosts of the witnesses
	 */
	function pickRandomWitnesses(
		address[] storage witnessAddresses,
		uint256 seed
	) internal returns (string[] memory) {
		require(
			witnessAddresses.length <= witnesses.length,
			"Internal Error, Not Enough Witnesses"
		);
		Witness[] memory tempWitnesses = witnesses;
		uint256 witnessesLeft = tempWitnesses.length;

		string[] memory witnessHosts = new string[](witnessAddresses.length);
		for (uint8 i = 0; i < witnessAddresses.length; i++) {
			uint256 idx = Random.random(seed + i) % witnessesLeft;
			witnessAddresses[i] = tempWitnesses[idx].addr;
			witnessHosts[i] = tempWitnesses[idx].host;

			// we've utilised witness at index "idx"
			// we of course don't want to pick the same witness twice
			// so we remove it from the list of witnesses
			// and reduce the number of witnesses left to pick from
			// since solidity doesn't support "pop()" in memory arrays
			// we swap the last element with the element we want to remove
			tempWitnesses[idx] = tempWitnesses[witnessesLeft - 1];
			witnessesLeft -= 1;
		}
		return witnessHosts;
	}

	/**
	 * @dev Get the number of witnesses required to create a claim
	 */
	function requisiteWitnessesForClaimCreate() internal view returns (uint8) {
		// at least N witnesses are required
		// or the number of witnesses registered, whichever is lower
		return uint8(Math.min(minimumWitnessesForClaimCreation, witnesses.length));
	}

	/**
	 * @dev Get the fees that is not kept by the smart contract
	 */
	function getDisposableFees(uint256 feesPaid) internal view returns (uint256) {
		// return a % of the fees paid
		return (feesPaid * (100 - scFeesKeepPercentage)) / 100;
	}

	function canAddAsWitness(address addr) internal view returns (bool) {
		return witnessWhitelistMap[addr];
	}

	function uintDifference(uint256 a, uint256 b) internal pure returns (uint256) {
		if (a > b) {
			return a - b;
		}

		return b - a;
	}
}
