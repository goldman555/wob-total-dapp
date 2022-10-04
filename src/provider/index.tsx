import React, { useEffect, useMemo } from 'react';
import { useAnchorWallet, useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";
import { Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { getParsedNftAccountsByOwner } from '@nfteyez/sol-rayz';
import axios from 'axios';
import { IDL } from '../constant/IDL/wobStaking';
import { NFTInfo, StateInfo } from '../../global';

/**
 * CONSTANTS
 */
const WOBTOKEN = process.env.REACT_APP_WOBTOKEN;
const COLLECTION_NAME = process.env.REACT_APP_COLLECTION_NAME;
const BURN_COLLECTION_NAME = process.env.REACT_APP_BURN_COLLECTION_NAME;
const PROGRAM_ID = process.env.REACT_APP_PROGRAM_ID;
const VAULT_PDA_SEEDS = 'NFT STAKING VAULT D';
const POOL_SEEDS = 'NFT STAKING POOL D';
const POOL_SIGNER_SEEDS = 'NFT STAKING POOL SIGNER D';
const POOL_DATA_SEEDS = 'NFT STAKING DATA D';


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

const INIT_STATE: StateInfo = {
    solBalance: 0,
    tokenBalance: 0,
    wobList: [],
    degenList: [],
    nftList: [],
    burnList: []
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
            balance = Number((balance / LAMPORTS_PER_SOL).toFixed(2));
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
                balance = Number((walletTokenBalance.value.uiAmount)?.toFixed(2));
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
        let burnList: any[] = [];

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

            console.log(`token list::`, tokenList);

            tokenList.forEach((item) => {
                if (item.data.symbol == COLLECTION_NAME) {
                    token_list.push(item)
                }
            })

            tokenList.forEach((item) => {
                console.log(`item:::`, item.data.symbol, BURN_COLLECTION_NAME);
                if (item.data.symbol == BURN_COLLECTION_NAME) {
                    burnList.push(item);
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
                        mint: new PublicKey(item.mint),
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
                        mint: new PublicKey(item.mint),
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
            dispatch({
                type: "burnList",
                payload: burnList
            })
        }
    }

    const getStakedNftList = async () => {
        if (!wallet) return;
        const provider = getProvider();
        const program = new anchor.Program(IDL, new PublicKey(PROGRAM_ID!), provider);
        let stakedNfts: NFTInfo[] = [];
        let [poolSignerAddr, _nonce_signer] = await anchor.web3.PublicKey.findProgramAddress(
            [Buffer.from(POOL_SIGNER_SEEDS!), wallet.publicKey.toBuffer()],
            new PublicKey(program.programId)
        );
        let [poolDataAddr, _nonce_data] = await anchor.web3.PublicKey.findProgramAddress(
            [Buffer.from(POOL_DATA_SEEDS!)],
            new PublicKey(program.programId)
        );

        const data = await program.account.data.fetch(poolDataAddr);
        // console.log(`poolDataAddr;;`, poolDataAddr.toString(), data);

        let stakedTokenAccountByOwner = await connection.getParsedTokenAccountsByOwner(
            poolSignerAddr,
            {
                programId: TOKEN_PROGRAM_ID
            }
        );
        let stakedTokenAccounts = stakedTokenAccountByOwner.value
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
            .map(({ mint, tokenAccount }) => ({ mint, tokenAccount }))
        console.log(`stakedtokenAccounts::`, stakedTokenAccounts);

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
                // await getStakedNftList();
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