'use client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { MinusIcon, PlusIcon } from '@radix-ui/react-icons';
import { useState } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { custom } from 'viem';
import { publicClient } from '@/lib/publicClient';
import { baseSepolia } from 'viem/chains';
import { createWalletClient } from 'viem';
import { punksAddress, punksAbi } from '@/lib/PeaqPunks';

const MINT_PRICE = 0.0000111; // ETH
const VALID_CHAIN_ID = '84532';

export function MintDialog() {
  const { user, login } = usePrivy();
  const [quantityToMint, setQuantityToMint] = useState(1);
  const [isMinting, setIsMinting] = useState(false);
  const [isSwitchingNetwork, setIsSwitchingNetwork] = useState(false);
  const { wallets } = useWallets();
  const wallet = wallets[0];
  const chainId = wallet?.chainId?.split(':')[1];
  const address = wallet?.address as `0x${string}`;

  const switchNetwork = async () => {
    setIsSwitchingNetwork(true);
    await wallet?.switchChain(parseInt(VALID_CHAIN_ID));
    setIsSwitchingNetwork(false);
  };

  const mintPeaqPunks = async () => {
    setIsMinting(true);
    console.log('Minting...');

    try {
      const ethereumProvider = (await wallet?.getEthereumProvider()) as any;

      const walletClient = await createWalletClient({
        account: address,
        chain: baseSepolia,
        transport: custom(ethereumProvider),
      });

      const { request }: any = await publicClient.simulateContract({
        address: punksAddress,
        abi: punksAbi,
        functionName: 'mint',
        args: [quantityToMint],
        account: address,
        value: BigInt(Math.floor(MINT_PRICE * quantityToMint * 1e18)),
      });

      const hash = await walletClient.writeContract(request);

      await publicClient.waitForTransactionReceipt({
        hash,
      });

      console.log('Minted', hash);
    } catch (error) {
      console.log('error', error);
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {user ? (
          <Button>Mint now</Button>
        ) : (
          <Button onClick={() => login()}>Connect Wallet</Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            <Text
              variant="mono"
              className="text-center sm:text-left text-white text-2xl"
            >
              Mint your PeaqPunk
            </Text>
          </DialogTitle>
          <DialogDescription>
            <Text
              variant="mono"
              className="text-center sm:text-left text-white py-2"
            >
              The mint price is {MINT_PRICE} ETH. Select the number of PeaqPunks
              you want to mint.
            </Text>
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-center gap-6 max-w-64 mx-auto">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 shrink-0 rounded-full"
              onClick={() => {
                if (quantityToMint !== 1) {
                  setQuantityToMint(quantityToMint - 1);
                }
              }}
            >
              <MinusIcon className="h-4 w-4" />
              <span className="sr-only">Decrease</span>
            </Button>
            <div className="flex-1 text-center">
              <div className="text-4xl font-bold tracking-tighter text-white">
                {quantityToMint}
              </div>
              <div className="text-xs uppercase text-muted-foreground text-white">
                {MINT_PRICE * quantityToMint} ETH
              </div>
            </div>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 shrink-0 rounded-full"
              onClick={() => setQuantityToMint(quantityToMint + 1)}
              disabled={quantityToMint >= 5}
            >
              <PlusIcon className="h-4 w-4" />
              <span className="sr-only">Increase</span>
            </Button>
          </div>
          <>
            {chainId === VALID_CHAIN_ID ? (
              <Button
                className="rounded-full"
                onClick={mintPeaqPunks}
                disabled={isMinting}
              >
                {isMinting ? 'Minting...' : 'Mint'}
              </Button>
            ) : (
              <Button onClick={switchNetwork} disabled={isSwitchingNetwork}>
                {isSwitchingNetwork ? 'Switching...' : 'Switch Network'}
              </Button>
            )}
          </>
        </div>
      </DialogContent>
    </Dialog>
  );
}
