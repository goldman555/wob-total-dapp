import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ReRoll from "../pages/ReRoll";
import Welcome from "../pages/Welcome";
import Stake from "../pages/Stake";
import Transformer from "../pages/Transformer";
import Store from "../pages/Store";

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/reroll" element={<ReRoll />} />
                <Route path="/stake" element={<Stake />} />
                <Route path="/stake/store" element={<Store />} />
                <Route path="/transformer" element={<Transformer />} />
                <Route path="/" element={<Welcome />} />
            </Routes>
        </BrowserRouter>
    )
}