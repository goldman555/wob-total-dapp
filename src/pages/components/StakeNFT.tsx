import React, { useEffect, useState } from "react";
import { Line } from 'rc-progress';
// import '../../scss/NFT.scss';
import { useNavigate } from "react-router-dom";


const StakeNFT = (props: any) => {
    const { id, imgSrc, nft, onClicks } = props;
    const [name, setName] = useState('');

    useEffect(() => {
        let name = nft.name;
        setName(name.split('#')[1]);
    })

    const checkStake = (day: any) => {
        if (day < 60 && day >= 30)
            return <div className="t1">{day - 30} days in Bronze Nest</div>;
        else if (day < 90 && day >= 60)
            return <div className="t1">{day - 60} days in Silver Nest</div>;
        else if (day >= 90)
            return <div className="t1">{day - 90} days in Gold Nest</div>;
        else
            return <div className="t1">{day} days in Nest</div>;
    }

    const checkPercent = (day: any) => {
        if (day < 60 && day >= 30)
            return (day - 30) * 100 / 30;
        else if (day < 90 && day >= 60)
            return (day - 60) * 100 / 30;
        else if (day >= 90)
            return (day - 90) * 100 / 30;
        else
            return (day) * 100 / 30;
    }

    return (
        <div className="nft-container">
            <img src={imgSrc} />
            <div className="p-05">
                <div className="row between">
                    <div>#{name}</div>
                    <div>{nft.daysPassed} days</div>
                </div>
                <div className="nft-col">
                    {checkStake(nft.daysPassed)}
                    <Line percent={checkPercent(nft.daysPassed)} strokeWidth={4} strokeColor="#D3D3D3" />
                    {/* <div className="t2">Gold Nest in 62 days</div> */}
                </div>
                <div>
                    <button className="select" onClick={onClicks[0]}>Select</button>
                </div>
            </div>
        </div>
    )
}

export default StakeNFT