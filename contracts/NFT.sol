// SPDX-License-Identifier: BSD-3-Clause
pragma solidity ^0.8.0;

// We first import some OpenZeppelin Contracts.
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

// We inherit the contract we imported. This means we'll have access
// to the inherited contract's methods.
contract NFT is ERC721URIStorage {
    // Magic given to us by OpenZeppelin to help us keep track of tokenIds.
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // We need to pass the name of our NFTs token and it's symbol.
    constructor() ERC721 ("ScopeNFT", "SCP") {
        console.log("This is my NFT contract. Woah!");
    }

    // A function our user will hit to get their NFT.
    function makeAnNFT() public {
        // Get the current tokenId, this starts at 0.
        uint256 newItemId = _tokenIds.current();

        // Actually mint the NFT to the sender using msg.sender.
        _safeMint(msg.sender, newItemId);

        // Set the NFTs data.
        _setTokenURI(newItemId, "data:application/json;base64,ew0KICAgICJuYW1lIjogIlNjb3BlIiwNCiAgICAiZGVzY3JpcHRpb24iOiAiICIsDQogICAgImltYWdlIjogImRhdGE6aW1hZ2Uvc3ZnK3htbDtiYXNlNjQsUEQ5NGJXd2dkbVZ5YzJsdmJqMGlNUzR3SWlCemRHRnVaR0ZzYjI1bFBTSnVieUkvUGcwS1BDRkVUME5VV1ZCRklITjJaeUJRVlVKTVNVTWdJaTB2TDFjelF5OHZSRlJFSUZOV1J5QXhMakV2TDBWT0lnMEtJbWgwZEhBNkx5OTNkM2N1ZHpNdWIzSm5MMGR5WVhCb2FXTnpMMU5XUnk4eExqRXZSRlJFTDNOMlp6RXhMbVIwWkNJK0RRbzhjM1puSUhkcFpIUm9QU0k0TURCd2VDSWdhR1ZwWjJoMFBTSTRNREJ3ZUNJZ2MzUjViR1U5SW1KaFkydG5jbTkxYm1RdFkyOXNiM0k2SUdKc1lXTnJJaUIyYVdWM1FtOTRQU0l3SURBZ09EQXdJRGd3TUNJTkNpQWdJQ0FnZG1WeWMybHZiajBpTVM0eElpQjRiV3h1Y3owaWFIUjBjRG92TDNkM2R5NTNNeTV2Y21jdk1qQXdNQzl6ZG1jaURRb2dJQ0FnSUhodGJHNXpPbmhzYVc1clBTSm9kSFJ3T2k4dmQzZDNMbmN6TG05eVp5OHhPVGs1TDNoc2FXNXJJajRnUENFdExTQk9iM1JsSUhSb1lYUWdkR2hwY3lCcGN5QnlaWEYxYVhKbFpDQnBiaUJ2Y21SbGNpQjBieUIxYzJVZ2VHeHBibXNnYVc0Z2RHaGxJRHgxYzJVK0lHVnNaVzFsYm5RdUlDMHRQZzBLSUNBOGRHbDBiR1UrVTFaSElFTnBjbU5zWlNCQmJtbHRZWFJwYjI0Z1pYaGhiWEJzWlR3dmRHbDBiR1UrRFFvZ0lEeGtaWE5qUGtSbFkyeGhjbUYwYVhabElGTldSeUJoYm1sdFlYUnBiMjRnWm05eUlISnZkR0YwYVc1bklHRWdZMmx5WTJ4bExqd3ZaR1Z6WXo0TkNpQWdQR2NnZEhKaGJuTm1iM0p0UFNKMGNtRnVjMnhoZEdVb05EQXdMQ0EwTURBcElqNGdQQ0V0TFNCRGNtVmhkR1VnWVNCRFlYSjBaWE5wWVc0Z1kyOXZjbVJwYm1GMFpTQnplWE4wWlcwZ0tIZHBkR2dnZEdobElIa3RZWGhwY3lCbWJHbHdjR1ZrS1NCbWIzSWdkR2hsSUdGdWFXMWhkR1ZrSUhOeGRXRnlaUzRnVkdoaGRDQnBjeXdnY0d4aFkyVWdkR2hsSUc5eWFXZHBiaUJoZENCMGFHVWdZMlZ1ZEdWeUlHOW1JSFJvWlNBNE1EQWdlQ0E0TURBZ1UxWkhJSFpwWlhkd2IzSjBMaUF0TFQ0Z0RRb2dJQ0FnUEdOcGNtTnNaU0JqZUQwaU1DSWdZM2s5SWpBaUlISTlJalF3SWlCemRIbHNaVDBpWm1sc2JEcHlaMkpoS0RBc01Dd3dMREFwTzNOMGNtOXJaVHAzYUdsMFpUc2djM1J5YjJ0bExYZHBaSFJvT2pNd095QnpkSEp2YTJVdFpHRnphR0Z5Y21GNU9qRTRMQ0F4T0RzaVBnMEtJQ0FnSUNBZ1BHRnVhVzFoZEdWVWNtRnVjMlp2Y20wZ1lYUjBjbWxpZFhSbFZIbHdaVDBpZUcxc0lpQmhkSFJ5YVdKMWRHVk9ZVzFsUFNKMGNtRnVjMlp2Y20waUlIUjVjR1U5SW5KdmRHRjBaU0lnWm5KdmJUMGlNQ0lnZEc4OUlqTTJNQ0lnWW1WbmFXNDlJakFpSUdSMWNqMGlOWE1pSUhKbGNHVmhkRU52ZFc1MFBTSnBibVJsWm1sdWFYUmxJaUF2UGcwS0lDQWdJRHd2WTJseVkyeGxQZzBLSUNBZ0lEeHNhVzVsSUhneFBTSXRNakFpSUhreFBTSXdJaUI0TWowaU1qQWlJSGt5UFNJd0lpQnpkSGxzWlQwaWMzUnliMnRsT2lCM2FHbDBaVHNpSUM4K0lEd2hMUzBnVW1Wd2NtVnpaVzUwY3lCMGFHVWdlQzFoZUdsekxpQXRMVDROQ2lBZ0lDQThiR2x1WlNCNE1UMGlNQ0lnZVRFOUlpMHlNQ0lnZURJOUlqQWlJSGt5UFNJeU1DSWdjM1I1YkdVOUluTjBjbTlyWlRvZ2QyaHBkR1U3SWlBdlBpQThJUzB0SUZKbGNISmxjMlZ1ZEhNZ2RHaGxJSGt0WVhocGN5QW9ZV3gwYUc5MVoyZ2dkWEFnYVhNZ2JtVm5ZWFJwZG1VZ1lXNWtJR1J2ZDI0Z2FYTWdjRzl6YVhScGRtVXBMaUF0TFQ0Z0lBMEtJQ0E4TDJjK0RRbzhMM04yWno0PSINCn0=");

        // Increment the counter for when the next NFT is minted.
        _tokenIds.increment();

        console.log("An NFT w/ ID %s has been minted to %s", newItemId, msg.sender);
    }
}