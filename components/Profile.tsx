'use client';
import { useOwnedTokens } from '@/hooks/useOwnedTokens';
import { usePrivy } from '@privy-io/react-auth';
import { Text } from './ui/text';
import Token from './Token';

const Profile = () => {
  const { user } = usePrivy();
  const address = user?.wallet?.address as `0x${string}`;
  const { ownedTokens, loading } = useOwnedTokens({ address });

  console.log('ownedTokens', ownedTokens);

  if (loading)
    return (
      <div className="flex justify-center max-w-lg mx-auto pt-20">
        <Text>Loading...</Text>
      </div>
    );

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col gap-4 py-20 text-white">
      {ownedTokens.length > 0 ? (
        <Text>You own {ownedTokens.length} PeaqPunks</Text>
      ) : (
        <Text>You don't own any PeaqPunks</Text>
      )}
      <div className="flex flex-wrap gap-4">
        {ownedTokens.map((tokenId) => (
          <Token key={tokenId} tokenId={tokenId} />
        ))}
      </div>
    </div>
  );
};

export default Profile;
