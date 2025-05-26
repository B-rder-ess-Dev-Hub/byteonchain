// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./certificationNFT.sol";

contract CertificationFactory {
    address[] public deployedCertifications;
    
    event CertificationCreated(
        address indexed certificationAddress,
        string name,
        string symbol
    );

    function createCertification(
        string memory name,
        string memory symbol,
        string memory baseURI
    ) public returns (address) {
        CertificationNFT newCertification = new CertificationNFT(
            name,
            symbol,
            baseURI
        );
        
        deployedCertifications.push(address(newCertification));
        emit CertificationCreated(address(newCertification), name, symbol);
        
        // Transfer ownership to the creator
        newCertification.transferOwnership(msg.sender);
        
        return address(newCertification);
    }

    function getDeployedCertifications() public view returns (address[] memory) {
        return deployedCertifications;
    }
}