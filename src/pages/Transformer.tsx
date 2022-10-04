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
const BASEURL = process.env.REACT_APP_BASEURL;
const CLUSTER_RPC = process.env.REACT_APP_CLUSTER_RPC;
const SEND_AMOUNT = process.env.REACT_APP_SEND_AMOUNT_TRANSFORM;

export default function Transformer() {

    const [state, { burn, transferToken }]: any = useBlockchainContext();
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

        if (type == true) {
            console.log(`nft::`, nft);
            setMint(nft.mint.toBase58());
            setId(nft.name);
            assetPair.forEach((item: any) => {
                if (item.addr == nft.mint.toBase58()) {
                    setPair(item);
                }
            });
        } else {
            // in this case Degen should be re-roll so we can not use that pair.
            // we need to find out pair..
            setMint(nft.mint.toBase58());
            setId(nft.name);

            assetPair.forEach((item: any) => {
                if (item.addr == nft.mint.toBase58()) {
                    item.content[2] = nft.jsonUrl;
                    item.content[3] = nft.imageUrl;
                    setPair(item);
                }
            });
        }

        setType(type);
    }

    const checkPermit = async () => {
        let result = await axios.post(
            `${BASEURL}/checkPermit`,
            {
                token: mint,
                type: type
            }
        );
        return result.data.result;
    }

    const upgrade = async () => {
        let permit = await checkPermit();
        if (permit == false && state.burnList.length == 0) {
            setAlertState({
                ...alertState,
                open: true,
                message: "You should have to burn drug NFT to upgrade"
            });
            return;
        }
        if (permit == false && burnList.length > 0) {
            if (type) {
                await burn();
            } else {
                await transferToken(SEND_AMOUNT);
            }
            let response = await axios.post(`${BASEURL}/update`, {
                mint: mint,
                type: type,
                uri: type ? pair.content[2] : pair.content[0],
                name: id
            });
            if (response.data.result == 'success') {
                setTimeout(() => {
                    setAlertState({
                        ...alertState,
                        open: true,
                        message: "Updated successfully!!!"
                    })
                    setTimeout(() => {
                        document.location.reload();
                    }, 5000);
                }, 10000)
            } else {
                setTimeout(() => {
                    setAlertState({
                        ...alertState,
                        open: true,
                        message: "Update Failed, Please try again!!!"
                    })
                    setTimeout(() => {
                        document.location.reload();
                    }, 5000);
                }, 10000)
            }
        } else if (permit == true) {
            let response = await axios.post(`${BASEURL}/update`, {
                mint: mint,
                type: type,
                uri: type ? pair.content[2] : pair.content[0],
                name: id
            });

            if (response.data.result == 'success') {
                setTimeout(() => {
                    setAlertState({
                        ...alertState,
                        open: true,
                        message: "Updated successfully!!!"
                    })
                    setTimeout(() => {
                        document.location.reload();
                    }, 5000);
                }, 10000)
            } else {
                setTimeout(() => {
                    setAlertState({
                        ...alertState,
                        open: true,
                        message: "Update Failed, Please try again!!!"
                    })
                    setTimeout(() => {
                        document.location.reload();
                    }, 5000);
                }, 10000)
            }
        }
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
                                <div className="col f-1 f-center">
                                    {
                                        pair ?
                                            <>
                                                <span className="f-14 mb-4">You have selected {id}</span>
                                                {pair && (
                                                    <img className="selectedImg" src={type ? pair.content[1] : pair.content[3]} />
                                                )}

                                                {
                                                    <Icons.ArrowDown width={40} height={40} />
                                                }

                                                {pair && (
                                                    <img className="selectedImg" src={type ? pair.content[3] : pair.content[1]} />
                                                )}
                                                <button className={'switch-button'} onClick={upgrade} style={{ marginTop: '10%' }}>{'transform'}</button>
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