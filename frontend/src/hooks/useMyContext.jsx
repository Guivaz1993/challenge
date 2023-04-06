import { useContext } from 'react';

import { MyContext } from '../context/createMyContext';

function useMyContext() {
    return useContext(MyContext);
}

export default useMyContext;