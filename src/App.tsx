import { useMemo } from "react";
import {
    ConnectionProvider,
    WalletProvider,
} from "@solana/wallet-adapter-react";
import {
    getPhantomWallet,
    getSlopeWallet,
    getSolflareWallet,
    getSolflareWebWallet,
    getSolongWallet,
    getLedgerWallet,
    getSafePalWallet,
} from "@solana/wallet-adapter-wallets";

import {
    WalletModalProvider
} from '@solana/wallet-adapter-react-ui';

import "./App.scss";
import "./scss/Common.scss";
import Router from "./router";
import BlockchainProvider from './provider';
import { ToastProvider } from 'react-toast-notifications'

require('@solana/wallet-adapter-react-ui/styles.css');

const App = () => {
    const endpoint = process.env.REACT_APP_CLUSTER_RPC;

    const wallets = useMemo(
        () => [
            getPhantomWallet(),
            getSlopeWallet(),
            getSolflareWallet(),
            getSolflareWebWallet(),
            getSolongWallet(),
            getLedgerWallet(),
            getSafePalWallet(),
        ],
        []
    );

    return (
        <ConnectionProvider endpoint={endpoint!}>
            <WalletProvider wallets={wallets} autoConnect={true}>
                <WalletModalProvider>
                    <ToastProvider>
                        <BlockchainProvider>
                            <Router />
                        </BlockchainProvider>
                    </ToastProvider>
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};

export default App;
