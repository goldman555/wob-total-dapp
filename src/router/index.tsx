import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ReRoll from "../pages/ReRoll";
import Welcome from "../pages/Welcome";
import Stake from "../pages/Stake";
import Transformer from "../pages/Transformer";
import Store from "../pages/Store";
import Lore from '../pages/Lore';
import MusicGroup from "../pages/MusicGroup";
import About from "../pages/About";
import Faq from "../pages/Faq";
import Team from "../pages/Team";

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/reroll" element={<ReRoll />} />
                <Route path="/stake" element={<Stake />} />
                <Route path="/stake/store" element={<Store />} />
                <Route path="/transformer" element={<Transformer />} />
                <Route path="/" element={<Welcome />} />
                <Route path="/lore" element={<Lore />} />
                <Route path="/musicgroup" element={<MusicGroup />} />
                <Route path="/about" element={<About />} />
                <Route path="/faq" element={<Faq />} />
                <Route path="/team" element={<Team />} />
            </Routes>
        </BrowserRouter>
    )
}