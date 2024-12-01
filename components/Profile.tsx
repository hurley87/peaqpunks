'use client';
import { usePrivy } from '@privy-io/react-auth';

const Profile = () => {
  const { user, login, ready, logout } = usePrivy();
  const address = user?.wallet?.address as `0x${string}`;

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col gap-4 pt-20 text-white">
      hey
    </div>
  );
};

export default Profile;
