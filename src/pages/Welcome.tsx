import React, { useEffect, useMemo, useState } from "react";
import Header from "./Header";
import NFT from "./components/NFT";
import { useAnchorWallet, useConnection, useWallet } from "@solana/wallet-adapter-react";
import * as anchor from "@project-serum/anchor";
import axios from 'axios';

import Asset from './assets';
import '../scss/Main.scss';
import '../scss/Welcome.scss';
import { Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { getParsedNftAccountsByOwner } from "@nfteyez/sol-rayz";
import { Token, TOKEN_PROGRAM_ID } from "@solana/spl-token"
import jsonList from '../pair.json';
import { Snackbar } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { AlertState } from "../utils";

/**
 *  CONSTANTS...
 */
const COLLECTION_NAME = process.env.REACT_APP_COLLECTION_NAME;
const BASEURL = process.env.REACT_APP_BASEURL;
const WOBTOKEN = process.env.REACT_APP_WOBTOKEN;
const RECEIVER = process.env.REACT_APP_RECEIVER;
const SEND_AMOUNT = 1000;
const DECIMALS = process.env.REACT_APP_DECIMALS;


export default function Welcome() {

    const wallet = useWallet();
    const wallet1 = useAnchorWallet();
    const connection = new anchor.web3.Connection(
        'https://metaplex.devnet.rpcpool.com'
    )
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


    useEffect(() => {

        (async () => {

        })()

    }, [anchorWallet])

    return (
        <>
            <Header title={'WOBBLEBUG'} />
            <div className={"main"}>
                <div className="container">
                    <div className="col f-center">
                        <img src={Asset.face_logo}></img>
                        <span className="f-32 mb-5">THE FIRST TOKENIZED MUSICIAN IN HISTORY</span>
                        <img src={Asset.logo1} className="mt-9"></img>
                    </div>
                </div>
            </div>
        </>
    );
}