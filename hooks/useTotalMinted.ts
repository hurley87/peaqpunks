import { useEffect, useState } from 'react';
import { publicClient } from '@/lib/publicClient';
import { punksAbi, punksAddress } from '@/lib/PeaqPunks';

export function useTotalMinted() {
  const [totalMinted, setTotalMinted] = useState<number>(0);

  useEffect(() => {
    const fetchTotalMinted = async () => {
      try {
        const total = await publicClient.readContract({
          address: punksAddress,
          abi: punksAbi,
          functionName: 'totalMinted',
        });

        if (total) {
          setTotalMinted(Number(total));
        }
      } catch (error) {
        console.error('Error fetching total minted:', error);
      }
    };

    fetchTotalMinted();
  }, []);

  return { totalMinted };
}
