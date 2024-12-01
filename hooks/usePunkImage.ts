import { useEffect, useState } from 'react';
import { publicClient } from '@/lib/publicClient';
import { punksDataAbi, punksDataAddress } from '@/lib/PunksData';

export function usePunkImage(tokenId: number) {
  const [punkImage, setPunkImage] = useState<string>('');

  useEffect(() => {
    const fetchPunkImage = async () => {
      try {
        const punkImage = await publicClient.readContract({
          address: punksDataAddress,
          abi: punksDataAbi,
          functionName: 'punkImageSvg',
          args: [BigInt(tokenId)],
        });

        setPunkImage(punkImage as string);
      } catch (error) {
        console.error('Error fetching punkImage:', error);
      }
    };

    fetchPunkImage();
  }, [tokenId]);

  return punkImage;
}
