import React, { useEffect, useMemo } from 'react';
import { useAnchorWallet, useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";
import { Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { getParsedNftAccountsByOwner } from '@nfteyez/sol-rayz';
import axios from 'axios';

/**
 * CONSTANTS
 */
const WOBTOKEN = process.env.REACT_APP_WOBTOKEN;
const COLLECTION_NAME = process.env.REACT_APP_COLLECTION_NAME;


const App = React.createContext({});

export function useBlockchainContext() {
    return React.useContext(App);
}

function reducer(state: any, { type, payload }: any) {
    return {
        ...state,
        [type]: payload,
    };
}

interface NFTInfo {
    name: string,
    imageUrl: string,
    mint: PublicKey,
    jsonUrl: string,
    tokenAccount: PublicKey,
    tokenType: Number,
    daysPassed: Number,
    rewardATA: String,
    tokenTo: String,
}

interface StateInfo {
    solBalance: Number,
    tokenBalance: Number,
    wobList: NFTInfo[],
    degenList: NFTInfo[],
    nftList: NFTInfo[],
}

const INIT_STATE: StateInfo = {
    solBalance: 0,
    tokenBalance: 0,
    wobList: [],
    degenList: [],
    nftList: [],
}

export default function Provider({ children }: any) {

    const [state, dispatch] = React.useReducer(reducer, INIT_STATE);
    // const wallet = useWallet();
    const wallet = useAnchorWallet();
    // const wallet1 = useAnchorWallet();
    const connection = new anchor.web3.Connection(
        process.env.REACT_APP_CLUSTER_RPC!
    );

    const anchorWallet = useMemo(() => {
        if (
            !wallet ||
            !wallet.publicKey ||
            !wallet.signAllTransactions ||
            !wallet.signTransaction
        ) {
            return;
        }
        return {
            publicKey: wallet.publicKey,
            signAllTransactions: wallet.signAllTransactions,
            signTransaction: wallet.signTransaction,
        } as anchor.Wallet;
    }, [wallet])

    const getProvider = () => {
        if (wallet)
            return new anchor.Provider(connection, wallet as anchor.Wallet, "confirmed" as anchor.web3.ConfirmOptions);
    }

    const getSolBalance = async () => {
        let balance;
        if (anchorWallet) {
            balance = await connection.getBalance(anchorWallet.publicKey);
            balance = balance / LAMPORTS_PER_SOL;
        } else {
            balance = 0;
        }
        return balance;
    }

    const getTokenBalance = async (TOKEN_ADDR: any) => {
        let balance;
        if (anchorWallet) {
            let signer = new Keypair();
            let tokenPublicKey = new PublicKey(TOKEN_ADDR);
            let token = new Token(
                connection,
                tokenPublicKey,
                TOKEN_PROGRAM_ID,
                signer
            );
            try {
                let tokenAccount = await token.getOrCreateAssociatedAccountInfo(
                    anchorWallet.publicKey
                );
                const walletTokenBalance = await connection.getTokenAccountBalance(
                    tokenAccount.address
                );
                balance = walletTokenBalance.value.uiAmount;
            } catch (err) {
                balance = 0;
            }
        } else {
            balance = 0;
        }
        return balance
    }

    const getNftList = async () => {
        let wobList: NFTInfo[] = [];
        let degenList: NFTInfo[] = [];
        let nftList: NFTInfo[] = [];

        if (anchorWallet) {
            const pubkey = anchorWallet.publicKey.toString();
            let tokenAccountsListByOwner = await connection.getParsedTokenAccountsByOwner(
                anchorWallet.publicKey,
                {
                    programId: TOKEN_PROGRAM_ID
                }
            );

            let tokenAccounts = tokenAccountsListByOwner.value
                .map((v) => ({
                    mint: v.account.data.parsed.info.mint,
                    tokenAmount: v.account.data.parsed.info.tokenAmount,
                    tokenAccount: v.pubkey.toBase58()
                }))
                .filter(({ tokenAmount }) => {
                    const ownsNFT = tokenAmount.amount !== '0'
                    // Filter out the tokens that don't have 0 decimal places.
                    // NFTs really should have 0
                    const hasNoDecimals = tokenAmount.decimals === 0
                    return ownsNFT && hasNoDecimals
                })
                .map(({ mint, tokenAccount }) => ({ mint, tokenAccount }));

            const tokenList = await getParsedNftAccountsByOwner({
                publicAddress: pubkey,
                connection: connection
            });
            let token_list: any[] = [];
            tokenList.forEach((item, idx) => {
                if (item.data.symbol == COLLECTION_NAME) {
                    token_list.push(item)
                }
            })
            let imageListRes: any[] = [];

            imageListRes = await Promise.all(
                token_list.map(async (item) =>
                    fetch(item.data.uri)
                        .then((res: any) => res.json())
                        .catch(() => null)
                )
            );
            token_list.forEach((item, idx) => {
                let curAccount: any = null;
                tokenAccounts.forEach((account) => {
                    if (account.mint == item.mint) {
                        curAccount = account;
                    }
                })
                if (item.data.name.includes("MegaWob")) {
                    wobList.push({
                        name: item.data.name,
                        imageUrl: imageListRes[idx] ? imageListRes[idx].image : null,
                        mint: item.mint,
                        tokenAccount: curAccount ? curAccount.tokenAccount : null,
                        tokenType: 1,
                        daysPassed: 0,
                        rewardATA: '',
                        tokenTo: '',
                        jsonUrl: item.data.uri
                    })
                }
                else if (item.data.name.includes("DEGENWOB")) {
                    degenList.push({
                        name: item.data.name,
                        imageUrl: imageListRes[idx] ? imageListRes[idx].image : null,
                        mint: item.mint,
                        tokenAccount: curAccount ? curAccount.tokenAccount : null,
                        tokenType: 2,
                        daysPassed: 0,
                        rewardATA: '',
                        tokenTo: '',
                        jsonUrl: item.data.uri
                    })
                }
            })
            nftList = [
                ...wobList,
                ...degenList
            ]
            dispatch({
                type: "wobList",
                payload: wobList
            })
            dispatch({
                type: "degenList",
                payload: degenList
            })
            dispatch({
                type: "nftList",
                payload: nftList
            })
        }
    }

    const getStakedNftList = async () => {
        if (!wallet) return;
        const provider = getProvider();

    }

    useEffect(() => {
        (async () => {
            if (anchorWallet) {
                let solBalance = await getSolBalance();
                let wobBalance = await getTokenBalance(WOBTOKEN);
                dispatch({
                    type: "solBalance",
                    payload: solBalance
                })
                dispatch({
                    type: "tokenBalance",
                    payload: wobBalance
                })
                await getNftList();
            }
        })()
    }, [wallet, anchorWallet])

    return (
        <App.Provider
            value={React.useMemo(
                () => [
                    state,
                    {
                        dispatch,
                        getSolBalance,
                        getTokenBalance
                    }
                ],
                [
                    state,
                    dispatch,
                    getSolBalance,
                    getTokenBalance
                ]
            )}
        >
            {children}
        </App.Provider>
    )
}