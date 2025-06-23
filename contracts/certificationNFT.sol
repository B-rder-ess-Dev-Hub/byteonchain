// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/Ownable2StepUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract CertificationNFT is Initializable, ERC721Upgradeable, Ownable2StepUpgradeable {
    using Strings for uint256;

    uint256 private _nextTokenId;
    string private _baseTokenURI;
    mapping(uint256 tokenId => string certificateData) private _certificateDetails;
    mapping(address owner => bool hasMinted) private _owners;
    mapping(address owner => uint256 tokenID) private _tokenIDs;

    // 🔊 Events for tracking
    event CertificateMinted(address indexed to, uint256 indexed tokenId, string certificateData);
    event BaseURIUpdated(string newBaseURI);

    modifier notMinted() {
        require(_owners[msg.sender] == false, "User can only mint Once");
        _;
    }

    /// @notice Initializes the contract with name, symbol, base URI and owner
    /// @param name Name of the ERC721 token
    /// @param symbol Symbol of the ERC721 token
    /// @param baseURI Base URI for token metadata
    /// @param owner Address to be assigned as the contract owner
    function initialize(
        string memory name,
        string memory symbol,
        string memory baseURI,
        address owner
    ) public initializer {
        require(owner != address(0), "Owner cannot be zero address");
        __ERC721_init(name, symbol);
        __Ownable_init(owner);
        _baseTokenURI = baseURI;
    }

    /// @notice Mints a new certificate NFT to the specified address
    /// @param certificateData Certificate metadata
    function safeMint(string memory certificateData) public notMinted{
        uint256 tokenId = _nextTokenId++;
        _certificateDetails[tokenId] = certificateData; // ✅ Set state before external call
        _owners[msg.sender] = true;
        _tokenIDs[msg.sender] = tokenId;
        _safeMint(msg.sender, tokenId);
        emit CertificateMinted(msg.sender, tokenId, certificateData);
    }

    /// @notice Returns the token metadata URI
    function tokenURI() public view returns (string memory) {
        string memory tokenId = getCertificateDetails();
        return string.concat(_baseTokenURI, tokenId);
    }

    /// @notice Returns the certificate data associated with a token ID
    function getCertificateDetails() public view returns (string memory) {
        uint256 id = _tokenIDs[msg.sender];
        _requireOwned(id);
        return _certificateDetails[id];
    }

    /// @notice Updates the base URI (only if different)
    /// @param newBaseURI The new base URI to use
    function updateBaseURI(string memory newBaseURI) public onlyOwner {
        if (keccak256(bytes(_baseTokenURI)) != keccak256(bytes(newBaseURI))) {
            _baseTokenURI = newBaseURI;
            emit BaseURIUpdated(newBaseURI);
        }
    }
}
