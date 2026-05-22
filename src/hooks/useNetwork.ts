import { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';

export function useNetwork() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    
    NetInfo.fetch().then((state) => {
      setIsOffline(state.isConnected === false);
    });

    
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOffline(state.isConnected === false);
    });

    return () => unsubscribe();
  }, []);

  return isOffline;
}
