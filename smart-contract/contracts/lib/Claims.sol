// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "./StringUtils.sol";

/**
 * Library to assist with requesting,
 * serialising & verifying credentials
 */
library Claims {
	/** Data required to request a credential */
	struct Claim {
		bytes32 infoHash;
		address owner;
		uint32 timestampS;
		uint256 claimId;
	}

	/** Credential with signature & signer */
	struct SignedClaim {
		Claim claim;
		bytes signature;
	}

	/**
	 * @dev recovers the signer of the credential
	 */
	function recoverSigner(SignedClaim memory self) internal pure returns (address) {
		bytes memory serialised = serialise(self.claim);
		address signer = verifySignature(serialised, self.signature);
		return signer;
	}

	/**
	 * @dev serialises the credential into a string;
	 * the string is used to verify the signature
	 *
	 * the serialisation is the same as done by the TS library
	 */
	function serialise(Claim memory self) internal pure returns (bytes memory) {
		return
			abi.encodePacked(
				StringUtils.bytes2str(abi.encodePacked(self.infoHash)),
				"\n",
				StringUtils.address2str(self.owner),
				"\n",
				StringUtils.uint2str(self.timestampS),
				"\n",
				StringUtils.uint2str(self.claimId)
			);
	}

	/**
	 * @dev returns the address of the user that generated the signature
	 */
	function verifySignature(
		bytes memory content,
		bytes memory signature
	) internal pure returns (address signer) {
		bytes32 signedHash = keccak256(
			abi.encodePacked(
				"\x19Ethereum Signed Message:\n",
				StringUtils.uint2str(content.length),
				content
			)
		);
		return ECDSA.recover(signedHash, signature);
	}
}
