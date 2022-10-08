import React, { useEffect, useMemo, useState } from "react";
import Header from "./Header";
import NFT from "./components/NFT";
import { useAnchorWallet, useConnection, useWallet } from "@solana/wallet-adapter-react";
import * as anchor from "@project-serum/anchor";
import axios from 'axios';

import Asset from './assets';
import '../scss/Main.scss';
import { Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { Token, TOKEN_PROGRAM_ID } from "@solana/spl-token"
import jsonList from '../pair.json';
import { Snackbar } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { AlertState } from "../utils";
import { useBlockchainContext } from "../provider";
import { useToasts } from 'react-toast-notifications';
import { RerollInfo } from "../../global";

/**
 *  CONSTANTS...
 */

const BASEURL = process.env.REACT_APP_BASEURL;
const WOBTOKEN = process.env.REACT_APP_WOBTOKEN;
const RECEIVER = process.env.REACT_APP_RECEIVER;
const SEND_AMOUNT = process.env.REACT_APP_SEND_AMOUNT_REROLL;
const SEND_AMOUNT_SOL = process.env.REACT_APP_SEND_AMOUNT_SOL;
const DECIMALS = process.env.REACT_APP_DECIMALS;
const CLUSTER_RPC = process.env.REACT_APP_CLUSTER_RPC;


export default function ReRoll() {

    const [state, { transferToken, transferSol }]: any = useBlockchainContext();
    const { addToast } = useToasts();
    const wallet = useWallet();
    const connection = new anchor.web3.Connection(
        CLUSTER_RPC!
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
    const [wobBalance, setWobBalance] = useState<any>(0);
    const [solBalance, setSolBalance] = useState<any>(0);
    const [addrList, setAddrList] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [curNumber, setCurNumber] = useState(-1);
    const [curNft, setCurNft] = useState<any>(null);

    const [alertState, setAlertState] = useState<AlertState>({
        open: false,
        message: "",
        severity: undefined,
    });

    const [nftList, setNftList] = useState<any[]>([]);

    const buyOnME = () => {
        window.open('https://magiceden.io/', '_blank');
    }

    const reRoll = async () => {
        return await axios.post(
            `${BASEURL}/get_number`,
            {
                number: curNumber,
                address: curNft.mint,
                wallet: wallet.publicKey?.toBase58()
            }
        );
    }

    const prettyAddr = (addr: String) => {
        return addr.slice(0, 6) + '...' + addr.slice(40, 44);
    }

    const handleClickWob = async () => {
        if (!wallet?.publicKey) {
            addToast('Wallet Connect First!', {
                appearance: "warning",
                autoDismiss: true
            })
            return;
        }
        if (!curNft) {
            addToast('Please Select Nft!', {
                appearance: "warning",
                autoDismiss: true
            })
            return;
        }

        try {
            await transferToken(SEND_AMOUNT);
            setLoading(true);
            let result = await reRoll();
            setLoading(false);
            console.log(`result::`, result);
            setTimeout(() => {
                document.location.reload();
            }, 10000)
        } catch (err) {

        }
    }

    const handleClickSol = async () => {

        if (!wallet?.publicKey) {
            addToast('Wallet Connect First!', {
                appearance: "warning",
                autoDismiss: true
            })
            return;
        }
        if (!curNft) {
            addToast('Please Select Nft!', {
                appearance: "warning",
                autoDismiss: true
            })
            return;
        }

        await transferSol(SEND_AMOUNT_SOL);
        setLoading(true);
        let result = await reRoll();
        setLoading(false);
        setTimeout(() => {
            document.location.reload();
        }, 10000)
        console.log(`result::`, result);
    }

    const handleSelect = (item: any) => {
        let uri = item.jsonUrl;
        let flag = -1;
        jsonList.forEach((ele, idx) => {
            if (ele == uri) {
                flag = idx;
            }
        })
        setCurNumber(flag);
        setCurNft(item);
    }

    useEffect(() => {

        // setAddrList(state.rerollMember);

        (async () => {
            if (anchorWallet) {
                setSolBalance(state.solBalance);
                setWobBalance(state.tokenBalance);
                setNftList(state.degenList);

                let list: any[] = [];

                state.rerollMember.forEach((item: any) => {
                    list.push(`${prettyAddr(item.wallet)} - ${item.count} ReRoll`);
                })

                setAddrList(list);
            }
        })()

    }, [anchorWallet, state])

    return (
        <>
            {
                loading &&
                <div id="loading">
                    <video autoPlay muted loop>
                        <source src={Asset.loading_video} type="video/mp4" />
                    </video>
                    <span>RE-ROLLING...</span>
                </div>
            }
            <Header title={'DEGEN RE-ROLL'} />
            <div className={loading ? "main mobile_disable" : "main"}>
                <div className="container">
                    <div className="row between">
                        <img src={Asset.speaker}></img>
                        <div className="row cg-1">
                            <img src={Asset.token} style={{ width: '40px' }}></img>
                            <div className="col rg-1">
                                <span>{wobBalance} $WOB</span>
                                <span>{solBalance} SOL</span>
                            </div>
                        </div>
                    </div>
                    <div className="main-part">
                        <div className="left">
                            <span className="f-28">Roll the Wobblebot to unlock a new degen</span>
                            <div className="panel reroll">
                                <img src={Asset.logo_white}></img>
                                <div className="col f-center rg-3">
                                    <span className="f-24">FIND THE PERFECT DEGEN WOB PFP</span>
                                    <span className="f-14">our highest rollers are on the leaderboard.. how degen are you?</span>
                                    {
                                        nftList.length == 0 ?
                                            <div className="void"></div> :
                                            <>
                                                <div className="row wrap cg-2 rg-2 f-center">
                                                    {
                                                        nftList.map((item, idx) => (
                                                            <NFT img={item.imageUrl} key={idx} myclick={() => handleSelect(item)}></NFT>
                                                        ))
                                                    }

                                                </div>
                                                <span className="f-14">You have selected Degen Wob #100</span>
                                            </>
                                    }
                                </div>
                                {
                                    nftList.length == 0 ?
                                        <div className="col rg-2 f-center">
                                            <span className="f-24">You need a degen wob to roll the wobblebot</span>
                                            <span className="row wrap cg-5 rg-2 f-center">
                                                <button className="btn" onClick={buyOnME}>Buy on M.E</button>
                                                <button className="btn">Transformer</button>
                                            </span>
                                        </div> :
                                        <div className="col rg-2 f-center">
                                            <span className="f-24">ROLL THE WOBBLEBOT</span>
                                            <span className="row wrap cg-5 rg-2 f-center">
                                                <button className="btn" onClick={handleClickWob}>1000 $WOB</button>
                                                <button className="btn" onClick={handleClickSol}>0.2 SOL</button>
                                            </span>
                                        </div>
                                }
                                <span className="f-14">MUST HAVE A BALANCE OF 1000 $WOB OR 0.1 SOL TO ROLL THE WOBBLEBOT</span>
                            </div>
                        </div>
                        <div className="right">
                            <span style={{ fontSize: '16px' }}>Top degen Leaderboards</span>
                            {addrList.map((item, key) => (
                                <div className="row cg-1" key={key}>
                                    <img src={Asset.logo_red}></img>
                                    <div className="row wrap">
                                        <span>{item}</span>
                                    </div>
                                </div>
                            ))}
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