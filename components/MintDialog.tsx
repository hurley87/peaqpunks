'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export function MintDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          Mint now
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Mint your CryptoPunk</DialogTitle>
          <DialogDescription>
            Mint your unique CryptoPunk NFT. Each punk is randomly generated and unique.
            The minting price is 0.08 ETH + gas fees.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            By minting a CryptoPunk, you agree to our terms of service and confirm that
            you have enough ETH in your wallet to complete the transaction.
          </p>
          <Button 
            className="rounded-full"
            onClick={() => {
              // Add minting logic here
              console.log("Minting...")
            }}
          >
            Mint for 0.08 ETH
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 