import React, { useEffect, useMemo, useState } from "react";
import Header from "./Header";
import NFT from "./components/NFT";
import { useAnchorWallet, useConnection, useWallet } from "@solana/wallet-adapter-react";
import * as anchor from "@project-serum/anchor";
import axios from 'axios';

import Asset from './assets';
import '../scss/Main.scss';
import { Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { getParsedNftAccountsByOwner } from "@nfteyez/sol-rayz";
import { Token, TOKEN_PROGRAM_ID } from "@solana/spl-token"
import jsonList from '../pair.json';
import { Snackbar } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { AlertState } from "../utils";
import { useBlockchainContext } from "../provider";
import { NFTInfo } from "../../global";
import Icons from "./components/Icons";
import assetPair from "../assetPair.json";

/**
 *  CONSTANTS...
 */
const COLLECTION_NAME = process.env.REACT_APP_COLLECTION_NAME;
const BASEURL = process.env.REACT_APP_BASEURL;
const WOBTOKEN = process.env.REACT_APP_WOBTOKEN;
const RECEIVER = process.env.REACT_APP_RECEIVER;
const SEND_AMOUNT = 1000;
const DECIMALS = process.env.REACT_APP_DECIMALS;
const CLUSTER_RPC = process.env.REACT_APP_CLUSTER_RPC;


export default function Transformer() {

    const [state, { }]: any = useBlockchainContext();
    const wallet = useWallet();
    const connection = new anchor.web3.Connection(
        CLUSTER_RPC!
    )
    const [wobBalance, setWobBalance] = useState<any>(0);
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

    const [alertState, setAlertState] = useState<AlertState>({
        open: false,
        message: "",
        severity: undefined,
    });

    const [mint, setMint] = useState<any>();
    const [burnList, setBurnList] = useState<any[]>([]);
    const [id, setId] = useState<String>();
    const [pair, setPair] = useState<any>();
    const [type, setType] = useState<any>();

    const [wobList, setWobList] = useState<NFTInfo[]>([]);
    const [degenList, setDegenList] = useState<NFTInfo[]>([]);

    const nftClick = (nft: NFTInfo, type: any) => {
        console.log(`nft::`, nft);
        setMint(nft.mint.toBase58());
        setId(nft.name);
        assetPair.forEach((item: any) => {
            if (item.addr == nft.mint.toBase58()) {
                setPair(item);
            }
        });
        setType(type);
    }

    useEffect(() => {
        setWobBalance(state.tokenBalance);
        setWobList(state.wobList);
        setDegenList(state.degenList);
    }, [wallet, state])

    return (
        <>
            <Header />
            <div className={"main"}>
                <div className="container">
                    <div className="main-part">
                        <div className="left">
                            <span className="f-20">CONVERT YOUR WOBBLEBUG NFTS</span>
                            <div className="panel transform">
                                <span>MEGAWOBS</span>
                                {
                                    wobList.length == 0 ?
                                        <div className="col w100 f-center flex1">
                                            <p className="f-12">You have no eligible Wobs to transform</p>
                                            <button className="switch-button" onClick={() => { window.open('https://magiceden.io/', '_blank') }}>Buy on Magic Eden</button>
                                        </div> :
                                        <div className="row wrap cg-2 rg-2">
                                            {
                                                wobList.map((item, idx) => (
                                                    <NFT img={item.imageUrl} key={idx} myclick={() => nftClick(item, true)}></NFT>
                                                ))
                                            }
                                        </div>
                                }
                            </div>
                            <div className="panel transform">
                                <span>DEGENWOBS</span>
                                {
                                    degenList.length == 0 ?
                                        <div className="col w100 f-center flex1">
                                            <p className="f-14">There is no 2D Nfts in your wallet!</p>
                                        </div> :
                                        <div className="row wrap cg-2 rg-2">
                                            {
                                                degenList.map((item, idx) => (
                                                    <NFT img={item.imageUrl} key={idx} myclick={() => nftClick(item, false)}></NFT>
                                                ))
                                            }
                                        </div>
                                }
                            </div>
                        </div>
                        <div className="right">
                            <div className="panel transform">
                                <div className="row">
                                    <img src={Asset.logo_white} style={{ height: '50px' }}></img>
                                    <span className="f-14 ml1">Collector Dashboard</span>
                                </div>
                                <div className="col rg-1">
                                    <button className="switch-button">View My Portfolio</button>
                                    <button className="switch-button">Edit Profile</button>
                                </div>
                                <div className="row">
                                    <img src={Asset.token} style={{ height: '50px' }}></img>
                                    <span className="f-14 ml1">WOB TOKEN</span>
                                </div>
                                <div className="row mt2">
                                    <span className="f-14 ml1">Balance- </span>
                                    <span className="f-14 ml1">{wobBalance} $WOB</span>
                                </div>
                                <div className="col f-1 fc mh-200">
                                    {
                                        pair ?
                                            <>
                                                <span className="f-14 mt4">You have selected {id}</span>
                                                {/* <div className="nft-item" style={{ marginTop: '10%', marginBottom: '5%' }}>
                                                    {pair && (
                                                        <Image style={{ borderRadius: '10px !important', margin: '2%' }}
                                                            src={type ? pair.content[1] : pair.content[3]}
                                                        />
                                                    )}
                                                </div> */}

                                                {
                                                    <Icons.ArrowDown width={40} height={40} />
                                                }

                                                {/* <div className="nft-item" style={{ marginTop: '10%' }}>
                                                    {pair && (
                                                        <Image style={{ borderRadius: '10px !important', margin: '2%' }}
                                                            src={type ? pair.content[3] : pair.content[1]}
                                                        />
                                                    )}
                                                </div> */}
                                                <button className={'switch-button'} onClick={() => { }} style={{ marginTop: '10%' }}>{'transform'}</button>
                                                {/* <button className={'switch-button'} onClick={transferToken} style={{ marginTop: '10%' }}>{'transform'}</button> */}
                                            </> :
                                            <p className="f-14">Select a wob to begin transformation</p>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                <Snackbar
                    open={alertState.open}
                    autoHideDuration={6000}
                    onClose={() => setAlertState({ ...alertState, open: false })}
                >
                    <Alert
                        onClose={() => setAlertState({ ...alertState, open: false })}
                        severity={alertState.severity}
                    >
                        {alertState.message}
                    </Alert>
                </Snackbar>
            </div>
        </>
    );
}