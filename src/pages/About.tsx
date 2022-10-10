import Header from "./Header"
import Asset from './assets';
import Footer from "./Footer";

export default function About() {
    return (
        <div className="about">
            <Header title={'WOBBLEBUG'} />
            <div className="container">
                <div className="col f-center mt-9 cg-6">
                    <img className="logo1" src={Asset.logo1}></img>
                    <div className="section-title">
                        <span ></span>
                        <h3 className="f-32">ABOUT</h3>
                        <span ></span>
                    </div>
                    <div className="col f-center w80 mt-5 rg-4 f-18 l-24">
                        <span>What started as a small collection on ETH, Wobblebug has developed into an innovative cross chain collection that has moved to SOL... now geared on innovating tech and music.</span>
                        <span className="w80">Wobblebug has developed into a full on web3 ecosystem consisting of multiple NFTs, $WOB a first of its kind utility token, the $wobmart one of the most smooth shopping experiences in web3, and a first of its kind transformation system allowing holders to switch back and forth between 2 NFT's.</span>
                    </div>

                    <button className="lore-btn m-8">LERAN MORE</button>
                </div>
            </div>
            <Footer />
        </div>
    )
}