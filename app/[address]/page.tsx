import Link from 'next/link';
import { isAddress } from 'viem';

interface ProfileProps {
  params: { address: string };
}

export default async function ProfilePage({ params }: ProfileProps) {
  const address = params.address as `0x${string}`;

  if (!isAddress(address)) {
    return (
      <div>
        Profile not found. <Link href="/">Go back</Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col gap-4 text-white pt-20">
      hey: {address}
    </div>
  );
}
