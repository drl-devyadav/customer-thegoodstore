import { useCallback } from 'react';
import { useRouter } from 'next/router';

const useDiscardForm = () => {
  const router = useRouter();

  const discardForm = useCallback(() => {
    router.back();
  }, [router]);

  return { discardForm };
};

export default useDiscardForm;
