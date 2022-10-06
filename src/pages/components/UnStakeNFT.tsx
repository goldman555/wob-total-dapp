import React from "react";
import { Line } from 'rc-progress';
// import '../../scss/NFT.scss';
import { useNavigate } from "react-router-dom";


const UnStakeNFT = (props: any) => {
    const { id, imgSrc, onClicks } = props;

    return (
        <div className="nft-container">
            <img src={imgSrc} />
            <div className="p-05">
                <div className="wob-row-between">
                </div>
                <div>
                    <button className="select" onClick={onClicks[0]}>Select</button>
                </div>
            </div>
        </div>
    )
}

export default UnStakeNFT