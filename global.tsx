import { PublicKey } from "@solana/web3.js";

export interface NFTInfo {
    name: String,
    imageUrl: String,
    mint: PublicKey,
    jsonUrl: String,
    tokenAccount: PublicKey,
    tokenType: Number,
    daysPassed: Number,
    rewardATA: String,
    tokenTo: String,
}

export interface StateInfo {
    solBalance: Number,
    tokenBalance: Number,
    wobList: NFTInfo[],
    degenList: NFTInfo[],
    nftList: NFTInfo[],
    burnList: any[],
    stakeList: NFTInfo[]
}

