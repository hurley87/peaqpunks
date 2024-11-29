'use client';
import { MintDialog } from '@/components/MintDialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Text } from '@/components/ui/text';

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen pb-20 gap-16 font-[family-name:var(--font-geist-sans)] w-full max-w-3xl mx-auto">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <p className=" text-center sm:text-left font-[family-name:var(--font-geist-mono)] text-white text-lg">
          {`10,000 unique collectible characters with proof of ownership stored on
          the Ethereum blockchain. The project that inspired the modern
          CryptoArt movement. CryptoPunks are one of the earliest and most
          iconic examples of "Non-Fungible Tokens” minted on Ethereum, and were
          the inspiration for the ERC-721 standard which powers most digital art
          and collectibles on-chain. Since their release on June 23, 2017,
          CryptoPunks have been featured in numerous international publications,
          headlined prestigious international auctions at both Christie’s and
          Sotheby’s, and even entered the permanent collections of important art
          museums such as the ICA Miami, the Centre Pompidou, and the LACMA. For
          more information and updates, check out the CryptoPunks brand hub.`}
        </p>
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <MintDialog />
        </div>
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={`${i}-${_}`}
              className="bg-primary rounded-lg w-44 h-56 shadow-lg z-10"
            ></div>
          ))}
        </div>
        <Accordion id="questions" type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>
              <Text>Is it accessible?</Text>
            </AccordionTrigger>
            <AccordionContent>
              <Text>Yes. It adheres to the WAI-ARIA design pattern.</Text>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>
              <Text>Is it styled?</Text>
            </AccordionTrigger>
            <AccordionContent>
              <Text>
                Yes. It comes with default styles that matches the other
                components&apos; aesthetic.
              </Text>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>
              <Text>Is it animated?</Text>
            </AccordionTrigger>
            <AccordionContent>
              <Text>
                Yes. It&apos;s animated by default, but you can disable it if
                you prefer.
              </Text>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>
              <Text>Is it accessible?</Text>
            </AccordionTrigger>
            <AccordionContent>
              <Text>Yes. It adheres to the WAI-ARIA design pattern.</Text>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-5">
            <AccordionTrigger>
              <Text>Is it styled?</Text>
            </AccordionTrigger>
            <AccordionContent>
              <Text>
                Yes. It comes with default styles that matches the other
                components&apos; aesthetic.
              </Text>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-6">
            <AccordionTrigger>
              <Text>Is it animated?</Text>
            </AccordionTrigger>
            <AccordionContent>
              <Text>
                Yes. It&apos;s animated by default, but you can disable it if
                you prefer.
              </Text>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
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
