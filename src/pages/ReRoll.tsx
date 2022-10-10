import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Modal } from '@material-ui/core';


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
    const navigation = useNavigate();
    const wallet = useWallet();
    const wallet1 = useAnchorWallet();
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
    const [open, setOpen] = useState(false);
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

    const [selectImg, setSelectImg] = useState(null);
    const [image, _setImage] = useState(null);
    const [showImage, setShowImage] = useState(null);

    const [userEmail, setUserEmail] = useState<any>('');

    const handleChange = (event: any) => {
        if (image) {
            setImage(null);
            setSelectImg(null);
        }
        const newImage = event.target?.files?.[0];
        if (newImage) {
            setImage(URL.createObjectURL(newImage));
            setSelectImg(newImage);
        }
    }

    const setImage = (newImage: any) => {
        if (image)
            URL.revokeObjectURL(image);
        _setImage(newImage);
    }

    const handleClick = () => {
        const inputBtn = document.getElementById("avatar");
        inputBtn?.click();
    }

    const updateUserInfo = () => {
        if (!wallet?.publicKey) return;
        if (!(image && userEmail && userEmail != '')) {
            return;
            setOpen(false);
        }

        var formData = new FormData();
        formData.append('email', userEmail);
        formData.append('address', wallet?.publicKey.toString());
        formData.append('file', selectImg!);
        axios.post(
            `${BASEURL}/updateProfile`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        ).then(function (res) {
            console.log(`result::`, res);
            setOpen(false);
        }).catch(function (err) {
            console.log(`error:::`, err);
            setOpen(false);
        })
    }

    const deleteUserInfo = async () => {
        let result = await axios.post(
            `${BASEURL}/deleteProfile`,
            { address: wallet1?.publicKey.toString() },
        )
        setOpen(false);
        console.log(`result::`, result);
    }

    const handleChangeEmail = (event: any) => {
        setUserEmail(event.target.value);
    }

    const getUserProfile = async () => {

        let result = await axios.post(
            `${BASEURL}/getProfile`,
            {
                address: wallet1?.publicKey.toString()
            }
        )
        console.log(`getprofile::`, result);
        if (result.data.result) {
            setShowImage(result.data.result.image_url);
            setUserEmail(result.data.result.email)
        }
    }

    useEffect(() => {

        (async () => {
            if (anchorWallet) {
                await getUserProfile();
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
                        <img className="speaker-img" src={Asset.speaker}></img>
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
                            <span className="f-20">Roll the Wobblebot to unlock a new degen</span>
                            <div className="panel reroll">
                                <img src={Asset.logo_white}></img>
                                <div className="col f-center rg-3">
                                    <span className="f-18">FIND THE PERFECT DEGEN WOB PFP</span>
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
                                            <span className="f-18">You need a degen wob to roll the wobblebot</span>
                                            <span className="row wrap cg-5 rg-2 f-center">
                                                <button className="btn" onClick={buyOnME}>Buy on M.E</button>
                                                <button className="btn">Transformer</button>
                                            </span>
                                        </div> :
                                        <div className="col rg-2 f-center">
                                            <span className="f-18">ROLL THE WOBBLEBOT</span>
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
                            <div className="panel-right">
                                <div className='row f-center'>
                                    <img src={Asset.logo_white} style={{ width: '50px', borderRadius: '50px', marginRight: '10px' }}></img>
                                    <div className='f-16'>Collector Dashboard</div>
                                </div>
                                <button className='profile-button' onClick={() => { navigation('/stake/store') }}>View My Portfolio</button>
                                <button className='profile-button' onClick={() => { setOpen(true) }}>Edit Profile</button>
                                <Modal
                                    open={open}
                                    onClose={() => setOpen(false)}
                                >
                                    <div className='edit-modal-container'>
                                        <h1 style={{ color: 'white' }}>
                                            Edit profile
                                        </h1>
                                        <div className='edit-modal-bg'>
                                            <div className='row cg-3' style={{ justifyContent: 'flex-start !important' }}>

                                                {showImage != null && image == null && <img className='user-avatar' src={showImage}></img>}

                                                {/* {(image == null) ? <div className='user-avatar'></div> : <img className='user-avatar' src={image}></img>} */}
                                                {(image == null && showImage == null) && <div className='user-avatar'></div>}
                                                {(image != null) && <img className='user-avatar' src={image}></img>}

                                                <input id="avatar" type="file" style={{ display: 'none' }} accept="image/jpeg, image/png, image/jpg" onChange={handleChange}></input>
                                                <div className='justify-s fd-c ts gap10'>
                                                    <div className='w100'>
                                                        <button className='address-btn' onClick={handleClick}>
                                                            <div>Change profile picture</div>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='mt-3'>
                                                Email address
                                                <div className='mt-1'>
                                                    <input type="input" className='input' onChange={handleChangeEmail} value={userEmail} />
                                                </div>
                                            </div>
                                            <div className='mt-3 row cg-2'>
                                                <button className='update' onClick={updateUserInfo}>update</button>
                                                <button className='delete' onClick={deleteUserInfo}>delete</button>
                                            </div>
                                        </div>
                                    </div>
                                </Modal>
                                <div className='row f-center' style={{ marginTop: '20px' }}>
                                    <img src={Asset.token} style={{ width: '50px', borderRadius: '50px', marginRight: '10px' }}></img>
                                    <div className='f-16'>WOB TOKEN</div>
                                </div>
                                <div className='f-16' style={{ marginTop: '15px' }}>Balance - {wobBalance} $WOB</div>

                                <span className="f-16 mt-3">Top degen Leaderboards</span>
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