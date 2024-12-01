'use client';
import { usePrivy } from '@privy-io/react-auth';

const Profile = () => {
  const { user } = usePrivy();
  const address = user?.wallet?.address as `0x${string}`;

  console.log('address', address);

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col gap-4 pt-20 text-white">
      hey
    </div>
  );
};

export default Profile;
