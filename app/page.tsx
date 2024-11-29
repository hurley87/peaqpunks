import { MintDialog } from '@/components/MintDialog';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen pb-20 gap-16 font-[family-name:var(--font-geist-sans)] w-full max-w-3xl mx-auto">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Text variant="mono" className="text-center sm:text-left">
          {`10,000 unique collectible characters with proof of ownership stored on
          the Ethereum blockchain. The project that inspired the modern
          CryptoArt movement. CryptoPunks are one of the earliest and most
          iconic examples of "Non-Fungible Tokens" minted on Ethereum, and were
          the inspiration for the ERC-721 standard which powers most digital art
          and collectibles on-chain. Since their release on June 23, 2017,
          CryptoPunks have been featured in numerous international publications,
          headlined prestigious international auctions at both Christie's and
          Sotheby's, and even entered the permanent collections of important art
          museums such as the ICA Miami, the Centre Pompidou, and the LACMA. For
          more information and updates, check out the CryptoPunks brand hub.`}
        </Text>
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <MintDialog />
          <Button variant="outline">Learn more</Button>
        </div>
        <Text variant="mono" className="text-center sm:text-left">
          {`CryptoPunks are 10,000 uniquely generated characters. No two are
          exactly alike, and each one can be trustlessly collected by anyone
          interacting with the Ethereum blockchain. Originally, Punks could be
          claimed for free using any Ethereum wallet with enough $ETH to cover
          gas fees. Now, they can be purchased from their present owners using
          the bespoke CryptoPunks marketplace, which is also embedded in the
          blockchain. Via this frictionless market you can buy, bid on, and
          offer Punks for sale. Below, you'll find information about the
          availability of each Punk. Punks with a blue background are not for
          sale and have no current bids. Punks with a red background are
          available for sale by their owner. Finally, Punks with a purple
          background have an active bid on them.`}
        </Text>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-white"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          PeaqPunks on X →
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-white"
          href="https://www.peaq.network"
          target="_blank"
          rel="noopener noreferrer"
        >
          Peaq Network →
        </a>
      </footer>
    </div>
  );
}
