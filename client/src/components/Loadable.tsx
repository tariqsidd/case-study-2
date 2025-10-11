import {JSX, Suspense} from 'react';
import Loader from "./Loader.tsx";

// project imports

// ==============================|| LOADABLE - LAZY LOADING ||============================== //

const Loadable = (Component) => (props) =>
    (
        <Suspense fallback={<Loader />  as JSX.Element}>
            <Component {...props} />
        </Suspense>
    );

export default Loadable;
