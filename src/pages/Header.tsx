import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

import Assets from "./assets";
import '../scss/Header.scss';

export default function Header(props: any) {

    const { title } = props;
    const navigation = useNavigate();

    return (
        <div className="header-wrap">
            <div className="header">
                <div className="row cg-1">
                    <img src={Assets.logo_white} onClick={() => { }}></img>
                    <span className="title">{title}</span>

                </div>
                <div className="row cg-2">
                    <div className="menu">
                        <div className="row cg-2">
                            <span className="menu-item" onClick={() => { navigation('/') }}>Home</span>
                            <span className="menu-item" onClick={() => { navigation('/stake') }}>Stake</span>
                            <span className="menu-item" onClick={() => { navigation('/reroll') }}>Re-Roll</span>
                            <span className="menu-item" onClick={() => { navigation('/transformer') }}>Transform</span>
                        </div>
                    </div>
                    <WalletMultiButton />
                </div>
            </div>
            <div className="menu-reverse">
                <div className="col rg-1 f-center">
                    <span onClick={() => { navigation('/') }}>Home</span>
                    <span onClick={() => { navigation('/stake') }}>Stake</span>
                    <span onClick={() => { navigation('/reroll') }}>ReRoll</span>
                    <span onClick={() => { navigation('/transformer') }}>Transformer</span>
                </div>
            </div>
        </div>
    );
}