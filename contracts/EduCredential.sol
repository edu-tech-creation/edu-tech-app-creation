// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title EduCredential
/// @notice Issues non-transferable course completion credentials.
contract EduCredential {
    address public immutable issuer;
    uint256 public nextCredentialId;

    struct Credential {
        address learner;
        bytes32 courseId;
        uint16 score;
        uint64 issuedAt;
        bool revoked;
    }

    mapping(uint256 => Credential) private credentials;
    mapping(address => uint256[]) private learnerCredentials;

    event CredentialIssued(uint256 indexed credentialId, address indexed learner, bytes32 indexed courseId, uint16 score);
    event CredentialRevoked(uint256 indexed credentialId);

    modifier onlyIssuer() {
        require(msg.sender == issuer, "EduCredential: caller is not issuer");
        _;
    }

    constructor() {
        issuer = msg.sender;
    }

    function issueCredential(address learner, bytes32 courseId, uint16 score)
        external
        onlyIssuer
        returns (uint256 credentialId)
    {
        require(learner != address(0), "EduCredential: invalid learner");
        require(score <= 100, "EduCredential: score must be <= 100");

        credentialId = ++nextCredentialId;
        credentials[credentialId] = Credential(learner, courseId, score, uint64(block.timestamp), false);
        learnerCredentials[learner].push(credentialId);
        emit CredentialIssued(credentialId, learner, courseId, score);
    }

    function revokeCredential(uint256 credentialId) external onlyIssuer {
        require(credentials[credentialId].learner != address(0), "EduCredential: unknown credential");
        require(!credentials[credentialId].revoked, "EduCredential: already revoked");
        credentials[credentialId].revoked = true;
        emit CredentialRevoked(credentialId);
    }

    function getCredential(uint256 credentialId) external view returns (Credential memory) {
        require(credentials[credentialId].learner != address(0), "EduCredential: unknown credential");
        return credentials[credentialId];
    }

    function getLearnerCredentials(address learner) external view returns (uint256[] memory) {
        return learnerCredentials[learner];
    }
}
