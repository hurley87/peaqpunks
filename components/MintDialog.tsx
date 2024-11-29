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

export function MintDialog() {
  const [quantityToMint, setQuantityToMint] = useState(1);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Mint now</Button>
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
              The mint price is 0.000111 ETH. Select the number of PeaqPunks you
              want to mint.
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
                {0.000111 * quantityToMint} ETH
              </div>
            </div>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 shrink-0 rounded-full"
              onClick={() => setQuantityToMint(quantityToMint + 1)}
              disabled={quantityToMint >= 400}
            >
              <PlusIcon className="h-4 w-4" />
              <span className="sr-only">Increase</span>
            </Button>
          </div>
          <Button
            className="rounded-full"
            onClick={() => {
              // Add minting logic here
              console.log('Minting...');
            }}
          >
            Mint
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
