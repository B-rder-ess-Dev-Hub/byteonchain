// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";
import "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol";
import "./certificationNFT.sol";

/// @title Certification Factory
/// @notice Deploys upgradeable CertificationNFT contracts via Transparent Proxies
contract CertificationFactory {
    address[] public deployedCertifications;
    address public immutable nftImplementation;
    ProxyAdmin public immutable proxyAdmin;

    /// @notice Emitted when a new Certification NFT contract is deployed
    event CertificationCreated(
        address indexed certificationProxy,
        string indexed name,
        string indexed symbol
    );

    /// @notice Deploys the NFT logic contract and a ProxyAdmin to manage upgrades
    constructor() {
        CertificationNFT impl = new CertificationNFT();
        nftImplementation = address(impl);
        proxyAdmin = new ProxyAdmin(msg.sender);
    }

    /// @notice Deploys a new upgradeable CertificationNFT proxy
    /// @param name Token name
    /// @param symbol Token symbol
    /// @param baseURI Base URI for metadata
    function createCertification(
        string memory name,
        string memory symbol,
        string memory baseURI
    ) external returns (address) {
        bytes memory initData = abi.encodeWithSignature(
            "initialize(string,string,string,address)",
            name,
            symbol,
            baseURI,
            msg.sender
        );

        TransparentUpgradeableProxy proxy = new TransparentUpgradeableProxy(
            nftImplementation,
            address(proxyAdmin),
            initData
        );

        deployedCertifications.push(address(proxy));
        emit CertificationCreated(address(proxy), name, symbol);
        return address(proxy);
    }

    /// @notice Returns all deployed certification proxy addresses
    function getDeployedCertifications() external view returns (address[] memory) {
        return deployedCertifications;
    }
}
