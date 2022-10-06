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
import { Modal } from '@material-ui/core';

import { IDL } from "../constant/IDL/punky_staking";
import StakeNFT from "./components/StakeNFT";
import UnStakeNFT from "./components/UnStakeNFT";

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

interface NFTInfo {
    name: string,
    imageUrl: string,
    mint: PublicKey,
    tokenAccount: PublicKey,
    updateAuthority: PublicKey,
    tokenType: Number,
    canClaim: Boolean,
    daysPassed: Number,
    current: Number,
    rewardATA: String,
    tokenTo: String,
}

interface MetricInfo {
    nestedCount: Number,
    bronzeCount: Number,
    silverCount: Number,
    goldCount: Number
}
export default function Store() {

    const [state, { onClaim, onStake, onUnstake }]: any = useBlockchainContext();
    const wallet = useAnchorWallet();
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
    const [open, setOpen] = useState(false);

    const [alertState, setAlertState] = useState<AlertState>({
        open: false,
        message: "",
        severity: undefined,
    });

    const [selectImg, setSelectImg] = useState(null);
    const [image, _setImage] = useState(null);
    const [showImage, setShowImage] = useState(null);

    const [goldList, setGoldList] = useState<NFTInfo[]>([]);
    const [silverList, setSilverList] = useState<NFTInfo[]>([]);
    const [bronzeList, setBronzeList] = useState<NFTInfo[]>([]);
    const [normalList, setNormalList] = useState<NFTInfo[]>([]);

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
            { address: wallet?.publicKey.toString() },
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
                address: wallet?.publicKey.toString()
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
            setWobBalance(state.tokenBalance);
            await getUserProfile();
            let goldList: NFTInfo[] = [];
            let silverList: NFTInfo[] = [];
            let bronzeList: NFTInfo[] = [];
            let normalList: NFTInfo[] = [];
            let stakeList = state.stakeList;
            stakeList.forEach((item: NFTInfo) => {
                if (item.daysPassed >= 90) {
                    goldList.push(item);
                } else if (item.daysPassed < 90 && item.daysPassed >= 60) {
                    silverList.push(item);
                } else if (item.daysPassed < 60 && item.daysPassed >= 30) {
                    bronzeList.push(item);
                } else {
                    normalList.push(item);
                }
            })
            setGoldList(goldList);
            setSilverList(silverList);
            setBronzeList(bronzeList);
            setNormalList(normalList);
        })()
    }, [wallet, state])

    return (
        <>
            <Header />
            <div className="main">
                <div className="container">
                    <div className="main-part">
                        <div className="left">
                            <div className="panel transform">
                                <span>Gold Tier</span>
                                <div className="row wrap cg-2 rg-2 w100">
                                    {
                                        goldList.map((item: any, idx: any) => (
                                            <StakeNFT imgSrc={item.imageUrl} id={idx} nft={item} onClicks={[async () => { }]} key={idx}></StakeNFT>
                                        ))
                                    }
                                    {
                                        goldList.length == 0 &&
                                        <div style={{ minHeight: '250px', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                                            <span>You have no Staked Wobs</span>
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className="panel transform">
                                <span>Silver Tier</span>
                                <div className="row wrap cg-2 rg-2 w100">
                                    {
                                        silverList.map((item: any, idx: any) => (
                                            <StakeNFT imgSrc={item.imageUrl} id={idx} nft={item} onClicks={[async () => { }]} key={idx}></StakeNFT>
                                        ))
                                    }
                                    {
                                        silverList.length == 0 &&
                                        <div style={{ minHeight: '250px', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                                            <span>You have no Staked Wobs</span>
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className="panel transform">
                                <span>Bronze Tier</span>
                                <div className="row wrap cg-2 rg-2 w100">
                                    {
                                        bronzeList.map((item: any, idx: any) => (
                                            <StakeNFT imgSrc={item.imageUrl} id={idx} nft={item} onClicks={[async () => { }]} key={idx}></StakeNFT>
                                        ))
                                    }
                                    {
                                        bronzeList.length == 0 &&
                                        <div style={{ minHeight: '250px', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                                            <span>You have no Staked Wobs</span>
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className="panel transform">
                                <div>UnStaked NFTs</div>
                                <div className='row wrap cg-2 rg-2 w100' style={{ justifyContent: 'center' }}>
                                    {
                                        state.nftList.map((item: any, idx: any) => (
                                            <UnStakeNFT imgSrc={item.imageUrl} id={idx} nft={item} onClicks={[async () => { }]} key={idx}></UnStakeNFT>
                                        ))
                                    }
                                    {
                                        state.nftList.length == 0 &&
                                        <div className='col' style={{ justifyContent: 'center', alignItems: 'center', marginTop: '80px' }}>
                                            <span>You have no Eligible Wobs to stake</span>
                                            <button className='profile-button' onClick={() => { window.open('https://magiceden.io/', '_blank') }}>Buy on Magic Eden</button>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="right">
                            <div className='panel-right'>
                                <div className='row f-center'>
                                    <img src={Asset.logo_white} style={{ width: '50px', borderRadius: '50px', marginRight: '10px' }}></img>
                                    <div className='f-14'>Collector Dashboard</div>
                                </div>
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
                                    <div className='t14'>My Rewards</div>
                                </div>
                                <div className='t14' style={{ marginTop: '15px' }}>Balance - {wobBalance} $WOB</div>

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