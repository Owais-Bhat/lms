import { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';

export function useNetwork() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // Check current state immediately
    NetInfo.fetch().then((state) => {
      setIsOffline(state.isConnected === false);
    });

    // Subscribe to network state changes
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOffline(state.isConnected === false);
    });

    return () => unsubscribe();
  }, []);

  return isOffline;
}
