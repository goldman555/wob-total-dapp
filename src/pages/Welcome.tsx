import React, { useEffect, useMemo, useState } from "react";
import Header from "./Header";
import NFT from "./components/NFT";
import { useAnchorWallet, useConnection, useWallet } from "@solana/wallet-adapter-react";
import * as anchor from "@project-serum/anchor";
import axios from 'axios';

import Asset from './assets';
import '../scss/Main.scss';
import '../scss/Welcome.scss';
import Footer from "./Footer";

const roadmapMockup = [
    {
        img: Asset.logo1,
        text: "ACQUIRE MEGAWOB"
    },
    {
        img: Asset.logo1,
        text: "STAKE YOUR WOB"
    },
    {
        img: Asset.logo1,
        text: "EARN $WOB"
    },
    {
        img: Asset.logo1,
        text: "SPEND IN WOBMART"
    },
    {
        img: Asset.logo1,
        text: "TAKE WOBBLEDRUG"
    },
    {
        img: Asset.logo1,
        text: "TRANSFORM"
    },
    {
        img: Asset.logo1,
        text: "RE-ROLL / BACK TO MEGAWOB"
    }
] as { img: any, text: string }[]

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
        <div className="welcome">
            <Header title={'WOBBLEBUG'} />
            <div className={"main"}>
                <div className="container">
                    <div className="col f-center">
                        <img className="img" src={Asset.face_logo}></img>
                        <span className="f-32 mb-5">THE FIRST TOKENIZED MUSICIAN IN HISTORY</span>
                        <img src={Asset.logo1} className="logo1"></img>
                        <div className="section-title">
                            <span ></span>
                            <h3 className="f-32">PREFACE</h3>
                            <span ></span>
                        </div>
                        <div className="section">
                            <span>An alien, a dj, an out of this world electronic music producer, Wobblebug is so much more than an NFT project...</span>
                            <span>Collection of 10k utility enabled PFP's that are innovating tech and music.</span>
                            <span>Holding a Wobblebug is your key to accessing a private club where you will have the chance to help shape the career of an up and coming electronic music producer and DJ.</span>
                            <span>The community will have the opportunity to help the WOB team and vote to make decisions on things like music, art, content, ideas and so much more.</span>
                        </div>
                        <div className="section1">
                            <span className="f-32">BENEFITS THAT INCREASE OVER TIME:</span>
                            <span className="f-22">By holding a MegaWob or Degen and becoming a member of the Wob Mob you will have exclusive access to the following:</span>
                            <div className="col f-20">
                                <li>IRL Events, Metaverse Events,</li>
                                <li>Music Releases,</li>
                                <li>Collaboration opportunities for music, art, content creation.</li>
                                <li>Opportunity to earn $wob and purchase physical and digital items from the $wobmart</li>
                            </div>
                        </div>

                        <img src={Asset.logo1} className="logo1"></img>
                        <div className="section-title">
                            <span ></span>
                            <h3 className="f-32">THE NFTS</h3>
                            <span ></span>
                        </div>
                        <span className="f-14 mt-3">EACH WOBBLEBUG COLLECTION PROVIDES A DIFFERENT SET OF UTILITIES IN THE WOBVERSE</span>

                        <div className="section">
                            <div className="col f-center">
                                <span>ARE YOU A MEGAWOB OR A DEGEN WOB?</span>
                                <div className="flex-row p-5 cg-4">
                                    <div className="group">
                                        <div className="ele1">
                                            <img src={Asset.origin}></img>
                                            <div className="item">
                                                <span>GENESIS COLLECTION (ETH) - 1250</span>
                                            </div>
                                            <span>MINT 11.11.21</span>
                                            <span>NO CURRENCY UTILITY</span>
                                        </div>
                                        <img src={Asset.opensea}></img>
                                    </div>
                                    <div className="group">
                                        <div className="ele1">
                                            <img src={Asset.wob}></img>
                                            <div className="item">
                                                <span>MEGAWOBS (SOL) - 10K</span>
                                            </div>
                                            <span>MINT 6.9.2022</span>
                                            <span>EARN $WOB BY STAKING</span>
                                        </div>
                                        <img src={Asset.magiceden}></img>
                                    </div>
                                    <div className="group">
                                        <div className="ele1">
                                            <img src={Asset.drug}></img>
                                            <div className="item">
                                                <span>WOBBLEDRUGS (SOL) - 10k</span>
                                            </div>
                                            <span>FREE CLAIM FOR MEGAWOBS - 8.17.22</span>
                                            <span>USED TO TRANSFORM TO A DEGENWOB</span>
                                        </div>
                                        <img src={Asset.magiceden}></img>
                                    </div>
                                    <div className="group">
                                        <div className="ele1">
                                            <img src={Asset.degen}></img>
                                            <div className="item">
                                                <span>DEGENWOBS (SOL) - ∞</span>
                                            </div>
                                            <span>TRANSFORM 10.4.22</span>
                                            <span>EARN $WOB BY STAKING + EXCLUSIVE ACCESS</span>
                                        </div>
                                        <img src={Asset.magiceden}></img>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <img src={Asset.logo1} className="logo1"></img>
                        <div className="section-title">
                            <span ></span>
                            <h3 className="f-32">YOUR JOURNEY</h3>
                            <span ></span>
                        </div>

                        <div className="section f-center">
                            <span className="f-24">READY TO START?</span>
                            <span>Follow the steps below and join the invasion!</span>
                            <span className="f-14">If you are ready to go on the adventure of a lifetime and join the invasion, acquire your Megawob or Degen on Magic Eden or OpenSea and LET THE BASS begin...</span>
                            <div className="roadroadmap">
                                {roadmapMockup.map((i: any, k: number) => (
                                    <>
                                        <div>
                                            <img src={i.img} alt="" />
                                            <div>
                                                <span>{i.text}</span>
                                            </div>
                                        </div>
                                        {k !== roadmapMockup.length - 1 && (
                                            <span></span>
                                        )}
                                    </>
                                ))}
                            </div>
                            <div className="btn-group">
                                <button className="market-button">
                                    <img src={Asset.magiceden1}></img>
                                    <span>MAGIC EDEN</span>
                                </button>
                                <button className="market-button">
                                    <img src={Asset.opensea}></img>
                                    <span>OPEN SEA</span>
                                </button>
                            </div>
                        </div>

                        <img src={Asset.logo1} className="logo1"></img>
                        <div className="section-title">
                            <span ></span>
                            <h3 className="f-32">ROADMAP</h3>
                            <span ></span>
                        </div>

                        <div className="section roadmap f-center">
                            <span>WHERE WERE GOING</span>
                            <img src={Asset.already} alt="" />
                            <span>WHERE WEVE BEEN</span>
                            <img src={Asset.future} alt="" />
                            <span>Wobblebug is the first of many Web3 musicians that will invade the industry.</span>
                            <span className="f-14">Each WOB you own brings you closer to the forefront of music tech innovation.</span>
                        </div>

                        <img src={Asset.logo1} className="logo1"></img>
                        <div className="section-title">
                            <span ></span>
                            <h3 className="f-32">UTILITIES</h3>
                            <span ></span>
                        </div>

                        <div className="section utilities f-center">
                            <div className="col f-center mt-3 mb-3 rg-4">
                                <div className="row cg-2 f-center">
                                    <img src={Asset.logo_white} className="logo"></img>
                                    <span className="f-28">STAKING</span>
                                    <img src={Asset.logo_white} className="logo"></img>
                                </div>
                                <span className="f-16">Once you have acquired the perfect Wobblebug and become part of the Wob Mob, you now have the ability to Stake your MegaWob or Degen and start earning the $WOB utility token immediately.</span>
                                <button>DEGEN & MEGAWOB STAKING</button>
                            </div>
                            <div className="col f-center mt-3 mb-3 rg-4">
                                <div className="row cg-2 f-center">
                                    <img src={Asset.logo_white} className="logo"></img>
                                    <span className="f-28">WOBMART</span>
                                    <img src={Asset.logo_white} className="logo"></img>
                                </div>
                                <span className="f-16">Once you have earned enough $WOB, head over to the $WobMart for a one of a kind web3 shopping experience stacked with legit physical and digital items.</span>
                                <div className="btn-group">
                                    <button className="market-button">ENTER WOBMART</button>
                                    <button className="market-button">$WOB INFO</button>
                                </div>
                            </div>

                            <div className="col perscription f-center mt-3 mb-3 rg-4">
                                <div className="row cg-2 f-center">
                                    <img src={Asset.logo_white} className="logo"></img>
                                    <span className="f-28">PERSCRIPTION</span>
                                    <img src={Asset.logo_white} className="logo"></img>
                                </div>
                                <span className="f-16">If you have received a prescription for a Wobbledrug in your wallet from our labs, click below to pick up your drugs at the claim site and store them for future use.</span>
                                <img src={Asset.img1} alt="" />
                                <button>CLAIM WOBBLEDRUGS</button>
                            </div>

                            <div className="col transformation f-center mt-3 mb-3 rg-4">
                                <div className="row cg-2 f-center">
                                    <img src={Asset.logo_white} className="logo"></img>
                                    <span className="f-28">TRANSFORMATION</span>
                                    <img src={Asset.logo_white} className="logo"></img>
                                </div>
                                <span className="f-16">Now that you have your drug, are you actually brave enough to take it and find out what it does?</span>
                                <span className="f-16">If so, head to the transformation spaceship and find out what kind of Degenerate your MegaWob really is under that badass exterior.</span>
                                <img src={Asset.img2} alt="" />
                                <button>TRANSFORMATION SPACESHIP</button>
                            </div>

                            <div className="col reroll f-center mt-3 mb-3 rg-4">
                                <div className="row cg-2 f-center">
                                    <img src={Asset.logo_white} className="logo"></img>
                                    <span className="f-28">DEGEN RE-ROLL</span>
                                    <img src={Asset.logo_white} className="logo"></img>
                                </div>
                                <span className="f-16">Now that you are a full on Degenerate, you have a tough decision to make...</span>
                                <span className="f-16">Are you happy with how Degenerate you are or do you want to try your luck at a brand new Degen in hopes of becoming more Rare? If you choose the latter, you can use our one of a kind Re-Roll system that allows you to switch out your current Degen for a new and hopefully more rare Degen by paying 0.2 SOL.</span>
                                <img src={Asset.img3} alt="" />
                                <button>DEGEN RE-ROLL</button>
                            </div>
                        </div>


                        <img src={Asset.logo1} className="logo1"></img>
                        <div className="section-title">
                            <span ></span>
                            <h3 className="f-32 t-center">WOBBLEBUG THE DJ & MUSIC PRODUCER</h3>
                            <span ></span>
                        </div>

                        <div className="col rg-3 t-center producer">
                            <div className="section1">
                                <span className="f-12 mt-4">Help Wobblebug accomplish its dreams to become a successful and respected electronic music producer and dj in a way that has never been done before...</span>
                                <span className="f-12">Now that you have gone through the Invasion and are a veteran in the Wob Mob Squad, you have earned the opportunity to become a member of the Wob Music Group and help Wobblebug accomplish its dreams and become one of the most successful DJ / Producers in electronic music.</span>
                                <span className="f-12">To become a member you simply have to participate by giving feedback on music, art, content and more and helping to shape the decisions made by the WB team.OR by providing a creative service for the community such as participating in remix contests of WB music, art and content contests and so much more....</span>
                                <span className="f-12">Once inducted in the Wob Music Group you will get exclusive perks such as exclusive first access to song previews, vip access to wobblebug IRL and Metaverse events and more. The more you share the WB music online and spread the word the more well known WB will become and the more valuable you WB assets you acquire over time will be worth.</span>
                            </div>
                            <div className="flex-row f-center cg-6 rg-4">
                                <div className="col rg-3 f-center">
                                    <img src={Asset.wob_profile}></img>
                                    <span>"WOBBLEDRUG" SONG</span>
                                    <button>LISTEN NOW</button>
                                </div>
                                <div className="col rg-3 f-center">
                                    <img src={Asset.wob_baby}></img>
                                    <span>“WOBBLEDRUG” MUSIC VIDEO</span>
                                    <button>WATCH NOW</button>
                                </div>
                            </div>
                        </div>

                        <img src={Asset.logo1} className="logo1"></img>
                        <div className="section-title">
                            <span ></span>
                            <h3 className="f-32 t-center">WOB MUSIC GROUP</h3>
                            <span ></span>
                        </div>

                        <div className="f-center col rg-4 musicgroup">
                            <span className="f-24">AN INNOVATIVE RECORD LABEL BY WOBBLEBUG</span>
                            <span>WOBBLE LABS WILL BE THE CENTRAL HOME THAT WILL RELEASE THE MUSIC CREATED BY WOBBLEBUG AND IT'S COMMUNITY MEMBERS. WE PLAN TO ROLLOUT SINGLES, EP'S AND ALBUMS JUST LIKE ANY OTHER ARTIST WOULD. THE MUSIC WILL BE AVAILABLE ON THE TRADITIONAL PLATFORMS INCLUDING SPOTIFY, APPLE, AMAZON, YOUTUBE, AUDIUS AND MORE.</span>
                            <button>
                                <span>ENTER WOB MUSIC GROUP</span>
                                <img src={Asset.logo_white} alt="" />
                            </button>
                        </div>

                    </div>
                </div>
            </div>
            <Footer></Footer>
        </div>
    );
}