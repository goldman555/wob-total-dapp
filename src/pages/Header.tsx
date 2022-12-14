import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';

import Assets from "./assets";
import '../scss/Header.scss';

export default function Header(props: any) {

    const { title } = props;
    const navigation = useNavigate();


    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div className="header-wrap">
            <div className="header container">
                {/* <div className="container"> */}
                <div className="row cg-1">
                    <img src={Assets.logo_white} className="head-logo"></img>
                    <span className="title">{title}</span>
                </div>
                <div className="row mr-9 cg-1">
                    <WalletMultiButton />
                    <img src={Assets.twitter}></img>
                    <img src={Assets.instagram}></img>
                    <img src={Assets.discord}></img>
                    <Button
                        id="basic-button"
                        aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                        style={{ color: 'white', fontFamily: 'monument' }}
                    >
                        Menu
                    </Button>

                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                        style={{ marginTop: '20px' }}
                    >
                        <MenuItem onClick={() => { navigation('/') }}>HOME</MenuItem>
                        <MenuItem onClick={() => { navigation('/lore') }}>LORE</MenuItem>
                        <MenuItem onClick={() => { navigation('/stake') }}>STAKE</MenuItem>
                        <MenuItem onClick={() => { navigation('/transformer') }}>TRANSFORMER</MenuItem>
                        <MenuItem onClick={() => { navigation('/reroll') }}>REROLL</MenuItem>
                        <MenuItem onClick={() => { navigation('/musicgroup') }}>MUSIC GROUP</MenuItem>
                        <MenuItem onClick={() => { navigation('/team') }}>TEAM</MenuItem>
                        <MenuItem onClick={() => { navigation('/faq') }}>FAQ</MenuItem>
                        <MenuItem onClick={() => { navigation('/about') }}>ABOUT</MenuItem>
                    </Menu>

                </div>
                {/* </div> */}
            </div>
        </div>

    );
}