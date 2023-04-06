import { useState } from 'react';

function useUserProvider() {
  const [base, setBase] = useState(false);

  return {
    base,
    setBase,
  };
}

export default useUserProvider;
