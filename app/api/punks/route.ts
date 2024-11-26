import { NextResponse } from 'next/server';
import { createPublicClient, http, decodeFunctionData, createWalletClient } from "viem";
import { privateKeyToAccount } from 'viem/accounts';
import { baseSepolia } from 'viem/chains';

const RPC_URL = "https://sepolia.base.org";

const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(RPC_URL),
});

const walletClient = createWalletClient({
  chain: baseSepolia,
  transport: http(RPC_URL),
});

export async function GET() {

    const address = "0x16F5A35647D6F03D5D3da7b35409D65ba03aF3B2";

    const abi = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"uint8","name":"index","type":"uint8"},{"internalType":"bytes","name":"encoding","type":"bytes"},{"internalType":"string","name":"name","type":"string"}],"name":"addAsset","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint64","name":"key1","type":"uint64"},{"internalType":"uint32","name":"value1","type":"uint32"},{"internalType":"uint64","name":"key2","type":"uint64"},{"internalType":"uint32","name":"value2","type":"uint32"},{"internalType":"uint64","name":"key3","type":"uint64"},{"internalType":"uint32","name":"value3","type":"uint32"},{"internalType":"uint64","name":"key4","type":"uint64"},{"internalType":"uint32","name":"value4","type":"uint32"}],"name":"addComposites","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint8","name":"index","type":"uint8"},{"internalType":"bytes","name":"_punks","type":"bytes"}],"name":"addPunks","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint16","name":"index","type":"uint16"}],"name":"punkAttributes","outputs":[{"internalType":"string","name":"text","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint16","name":"index","type":"uint16"}],"name":"punkImage","outputs":[{"internalType":"bytes","name":"","type":"bytes"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint16","name":"index","type":"uint16"}],"name":"punkImageSvg","outputs":[{"internalType":"string","name":"svg","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"sealContract","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes","name":"_palette","type":"bytes"}],"name":"setPalette","outputs":[],"stateMutability":"nonpayable","type":"function"}]

    const ETHERSCAN_API_KEY = process.env.ETHERSCAN_KEY;

    try {
        const punkData = await fetch(`https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${ETHERSCAN_API_KEY}`);
        const data = await punkData.json();
        const transactions = data.result;

        const tx = transactions[265]

        const { functionName, args } = decodeFunctionData({
            abi,
            data: tx.input
        });

        console.log(functionName, args);

        const privateKey = process.env.SERVER_PRIVATE_KEY;
        const account = privateKeyToAccount(privateKey as `0x${string}`);
    
        // Add to allowlist
        const { request }: any = await publicClient.simulateContract({
            account,
            address: '0x52e574FfC47C2f2B9ebb0a6477cb6373F697589D',
            abi,
            functionName,
            args,
        });
    
        await walletClient.writeContract(request);

        return NextResponse.json({ punks: [] }, { status: 200 });
    } catch (error) {
        console.error('Error fetching punks:', error);
        return NextResponse.json(
            { error: 'Failed to fetch punks data' },
            { status: 500 }
        );
    }
}
