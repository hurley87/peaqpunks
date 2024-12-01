import { useEffect, useState } from 'react';
import { publicClient } from '@/lib/publicClient';
import { punksAbi, punksAddress } from '@/lib/PeaqPunks';

export function useOwnedTokens({ address }: { address: `0x${string}` }) {
  const [ownedTokens, setOwnedTokens] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOwnedTokens = async () => {
      setLoading(true);
      try {
        const totalMinted = await publicClient.readContract({
          address: punksAddress,
          abi: punksAbi,
          functionName: 'totalMinted',
        });

        const ownedTokenIds: number[] = [];
        // Iterate through all tokens from 0 to totalMinted-1
        for (let tokenId = 0; tokenId < Number(totalMinted); tokenId++) {
          const owner = (await publicClient.readContract({
            address: punksAddress,
            abi: punksAbi,
            functionName: 'ownerOf',
            args: [BigInt(tokenId)],
          })) as `0x${string}`;

          console.log('owner', owner);

          if (owner.toLowerCase() === address.toLowerCase()) {
            ownedTokenIds.push(tokenId);
            console.log('ownedTokenIds', ownedTokenIds);
          }
        }

        setOwnedTokens(ownedTokenIds);
      } catch (error) {
        console.error('Error fetching owned tokens:', error);
        setOwnedTokens([]);
      } finally {
        setLoading(false);
      }
    };

    if (address) fetchOwnedTokens();
  }, [address]);

  return { ownedTokens, loading };
}
