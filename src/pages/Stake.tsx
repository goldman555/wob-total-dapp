import React, { useEffect, useMemo, useState } from "react";
import Header from "./Header";
import NFT from "./components/NFT";
import { useAnchorWallet, useConnection, useWallet } from "@solana/wallet-adapter-react";
import * as anchor from "@project-serum/anchor";
import axios from 'axios';
import Chart from "react-apexcharts";

import Asset from './assets';
import '../scss/Main.scss';

// import '../scss/Stake.scss';
import { Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { getParsedNftAccountsByOwner } from "@nfteyez/sol-rayz";
import { Token, TOKEN_PROGRAM_ID } from "@solana/spl-token"
import jsonList from '../pair.json';
import { Snackbar } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { AlertState } from "../utils";
import { useBlockchainContext } from "../provider";

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
export default function Stake() {

    const [state, { onClaim, onStake, onUnstake }]: any = useBlockchainContext();
    const wallet = useAnchorWallet();
    const connection = new anchor.web3.Connection(
        CLUSTER_RPC!
    )
    const [wobBalance, setWobBalance] = useState<any>(0);
    const [curNft, setCurNft] = useState<NFTInfo>();
    const [curType, setCurType] = useState(false);
    const [recentNestNfts, setRecentNestNfts] = useState<any[]>([]);
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

    const [metric, setMetric] = useState<MetricInfo>({
        nestedCount: 0,
        bronzeCount: 0,
        silverCount: 0,
        goldCount: 0
    });
    const [leaderboardData, setLeaderboardData] = useState<any[]>([]);

    const [alertState, setAlertState] = useState<AlertState>({
        open: false,
        message: "",
        severity: undefined,
    });

    let chartOption = {
        chart: {
            id: "basic-bar"
        },
        xaxis: {
            categories: [
                'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
            ]
        }
    };
    let chartSeries = [
        {
            name: "series-1",
            data: [0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0]
        }
    ];

    const stakedNftClick = (nft: NFTInfo) => {
        setCurNft(nft);
        setCurType(true);
    }

    const getMetricsInfo = async () => {
        var axios = require('axios');
        let response;
        try {
            response = await axios.post(`${BASEURL}/getMetricsInfo`);
            if (response.data.result.length > 5) {
                let tmpList: any[] = [];
                for (let i = 0; i < 5; i++) {
                    tmpList.push(response.data.result[i]);
                }
                setRecentNestNfts(tmpList);
            } else {
                setRecentNestNfts(response.data.result);
            }

            setMetric({
                nestedCount: response.data.wobCount,
                silverCount: response.data.silverCount,
                bronzeCount: response.data.bronzeCount,
                goldCount: response.data.goldCount
            })
            setLeaderboardData(response.data.leaderboard);
        } catch (err) {

        }
    }

    const prettyShow = (addr: String) => {
        return addr.slice(0, 4) + '...' + addr.slice(40, 44);
    }

    const prettyTime = (seconds: any) => {
        let days = Math.floor(seconds / 86400);
        let hrs = Math.floor((seconds - days * 86400) / 3600);
        let mns = Math.floor((seconds - days * 86400 - hrs * 3600) / 60);
        if (days == 0) {
            return <><span>{hrs}H : </span><span>{mns}M</span></>;
        } else {
            return <><span>{days}D : </span><span>{hrs}H : </span><span>{mns}M</span></>;
        }

    }

    useEffect(() => {
        (async () => {
            setWobBalance(state.tokenBalance);
            await getMetricsInfo();
            console.log(`state:::`, state.stakeList);
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
                                <span>Staked NFTs</span>
                                <div className="row wrap cg-2 rg-2">
                                    {
                                        state.stakeList.map((item: any, idx: any) => (
                                            <StakeNFT imgSrc={item.imageUrl} id={idx} nft={item} onClicks={[async () => { stakedNftClick(item) }]} key={idx}></StakeNFT>
                                        ))
                                    }
                                    {
                                        state.stakeList.length == 0 &&
                                        <div style={{ minHeight: '250px', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                                            <span>You have no Staked Wobs</span>
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className="panel transform">
                                <div>UnStaked NFTs</div>
                                <div className='row wrap cg-2 rg-2' style={{ justifyContent: 'center' }}>
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
                                <div style={{ textAlign: 'center', margin: '20px', cursor: 'pointer' }} onClick={() => { }}>Learn More about the nesting</div>
                            </div>


                            <div className="panel transform">
                                <div>Overall Staking Metrics</div>
                                <div>
                                    <Chart
                                        options={chartOption}
                                        series={chartSeries}
                                        type="line"
                                        width="100%"
                                    />
                                </div>
                                <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column' }}>
                                    <div>Recently staked</div>
                                    {
                                        recentNestNfts.map((item, idx) => (
                                            <div className='row between mt-2 cg-2' key={idx}>
                                                <div className="row f-center">
                                                    <img src={item.image_url == '' ? Asset.logo_red : item.image_url} className="mr-1" style={{ width: '50px', borderRadius: '50%' }}></img>
                                                    <div className='f-14'>{prettyShow(item.ownerWallet)}</div>
                                                </div>
                                                <div className="row f-center f-12">
                                                    <div>{prettyTime(item.interval)}</div>
                                                </div>
                                            </div>
                                        ))
                                    }
                                    {
                                        recentNestNfts.length == 0 &&
                                        <span>There is no NESTed NFTs</span>
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
                                <button className='profile-button' onClick={() => { }}>View My Portfolio</button>
                                <button className='profile-button' onClick={() => { }}>Edit Profile</button>
                                <div className='row f-center' style={{ marginTop: '20px' }}>
                                    <img src={Asset.token} style={{ width: '50px', borderRadius: '50px', marginRight: '10px' }}></img>
                                    <div className='t14'>My Rewards</div>
                                </div>
                                <div className='t14' style={{ marginTop: '15px' }}>Balance - {wobBalance} $WOB</div>

                                {
                                    curNft ?
                                        <>
                                            <div className='t14' style={{ marginTop: '30px' }}>You have Selected {'1'}</div>
                                            <img src={curNft.imageUrl} style={{ width: '120px', borderRadius: '10px', marginTop: '20px' }}></img>
                                            <div className='t10' style={{ marginTop: '5px' }}>#2341</div>

                                            <div style={{ display: 'flex', flexWrap: 'wrap', columnGap: '10px' }}>
                                                {!curType && <button className='profile-button' style={{ width: '100px' }} onClick={() => { onStake(curNft) }}>Stake</button>}
                                                {curType &&
                                                    <>
                                                        <button className='profile-button' style={{ width: '100px' }} onClick={() => { onUnstake(curNft) }}>Unstake</button>
                                                        <button className='profile-button' style={{ width: '100px' }} onClick={() => { onClaim(curNft) }}>Claim</button>
                                                    </>}
                                            </div>
                                        </> :
                                        <div style={{ minHeight: '200px' }}></div>
                                }

                            </div>
                            <div className='panel-right'>
                                <div>Global Statistics</div>
                                <div className='row f-center mt-2 f-14 cg-2'><img src={Asset.logo_red}></img><div style={{ width: '150px' }}>Total Unique Holders</div></div>
                                <div>6,574</div>
                                <div className='row f-center mt-2 f-14 cg-2'><img src={Asset.logo_red}></img><div style={{ width: '150px' }}>Total Nested Wobble Bugs</div></div>
                                <div>{metric.nestedCount}</div>
                                <div className='row f-center mt-2 f-14 cg-2'><img src={Asset.logo_red}></img><div style={{ width: '150px' }}>Bronze Nests achieved</div></div>
                                <div>{metric.bronzeCount}</div>
                                <div className='row f-center mt-2 f-14 cg-2'><img src={Asset.logo_red}></img><div style={{ width: '150px' }}>Silver Nests achieved</div></div>
                                <div>{metric.silverCount}</div>
                                <div className='row f-center mt-2 f-14 cg-2'><img src={Asset.logo_red}></img><div style={{ width: '150px' }}>Gold Nests achieved</div></div>
                                <div>{metric.goldCount}</div>
                            </div>
                            <div className='panel-right'>
                                <div>Leaderboards</div>
                                {
                                    leaderboardData.map((item, idx) => (
                                        <div className='row mt-1' key={idx}><img src={item.image_url == '' ? Asset.logo_red : item.image_url} className="mr-1" style={{ width: '42px', borderRadius: '50%' }}></img><div className='f-14'>{prettyShow(item.ownerWallet)}</div></div>
                                    ))
                                }

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