// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CertificationNFT is ERC721, Ownable {
    uint256 private _nextTokenId;
    string private _baseTokenURI;
    mapping(uint256 => string) private _certificateDetails;

    constructor(
        string memory name,
        string memory symbol,
        string memory baseURI
    ) ERC721(name, symbol) Ownable(msg.sender) {
        _baseTokenURI = baseURI;
    }

    function safeMint(address to, string memory certificateData) public onlyOwner {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _certificateDetails[tokenId] = certificateData;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
        return string(abi.encodePacked(_baseTokenURI, Strings.toString(tokenId)));
    }

    function getCertificateDetails(uint256 tokenId) public view returns (string memory) {
        _requireOwned(tokenId);
        return _certificateDetails[tokenId];
    }

    function updateBaseURI(string memory newBaseURI) public onlyOwner {
        _baseTokenURI = newBaseURI;
    }
}