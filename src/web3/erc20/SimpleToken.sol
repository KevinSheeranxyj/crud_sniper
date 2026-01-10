// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


import "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol";


contract SimpleToken is ERC20PresetMinterPauser {

    uint8 private _decimals;
    uint256 public INITIAL_SUPPLY;



    function decimals() public view override returns (uint8) {
        return _decimals;
    }

    constructor(
        string memory name,
        string memory symbol,
        uint8 
    )



}