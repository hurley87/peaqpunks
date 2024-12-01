import { useEffect, useState } from 'react';
import { publicClient } from '@/lib/publicClient';
import { punksAbi, punksAddress } from '@/lib/PeaqPunks';

export function usePaused() {
  const [isPaused, setIsPaused] = useState<boolean>(true);

  useEffect(() => {
    const fetchYearlyFee = async () => {
      try {
        const paused = await publicClient.readContract({
          address: punksAddress,
          abi: punksAbi,
          functionName: 'paused',
        });

        if (paused) {
          setIsPaused(true);
        } else {
          setIsPaused(false);
        }
      } catch (error) {
        console.error('Error fetching early mint active:', error);
      }
    };

    fetchYearlyFee();
  }, []);

  return { isPaused, setIsPaused };
}
