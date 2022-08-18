import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './App';
import {Provider} from "react-redux";
import { store } from "./redux/store.ts";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Biliards from "./Component/Biliards";
import Karaoke from "./Component/Karaoke";
import Confirm from "./Component/Confirm";
import Cancel from "./Component/Cancel";
import Success from "./Component/Success";
import Playstation from "./Component/Playstation";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <Provider store={store}>
            <Routes>
                <Route path='/' element={<App />} />
                <Route path='/billiards' element={<Biliards />} />
                <Route path='/karaoke' element={<Karaoke />} />
                <Route path='/playstation' element={<Playstation />} />
                <Route path='/cancel' element={<Cancel />} />
                <Route path='/success' element={<Success />} />
                <Route path='/confirm' element={<Confirm />} />
            </Routes>
        </Provider>
    </BrowserRouter>
);