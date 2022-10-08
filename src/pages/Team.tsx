import { useState } from "react";

import Header from "./Header"
import Asset from './assets';
import Footer from "./Footer";

export default function Team() {

    return (
        <div className="team">
            <Header title={'WOBBLEBUG'} />
            <div className="container">
                <div className="col f-center mt-9 rg-6">
                    <img className="mylogo" src={Asset.logo1}></img>
                    <div className="row f-center cg-3 mt-4">
                        <span className="line"></span>
                        <span className="f-32">TEAM</span>
                        <span className="line"></span>
                    </div>
                    <div className="flex-row j-center">
                        <div className="card">
                            <img src={Asset.logo_red1}></img>
                            <div className="col f-center rg-2">
                                <span>Wuki</span>
                                <span className="f-12">Creator</span>
                            </div>
                            <div className="card-content">
                                <span className="f-12">Grammy nominated DJ and producer.</span>
                                <span className="f-12">International Touring musician & crypto/NFT connoisseur.</span>
                            </div>
                            <div className="row f-center cg-1">
                                <img src={Asset.twitter}></img>
                                <img src={Asset.instagram}></img>
                                <img src={Asset.tictok}></img>
                            </div>
                        </div>
                        <div className="card">
                            <img src={Asset.logo_red1}></img>
                            <div className="col f-center rg-2">
                                <span>Bert</span>
                                <span className="f-12">3D Art Director</span>
                            </div>
                            <div className="card-content">
                                <span className="f-12">Senior 3D Artist and CG Generalist with experience working professionally in multiple industries.</span>
                            </div>
                            <div className="row f-center cg-1">
                                <img src={Asset.twitter}></img>
                                <img src={Asset.instagram}></img>
                                <img src={Asset.tictok}></img>
                            </div>
                        </div>
                        <div className="card">
                            <img src={Asset.logo_red1}></img>
                            <div className="col f-center rg-2">
                                <span>Rawtek</span>
                                <span className="f-12">Creative Director</span>
                            </div>
                            <div className="card-content">
                                <span className="f-12">Music Producer & International Touring DJ.</span>
                                <span className="f-12">Illustrator & Concept Artist.</span>
                            </div>
                            <div className="row f-center cg-1">
                                <img src={Asset.twitter}></img>
                                <img src={Asset.instagram}></img>
                                <img src={Asset.tictok}></img>
                            </div>
                        </div>
                        <div className="card">
                            <img src={Asset.logo_red1}></img>
                            <div className="col f-center rg-2">
                                <span>Christy</span>
                                <span className="f-12">Project Manager</span>
                            </div>
                            <div className="card-content">
                                <span className="f-12">Political shill turned crypto / music shill.</span>
                                <span className="f-12">Rebel Society.</span>
                            </div>
                            <div className="row f-center cg-1">
                                <img src={Asset.twitter}></img>
                                <img src={Asset.instagram}></img>
                                <img src={Asset.tictok}></img>
                            </div>
                        </div>
                        <div className="card">
                            <img src={Asset.logo_red1}></img>
                            <div className="col f-center rg-2">
                                <span>Rambo</span>
                                <span className="f-12">Development</span>
                            </div>
                            <div className="card-content">
                                <span className="f-12">Project Manager and Blockchain developer</span>
                                <span className="f-12">Crypto since 2017</span>
                            </div>
                            <div className="row f-center cg-1">
                                <img src={Asset.twitter}></img>
                                <img src={Asset.instagram}></img>
                                <img src={Asset.tictok}></img>
                            </div>
                        </div>
                        <div className="card">
                            <img src={Asset.logo_red1}></img>
                            <div className="col f-center rg-2">
                                <span>Hayden</span>
                                <span className="f-12">Advisor</span>
                            </div>
                            <div className="card-content">
                                <span className="f-12">Visual Artist & NFT community consultant.</span>
                                <span className="f-12">DeFi Expert.</span>
                            </div>
                            <div className="row f-center cg-1">
                                <img src={Asset.twitter}></img>
                                <img src={Asset.instagram}></img>
                                <img src={Asset.tictok}></img>
                            </div>
                        </div>
                        <div className="card">
                            <img src={Asset.logo_red1}></img>
                            <div className="col f-center rg-2">
                                <span>Ryan</span>
                                <span className="f-12">Music Manager</span>
                            </div>
                            <div className="card-content">
                                <span className="f-12">Represents multiple Grammy nominated artists.</span>
                                <span className="f-12">Handling strategic partnerships and big picture planning.</span>
                            </div>
                            <div className="row f-center cg-1">
                                <img src={Asset.twitter}></img>
                                <img src={Asset.instagram}></img>
                                <img src={Asset.tictok}></img>
                            </div>
                        </div>
                        <div className="card">
                            <img src={Asset.logo_red1}></img>
                            <div className="col f-center rg-2">
                                <span>Wiens</span>
                                <span className="f-12">Marketing</span>
                            </div>
                            <div className="card-content">
                                <span className="f-12">&10M E-commerce founder and marketeer.</span>
                                <span className="f-12">Crypto since 2017.</span>
                            </div>
                            <div className="row f-center cg-1">
                                <img src={Asset.twitter}></img>
                                <img src={Asset.instagram}></img>
                                <img src={Asset.tictok}></img>
                            </div>
                        </div>
                        <div className="card">
                            <img src={Asset.logo_red1}></img>
                            <div className="col f-center rg-2">
                                <span>Zach</span>
                                <span className="f-12">Community Manager</span>
                            </div>
                            <div className="card-content">
                                <span className="f-12">Senior community manager for multiple top NFT projects.</span>
                                <span className="f-12">Crypto since 2017.</span>
                            </div>
                            <div className="row f-center cg-1">
                                <img src={Asset.twitter}></img>
                                <img src={Asset.instagram}></img>
                                <img src={Asset.tictok}></img>
                            </div>
                        </div>
                        <div className="card">
                            <img src={Asset.logo_red1}></img>
                            <div className="col f-center rg-2">
                                <span>Dwoopy</span>
                                <span className="f-12">Development</span>
                            </div>
                            <div className="card-content">
                                <span className="f-12">Experienced blockchain developer.</span>
                                <span className="f-12">Your friendly neighbourhood Boogle.</span>
                            </div>
                            <div className="row f-center cg-1">
                                <img src={Asset.twitter}></img>
                                <img src={Asset.instagram}></img>
                                <img src={Asset.tictok}></img>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}