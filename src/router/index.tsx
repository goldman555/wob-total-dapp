import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ReRoll from "../pages/ReRoll";
import Welcome from "../pages/Welcome";
import Stake from "../pages/Stake";

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/reroll" element={<ReRoll />} />
                <Route path="/stake" element={<Stake />} />
                <Route path="/" element={<Welcome />} />
            </Routes>
        </BrowserRouter>
    )
}