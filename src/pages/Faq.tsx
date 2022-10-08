import { useState } from "react";

import Header from "./Header"
import Asset from './assets';
import Footer from "./Footer";
import Icons from "./components/Icons";

export default function Faq() {

    const [open1, setOpen1] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [open3, setOpen3] = useState(false);
    const [open4, setOpen4] = useState(false);
    const [open5, setOpen5] = useState(false);

    return (
        <div className="faq">
            <Header title={'WOBBLEBUG'} />
            <div className="container">
                <div className="col f-center mt-9 rg-6">
                    <img className="mylogo" src={Asset.logo1}></img>
                    <div className="row f-center cg-3 mt-4">
                        <span className="line"></span>
                        <span className="f-32">FAQ</span>
                        <span className="line"></span>
                    </div>
                    <div className="col f-center rg-2 w100">
                        <div className="section last">
                            <div className="first row between">
                                <span>What is Wobblebug?</span>
                                <div onClick={() => { setOpen1(!open1); }}>
                                    {open1 ? <Icons.AngleUp></Icons.AngleUp> : <Icons.AngleDown></Icons.AngleDown>}
                                </div>
                            </div>
                            {
                                open1 && <span>Wobblebug is the alter-ego of Wuki, a Grammy nominated DJ and Producer who has played the worlds biggest festivals like Ultra, EDC, and (other show). Wobblebug is the first ever tokenized Grammy nominated DJ and producer owned through decentralized means. MegaWob NFTs are your ownership token into Wobblebugs Career.</span>
                            }
                        </div>
                        <div className="section last">
                            <div className="first row between">
                                <span>Where can I get Wobblebug NFTs?</span>
                                <div onClick={() => { setOpen2(!open2) }}>
                                    {open2 ? <Icons.AngleUp></Icons.AngleUp> : <Icons.AngleDown></Icons.AngleDown>}
                                </div>
                            </div>
                            {
                                open2 && <span>You can start your journey by purchasing a Wobblebug NFT on Magic Eden.</span>
                            }
                        </div>
                        <div className="section last">
                            <div className="first row between">
                                <span>What is the Utility of holding a Wobblebug NFT?</span>
                                <div onClick={() => { setOpen3(!open3) }}>
                                    {open3 ? <Icons.AngleUp></Icons.AngleUp> : <Icons.AngleDown></Icons.AngleDown>}
                                </div>
                            </div>
                            {
                                open3 && <div className="col rg-2">
                                    <span>Community members will be able to acquire and stake their MegaWob NFTs for $WOB, the utility token of the Wobblebug ecosystem. With $WOB members will be able to acquire things like Wobblebug merch, exclusive music and stems made by Wobblebug, tickets to live events and major festivals, loot boxes, and much more.</span>
                                    <span>In addition to earning and utilizing the $WOB Utility token, when you hold a MegaWob NFT you become part of the most exclusive club of musicians and music aficionados on the blockchain. Wobblebug treats his disciples as family and rewards them like his own. Becoming a part of this club will allow you early access to shows Wobblebug performs in, potential VIP experiences at larger music events, inter group alpha, and much much more.</span>
                                </div>
                            }
                        </div>
                        <div className="section last">
                            <div className="first row between">
                                <span>How do I Stake my Wobblebug NFT?</span>
                                <div onClick={() => { setOpen4(!open4) }}>
                                    {open4 ? <Icons.AngleUp></Icons.AngleUp> : <Icons.AngleDown></Icons.AngleDown>}
                                </div>
                            </div>
                            {
                                open4 && <div className="col rg-2">
                                    <span>Stake your Wobblebug by visiting our staking site here.</span>
                                    <span>For more information on staking, checkout our Wobpaper</span>
                                </div>
                            }
                        </div>
                        <div className="section">
                            <div className="first row between">
                                <span>What is a Re-Roll?</span>
                                <div onClick={() => { setOpen5(!open5) }}>
                                    {open5 ? <Icons.AngleUp></Icons.AngleUp> : <Icons.AngleDown></Icons.AngleDown>}
                                </div>
                            </div>
                            {
                                open5 && <div className="col rg-2">
                                    <span>The Wobblebug Re-Roll system is an innovative system created by the Wobblebug team to let transformed MegaWob holders switch their NFTs to a fresh new look.</span>
                                    <span>For more information on Re-Roll and transformation, checkout our Wobpaper.</span>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}