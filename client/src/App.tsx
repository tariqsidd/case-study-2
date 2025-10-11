import {JSX, lazy} from "react";
import Layout from './layout';
import Loadable from "./components/Loadable.tsx";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
const Students = Loadable(lazy(() => import('./pages/Students')));
const FindStudent = Loadable(lazy(() => import('./pages/FindStudent')));

function App(): JSX.Element {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Students />} />
                    <Route path="find-student" element={<FindStudent />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
