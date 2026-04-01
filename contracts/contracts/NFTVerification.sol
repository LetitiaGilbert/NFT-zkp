// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./Verifier.sol";

/**
 * @title NFTVerification
 * @notice Main contract for NFT ownership verification using ZKP
 *
 * This contract:
 * 1. Stores verification state
 * 2. Allows users to submit and verify ZKP proofs
 * 3. Emits events for proof verification results
 */
contract NFTVerification {
    // Reference to the Groth16 verifier
    Verifier public verifier;

    // Events
    event ProofVerified(
        address indexed user,
        uint256 indexed timestamp,
        bool result,
        uint256[2] publicSignals
    );

    event VerifierUpdated(address indexed newVerifier);

    // State: Track verified claims
    mapping(address => bool) public verifiedUsers;
    mapping(address => uint256) public lastVerificationTime;

    constructor(address _verifier) {
        require(_verifier != address(0), "Invalid verifier address");
        verifier = Verifier(_verifier);
    }

    /**
     * @notice Submit a ZKP proof for verification
     * @param proof The Groth16 proof [a, b, c] (8 uint256 values)
     * @param publicSignals The public signals [expectedOwnerHash, expectedCollectionId]
     * @return isValid True if proof is valid
     */
    function verifyNFTOwnership(
        uint256[8] calldata proof,
        uint256[] calldata publicSignals
    ) external returns (bool isValid) {
        require(publicSignals.length == 2, "Invalid public signals");

        // Verify the proof
        isValid = verifier.verifyProof(proof, publicSignals);

        // Log the verification
        emit ProofVerified(
            msg.sender,
            block.timestamp,
            isValid,
            [publicSignals[0], publicSignals[1]]
        );

        // Update verification state
        if (isValid) {
            verifiedUsers[msg.sender] = true;
            lastVerificationTime[msg.sender] = block.timestamp;
        }

        return isValid;
    }

    /**
     * @notice Check if a user has a valid verification
     * @param user The user address to check
     * @return bool True if user has been verified
     */
    function isVerified(address user) external view returns (bool) {
        return verifiedUsers[user];
    }

    /**
     * @notice Get the last verification timestamp for a user
     * @param user The user address
     * @return uint256 The timestamp of last verification (0 if never verified)
     */
    function getLastVerificationTime(address user) external view returns (uint256) {
        return lastVerificationTime[user];
    }

    /**
     * @notice Update the verifier contract (admin function)
     * @param _newVerifier The address of the new verifier contract
     */
    function updateVerifier(address _newVerifier) external {
        require(_newVerifier != address(0), "Invalid verifier address");
        verifier = Verifier(_newVerifier);
        emit VerifierUpdated(_newVerifier);
    }

    /**
     * @notice Clear verification for a user (admin function)
     * @param user The user address
     */
    function clearVerification(address user) external {
        delete verifiedUsers[user];
        delete lastVerificationTime[user];
    }
}
