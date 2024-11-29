'use client';
import Link from 'next/link';
import { usePrivy } from '@privy-io/react-auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import { Text } from './ui/text';
const Header = () => {
  const { user, login, ready, logout } = usePrivy();
  const address = user?.wallet?.address as `0x${string}`;
  ``;
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="max-w-3xl mx-auto py-4 sm:py-6 lg:py-8 bg-[#2f1d74]">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="text-3xl font-bold font-[family-name:var(--font-geist-sans)] text-white"
            >
              PeaqPunks
            </Link>
          </div>
          {!ready ? null : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="ghost">
                  {address.slice(0, 6)}...{address.slice(-4)}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {/* <DropdownMenuItem asChild>
                  <Link className="cursor-pointer" href={`/profile/${address}`}>
                    Profile
                  </Link>
                </DropdownMenuItem> */}
                <DropdownMenuItem className="cursor-pointer" onSelect={logout}>
                  Disconnect
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" onClick={login}>
              <Text variant="mono">Connect</Text>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
