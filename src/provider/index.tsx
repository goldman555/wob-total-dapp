import React, { useEffect, useMemo, useState } from 'react';
import { useAnchorWallet, useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY, Transaction } from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";
import { AccountLayout, Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { getParsedNftAccountsByOwner } from '@nfteyez/sol-rayz';
import axios from 'axios';
import { IDL } from '../constant/IDL/punky_staking';
import { NFTInfo, StateInfo } from '../../global';
import assets from '../pages/assets';
import { getAccountInfo, getBlockTime, getRecentBlockHash, getTokenAccountByOwner } from '../utils/api';
import { useToasts } from 'react-toast-notifications';
import { sendTransactions } from '../connection';

/**
 * CONSTANTS
 */
const WOBTOKEN = process.env.REACT_APP_WOBTOKEN;
const WOBTOKENACCOUNT = process.env.REACT_APP_WOBTOKEN_ACCOUNT;
const COLLECTION_NAME = process.env.REACT_APP_COLLECTION_NAME;
const BURN_COLLECTION_NAME = process.env.REACT_APP_BURN_COLLECTION_NAME;
const PROGRAM_ID = process.env.REACT_APP_PROGRAM_ID;
const RECEIVER = process.env.REACT_APP_RECEIVER;
const DECIMALS = process.env.REACT_APP_DECIMALS;
const VAULT_PDA_SEEDS = 'NFT STAKING VAULT D';
const POOL_SEEDS = 'NFT STAKING POOL D';
const POOL_SIGNER_SEEDS = 'NFT STAKING POOL SIGNER D';
const POOL_DATA_SEEDS = 'NFT STAKING DATA D';
const DAYTIME = process.env.REACT_APP_DAYTIME;
const BASEURL = process.env.REACT_APP_BASEURL;


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
    burnList: [],
    stakeList: [],
}

export default function Provider({ children }: any) {

    const [state, dispatch] = React.useReducer(reducer, INIT_STATE);
    const { addToast } = useToasts();
    const [loading, setLoading] = useState(false);
    const wallet1 = useWallet();
    const wallet = useAnchorWallet();
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

    const burn = async () => {
        if (!wallet1.publicKey) return;
        let tokenAddr = state.burnList[0].mint;
        let tokenPublicKey = new PublicKey(tokenAddr);
        let signer = new Keypair();
        let token = new Token(
            connection,
            tokenPublicKey,
            TOKEN_PROGRAM_ID,
            signer
        );
        let tokenAccount = await token.getOrCreateAssociatedAccountInfo(
            wallet1.publicKey
        )
        let instruction: any[] = [];
        instruction.push(
            Token.createBurnInstruction(
                TOKEN_PROGRAM_ID,
                tokenPublicKey,
                tokenAccount.address,
                wallet1.publicKey,
                [],
                1
            )
        );
        var transferTrx = new Transaction().add(
            ...instruction
        )
        var signature = await wallet1.sendTransaction(
            transferTrx,
            connection
        );
        const response = await connection.confirmTransaction(signature, 'processed');
    }

    const transferToken = async (send_amount: any) => {
        if (!wallet1.publicKey) return;
        let signer = new Keypair();
        let token = new Token(
            connection,
            new PublicKey(WOBTOKEN!),
            TOKEN_PROGRAM_ID,
            signer
        );
        let tokenAccount = await token.getOrCreateAssociatedAccountInfo(
            wallet1.publicKey
        );
        const associatedDestinationTokenAddr = await Token.getAssociatedTokenAddress(
            token.associatedProgramId,
            token.programId,
            new PublicKey(WOBTOKEN!),
            new PublicKey(RECEIVER!)
        )
        let instructions = [];
        let result = await connection.getAccountInfo(associatedDestinationTokenAddr);
        if (result == null) {
            instructions.push(
                Token.createAssociatedTokenAccountInstruction(
                    token.associatedProgramId,
                    token.programId,
                    new PublicKey(WOBTOKEN!),
                    associatedDestinationTokenAddr,
                    new PublicKey(RECEIVER!),
                    wallet1.publicKey
                )
            );
        }
        instructions.push(
            Token.createTransferInstruction(
                TOKEN_PROGRAM_ID,
                tokenAccount.address,
                associatedDestinationTokenAddr,
                wallet1.publicKey,
                [],
                Number(send_amount) * Number(DECIMALS!)
            )
        )
        var transferTrx = new Transaction().add(
            ...instructions
        );
        var signature = await wallet1.sendTransaction(
            transferTrx,
            connection
        )
        const response = await connection.confirmTransaction(signature, 'processed');
    }

    const transferSol = async (send_amount: any) => {
        if (!wallet1.publicKey) return;
        var transaction = new Transaction().add(SystemProgram.transfer({
            fromPubkey: wallet1.publicKey,
            toPubkey: new PublicKey(RECEIVER!),
            lamports: LAMPORTS_PER_SOL * Number(send_amount)
        }))
        transaction.feePayer = wallet1.publicKey;
        let blockhashObj = await connection.getRecentBlockhash();
        transaction.recentBlockhash = await blockhashObj.blockhash;
        var signature = await wallet1.sendTransaction(
            transaction,
            connection
        )
        const response = await connection.confirmTransaction(signature, 'processed');
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
        let stakeList: NFTInfo[] = [];
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
        console.log(`data::`, data, poolDataAddr.toString(), program);

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

        let pubkey = poolSignerAddr.toString();
        const tokenList = await getParsedNftAccountsByOwner({
            publicAddress: pubkey,
            connection: connection
        });

        let token_list: any[] = [];
        tokenList.forEach((item) => {
            if (item.data.symbol == COLLECTION_NAME) {
                token_list.push(item);
            }
        });

        let imageListRes: any[] = [];

        imageListRes = await Promise.all(
            token_list.map(async (item) =>
                fetch(item.data.uri)
                    .then((res) => res.json())
                    .catch(() => null)
            )
        )

        token_list.forEach((item, idx) => {
            let curAccount: any = null;
            stakedTokenAccounts.forEach((account) => {
                if (account.mint == item.mint) {
                    curAccount = account;
                }
            })
            stakeList.push({
                name: item.data.name,
                imageUrl: imageListRes[idx] ? imageListRes[idx].image : null,
                mint: new PublicKey(item.mint),
                tokenAccount: curAccount ? curAccount.tokenAccount : null,
                tokenType: item.data.name.includes("Megawob") ? 1 : 2,
                daysPassed: 0,
                rewardATA: '',
                tokenTo: '',
                jsonUrl: item.data.uri
            })
        })

        /**
         * update rewards of NFT struct
         */

        let blockhash = await getRecentBlockHash();
        let currentTimeStamp = await getBlockTime(blockhash.result.context.slot);
        console.log(`stakeList::`, stakeList);
        for (let i = 0; i < stakeList.length; i++) {
            let [poolAddr, _nonce] = await anchor.web3.PublicKey.findProgramAddress(
                [Buffer.from(POOL_SEEDS), wallet.publicKey.toBuffer(), stakeList[i].mint.toBuffer()],
                new PublicKey(program.programId)
            )
            let rewardTokenNumber = 0;
            const poolNft = await program.account.pool.fetch(poolAddr);
            console.log(`pool Nft::`, poolNft);
            console.log(`current timestamp::`, currentTimeStamp.result);
            // let current = 0;
            // let canClaim = true;
            if (poolNft) {
                rewardTokenNumber = poolNft.reward.toNumber() / Number(DECIMALS);
                let dayPassed = Math.floor((currentTimeStamp.result - poolNft.lastTime) / Number(DAYTIME))
                if (dayPassed < 0) dayPassed = 0;
                stakeList[i] = {
                    ...stakeList[i],
                    daysPassed: dayPassed
                }
            }
        }

        dispatch({
            type: "stakeList",
            payload: stakeList
        });
    }

    const showLoading = (state: any) => {
        setLoading(state);
    }

    // for actions such as staking, claiming, unstaking //
    const onStake = async (nft: NFTInfo) => {

        const provider = getProvider();
        const program = new anchor.Program(IDL, new PublicKey(PROGRAM_ID!), provider);

        try {
            if (!wallet) {
                addToast("Connect your wallet!", {
                    appearance: 'warning',
                    autoDismiss: true,
                })
                setLoading(false)
                return;
            }

            let instructionSet = [], signerSet = [];
            let transaction = [];
            let signers: any = [];
            let [poolSigner, nonce_signer] = await anchor.web3.PublicKey.findProgramAddress(
                [Buffer.from(POOL_SIGNER_SEEDS), wallet.publicKey.toBuffer()],
                program.programId
            );
            let [pool, nonce_pool] = await anchor.web3.PublicKey.findProgramAddress(
                [Buffer.from(POOL_SEEDS), wallet.publicKey.toBuffer(), nft.mint.toBuffer()],
                program.programId
            );

            const { result } = await getAccountInfo(poolSigner.toString());
            if (!result.value) {
                const instruction = await program.instruction.createPoolSigner(nonce_signer, {
                    accounts: {
                        poolSigner: poolSigner,
                        user: wallet.publicKey,
                        systemProgram: SystemProgram.programId,
                    },
                })
                transaction.push(instruction);
            }

            const poolResultInfo = await getAccountInfo(pool.toString());
            if (!poolResultInfo.result.value) {
                const instruction = await program.instruction.createPool(nonce_pool, {
                    accounts: {
                        pool: pool,
                        user: wallet.publicKey,
                        mint: nft.mint,
                        systemProgram: SystemProgram.programId
                    }
                })
                transaction.push(instruction);
            }

            let newTx: any = await makeRewardAta();
            if (newTx.transaction.length !== 0) {
                transaction = [...transaction, ...newTx.transaction];
                signers = [...signers, ...newTx.signers];
            }
            nft.rewardATA = newTx.rewardATA;
            let newStakeTx: any = await makeStakeTx(program, poolSigner, pool, nft);
            if (newStakeTx.transaction?.length !== 0) {
                transaction = [...transaction, ...newStakeTx.transaction];
                signers = [...signers, ...newStakeTx.signers];
            }
            nft.tokenTo = newStakeTx.nftATA.toString();
            instructionSet.push(transaction);
            signerSet.push(signers);
            await sendTransactions(connection, wallet, instructionSet, signerSet);
            let tempTokenAccount = nft.tokenAccount;

            nft.tokenAccount = new PublicKey(nft.tokenTo);
            nft.tokenTo = tempTokenAccount.toString();
            nft.daysPassed = 0;

            addToast("Staking success!", {
                appearance: 'success',
                autoDismiss: true,
            });

            console.log(`nft::`, nft);

            var axios = require('axios');
            let response = await axios.post(`${BASEURL}/stake`, {
                ownerWallet: wallet.publicKey.toBase58(), nft: nft.mint.toString()
            });

            setLoading(false);
            // resetCurNft();

        } catch (error) {
            console.log("error when staking", error);
            addToast('Staking failed!', {
                appearance: 'error',
                autoDismiss: true,
            })
            setLoading(false);
            return;
        }
    }

    const onClaim = async (nft: NFTInfo) => {
        try {
            if (!wallet) {
                addToast("Connect your wallet!", {
                    appearance: 'warning',
                    autoDismiss: true,
                })
                setLoading(false);
                return;
            }

            let instructionSet: any = [];
            let signerSet: any = [];
            let transaction: any = [];
            let signers = [];
            let tokenResult = await getTokenAccountByOwner(wallet.publicKey.toString(), WOBTOKEN!);
            let result = tokenResult.result.value;
            if (result.err) {
                addToast('Claiming failed of reward!', {
                    appearance: 'error',
                    autoDismiss: true,
                })
                setLoading(false);
                console.log('error to get tokenResult in claiming', result.err)
                return;
            }

            let rewardATA = '';
            if (result.length === 0) {
                let newTx: any = await makeRewardAta();
                signers = [...newTx.signers];
                transaction = [...newTx.transaction];
                rewardATA = newTx.rewardATA;

            } else {
                rewardATA = result[0].pubkey;
            }

            nft.rewardATA = rewardATA;
            let claimTx = await makeClaimTx(nft);
            transaction = [...transaction, ...claimTx]
            instructionSet.push(transaction);
            signerSet.push([]);

            await sendTransactions(connection, wallet, instructionSet, signerSet)

            // setWalletBalance(wallBalance);
            // setStakedNfts(stakedNfts.map(stakedNFT => {
            //     if (stakedNFT.mint === nft.mint) {
            //         return {
            //             ...stakedNFT,
            //             current: 0,
            //             canClaim: false,
            //             daysPassed: 0,
            //         }
            //     } else {
            //         return {
            //             ...stakedNFT,
            //         }
            //     }
            // }));

            addToast('Claiming success!', {
                appearance: 'success',
                autoDismiss: true,
            });
        } catch (error) {
            addToast('Claiming failed!', {
                appearance: 'error',
                autoDismiss: true,
            });
        }
    }

    const onUnstake = async (nft: NFTInfo) => {

        if (!wallet) {
            addToast("Connect your wallet!", {
                appearance: 'warning',
                autoDismiss: true,
            })
            return;
        }

        try {
            let instructionSet = [];
            let signerSet = [];
            let transaction: any = [];
            let signers: any = [];
            let newTx: any = await makeRewardAta();
            console.log(`newTx::`, newTx);
            if (newTx.transaction.length !== 0) {
                signers = [...newTx.signers]
                transaction = [...newTx.transaction]
            }
            nft.rewardATA = newTx.rewardATA;

            let unStakeTx = await makeUnstakeTx(nft);
            if (unStakeTx.signers.length !== 0) {
                signers = [...signers, ...unStakeTx.signers];
            }
            transaction = [...transaction, ...unStakeTx.transaction];
            instructionSet.push(transaction);
            signerSet.push(signers);

            await sendTransactions(connection, wallet, instructionSet, signerSet)

            let tempTokenAccount = nft.tokenAccount.toString();
            if (!nft.tokenTo) {
                let tokenResult = await getTokenAccountByOwner(wallet.publicKey.toString(), nft.mint.toString());
                nft.tokenTo = tokenResult.result.value[0]?.pubkey.toString();
            }
            nft.tokenAccount = new PublicKey(nft.tokenTo);
            nft.tokenTo = tempTokenAccount;

            // setWalletNfts([...walletNfts, nft]);
            // setStakedNfts(stakedNfts.filter(NFT => NFT.mint !== nft.mint));
            addToast('Unstaking success!', {
                appearance: 'success',
                autoDismiss: true,
            })
            var axios = require('axios');
            let response = await axios.post(`${BASEURL}/unstake`, {
                ownerWallet: wallet.publicKey.toBase58(), nft: nft.mint.toString()
            });

        } catch (error) {
            setLoading(false);
            addToast('Unstaking failed!', {
                appearance: 'error',
                autoDismiss: true,
            });
            console.log('error in Unstaking', error)

        }

    }

    const makeStakeTx = async (program: anchor.Program<any>, poolSigner: PublicKey, pool: PublicKey, nft: any) => {
        let transaction: any = [];
        let signers: any[] = [];
        if (!wallet)
            return;
        let [poolData, _nonceData] = await anchor.web3.PublicKey.findProgramAddress(
            [Buffer.from(POOL_DATA_SEEDS)],
            program.programId
        );

        let newTx: any = await makeNftAta(poolSigner, nft);
        let nftATA = new PublicKey(newTx.nftATA);
        if (newTx.transaction.length !== 0) {
            transaction = [...transaction, ...newTx.transaction];
            signers = [...signers, ...newTx.signers]
        }
        console.log(`stake:: nft:::`, nft.tokenType);
        transaction.push(program.instruction.stake(nft.tokenType, nft.attribute, {
            accounts: {
                user: wallet.publicKey,
                mint: nft.mint,
                pool: pool,
                data: poolData,
                from: nft.tokenAccount,
                tokenFrom: new PublicKey(nft.rewardATA),
                tokenTo: new PublicKey(WOBTOKENACCOUNT!),
                to: new PublicKey(newTx.nftATA),
                tokenProgram: TOKEN_PROGRAM_ID,
                rent: SYSVAR_RENT_PUBKEY
            },
            signers
        }));
        return { transaction, signers, nftATA };
    }

    const makeUnstakeTx = async (nft: NFTInfo) => {
        const provider = getProvider();
        const program = new anchor.Program(IDL, new PublicKey(PROGRAM_ID!), provider);
        let [poolSigner, _nonceSigner] = await anchor.web3.PublicKey.findProgramAddress(
            [Buffer.from(POOL_SIGNER_SEEDS), wallet!.publicKey.toBuffer()],
            program.programId
        );

        let [vault, _nonceVault] = await anchor.web3.PublicKey.findProgramAddress(
            [Buffer.from(VAULT_PDA_SEEDS)],
            program.programId
        );

        let [poolData, _nonceData] = await anchor.web3.PublicKey.findProgramAddress(
            [Buffer.from(POOL_DATA_SEEDS)],
            program.programId
        );
        let [pool, _noncePool] = await anchor.web3.PublicKey.findProgramAddress(
            [Buffer.from(POOL_SEEDS), wallet!.publicKey!.toBuffer(), new PublicKey(nft.mint).toBuffer()],
            program.programId
        );

        let transaction: any = [];
        let signers: any = [];

        let newUnstakeTx = await makeNftAta(wallet!.publicKey, nft);
        if (newUnstakeTx?.transaction.length !== 0) {
            transaction = [...newUnstakeTx?.transaction];
            signers = [...newUnstakeTx?.signers];
        }
        nft.tokenTo = newUnstakeTx?.nftATA;
        let nftTo: any = newUnstakeTx?.nftATA;
        transaction.push(
            program.instruction.unstake(_nonceSigner, _nonceVault, {
                accounts: {
                    pool: pool,
                    poolSigner: poolSigner,
                    user: wallet!.publicKey!,
                    mint: new PublicKey(nft.mint),
                    vault: vault,
                    data: poolData,
                    nftFrom: new PublicKey(nft.tokenAccount),
                    nftTo: new PublicKey(nft.tokenTo),
                    tokenFrom: new PublicKey(WOBTOKENACCOUNT!),
                    tokenTo: new PublicKey(nft.rewardATA),
                    tokenProgram: TOKEN_PROGRAM_ID
                }
            }));
        return { transaction, signers, nftTo }
    }

    const makeClaimTx = async (nft: NFTInfo) => {
        const provider = getProvider();
        const program = new anchor.Program(IDL, new PublicKey(PROGRAM_ID!), provider);
        let [vault, _nonceVault] = await anchor.web3.PublicKey.findProgramAddress(
            [Buffer.from(VAULT_PDA_SEEDS)],
            program.programId
        );
        let [pool, _noncePool] = await anchor.web3.PublicKey.findProgramAddress(
            [Buffer.from(POOL_SEEDS), wallet!.publicKey!.toBuffer(), nft.mint.toBuffer()],
            program.programId
        );
        let transaction = [];
        let tokenResult = await getTokenAccountByOwner(wallet!.publicKey!.toString(), nft.mint.toString());
        transaction.push(
            program.instruction.claim(_nonceVault, {
                accounts: {
                    pool: pool,
                    user: wallet!.publicKey!,
                    mint: nft.mint,
                    vault: vault,
                    tokenFrom: new PublicKey(WOBTOKENACCOUNT!),
                    tokenTo: new PublicKey(nft.rewardATA),
                    tokenProgram: TOKEN_PROGRAM_ID
                }
            }));

        return transaction;
    }

    const makeRewardAta = async () => {

        let transaction: any = [];
        let signers: any = [];
        let rewardATA = '';
        let tokenResult = await getTokenAccountByOwner(wallet!.publicKey.toString(), WOBTOKEN!);
        let result = tokenResult.result.value;
        if (result.err) {
            addToast('Unstaking failed of reward!', {
                appearance: 'error',
                autoDismiss: true,
            })
            setLoading(false);
            return;
        }
        if (result.length === 0) {
            const aTokenAccount = new Keypair();
            const aTokenAccountRent = await connection.getMinimumBalanceForRentExemption(
                AccountLayout.span
            )
            transaction.push(SystemProgram.createAccount({
                fromPubkey: wallet!.publicKey,
                newAccountPubkey: aTokenAccount.publicKey,
                lamports: aTokenAccountRent,
                space: AccountLayout.span,
                programId: TOKEN_PROGRAM_ID
            }));
            transaction.push(
                Token.createInitAccountInstruction(
                    TOKEN_PROGRAM_ID,
                    new PublicKey(WOBTOKEN!),
                    aTokenAccount.publicKey,
                    wallet!.publicKey
                ));
            signers.push(aTokenAccount);
            rewardATA = aTokenAccount.publicKey.toString();
        } else {
            rewardATA = result[0].pubkey.toString();
        }
        return { rewardATA, transaction, signers }
    }

    const makeNftAta = async (poolSigner: PublicKey, nft: any) => {
        let transaction: any = [];
        let signers: any = [];
        let nftATA: any = '';

        let tokenResult = await getTokenAccountByOwner(poolSigner.toString(), nft.mint.toString());
        let result = tokenResult.result?.value;
        if (result.err) {
            addToast('Staking failed!', {
                appearance: 'error',
                autoDismiss: true,
            })
            console.log("error in makeNftAta ", result.err);
            setLoading(false);
            return;
        }

        if (result.length === 0) {
            const aTokenAccount = new Keypair();
            const aTokenAccountRent = await connection.getMinimumBalanceForRentExemption(AccountLayout.span)
            transaction.push(SystemProgram.createAccount({
                fromPubkey: wallet!.publicKey,
                newAccountPubkey: aTokenAccount.publicKey,
                lamports: aTokenAccountRent,
                space: AccountLayout.span,
                programId: TOKEN_PROGRAM_ID
            }));
            transaction.push(Token.createInitAccountInstruction(
                TOKEN_PROGRAM_ID,
                nft.mint,
                aTokenAccount.publicKey,
                poolSigner
            ));

            signers.push(aTokenAccount);
            nftATA = aTokenAccount.publicKey.toString();
        } else {
            nftATA = result[0].pubkey.toString();
        }
        return {
            nftATA, transaction, signers
        }
    }

    useEffect(() => {
        (async () => {
            if (anchorWallet) {
                showLoading(true);
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
                await getStakedNftList();
                showLoading(false);
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
                        getTokenBalance,
                        burn,
                        transferToken,
                        transferSol,
                        showLoading,
                        onStake,
                        onUnstake,
                        onClaim
                    }
                ],
                [
                    state,
                    dispatch,
                    getSolBalance,
                    getTokenBalance,
                    burn,
                    transferToken,
                    transferSol,
                    showLoading,
                    onStake,
                    onUnstake,
                    onClaim
                ]
            )}
        >
            {
                loading &&
                <div id="loading">
                    <img src={assets.loading1} style={{ width: '15%' }}></img>
                    <span>LOADING...</span>
                </div>
            }
            {children}
        </App.Provider>
    )
}