import { useEffect } from 'react';
import { KioskClient, KioskOwnerCap, KioskTransaction } from '@mysten/kiosk';
import { TransactionBlock } from '@mysten/sui.js/transactions';

export const packageId = "0x5baa221eb91015d3063e8939fbb12d1f48423ecb0a8f87a54677f1e3beae2d7c";
export const monbobType = `${packageId}::kiosk_tone::Monbob`;

const monbobs = [
    "ipfs://QmazDrW6KQmAseduU3paZYri2Po423werDJxrbcXXcCiYS",
    "ipfs://hQmPoabi8W7Nguow5Ff76ZT9zjRaJNJSJRhHTrFxaCVsYb4",
    "ipfs://QmdLo4FS9oTjajnEaQMYq2T6vhj4kkF2JCLYoLo1gj4Yqa",
]

function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
}

// Retieves all Kiosks and sets state with 'setKiosk'
export function useGetKiosks(account: any | null, kioskClient: KioskClient, setKiosk: Function) {
    useEffect(() =>  {
        if (account == null) {
            return 
        }
        const address = account.address;

        async function getKiosk() { 
            const { kioskOwnerCaps, kioskIds } = await kioskClient.getOwnedKiosks({ address });

            setKiosk({ kioskOwnerCaps, kioskIds })
        }
        getKiosk();
    }, [account])
}

export function useGetKioskItems(id: string, kioskClient: KioskClient, setKioskItems: Function) {
    useEffect(() => {
        if (id == undefined || id == "") {
            return 
        }
        async function getKioskItems() {
            const res = await kioskClient.getKiosk({
                id,
                options: {
                    withKioskFields: true, // this flag also returns the `kiosk` object in the response, which includes the base setup
                    withListingPrices: true, // This flag enables / disables the fetching of the listing prices.
                }
            });
            setKioskItems(res.items);
        }
        getKioskItems();
    }, [id])
}

export interface MintMonbobProps {
    signAndExecuteTransactionBlock: Function
}

export async function mintMonbob(props: MintMonbobProps) {

    const gene = getRandomInt(3);

	const txb = new TransactionBlock();

	txb.moveCall({
		target: `${packageId}::kiosk_tone::mint_monbob_to_sender`,
		arguments: [
            txb.pure(gene),
            txb.pure(monbobs[gene]),
        ],
	});

    await props.signAndExecuteTransactionBlock(
        {
            transactionBlock: txb,
            chain: 'sui:testnet',
        },
        {
            onSuccess: (result: any) => {
                console.log('executed transaction block', result);
                // setDigest(result.digest);
            },
            onerror: (err: any) => {
                console.log(err)
            }
        },
    );
}

// export function useGetMonbob(account: any | null, data: any, setMonbobs: Function) {
//     return useEffect(() => {
//         console.log(data)

//         setMonbobs(data)
//     }, [account])
// }


export async function placeMonbonToKiosk(
    objectId: string,
    kioskClient: KioskClient,
    kioskCap: KioskOwnerCap,
    signAndExecuteTransactionBlock: Function
) {
    const txb = new TransactionBlock();
    const kioskTx = new KioskTransaction({ transactionBlock: txb, kioskClient, cap: kioskCap });
    
    kioskTx
        .place({
            itemType: monbobType,
            item: objectId,
        })
    
    // Always called as our last kioskTx interaction.
    kioskTx.finalize();
    
    await signAndExecuteTransactionBlock(
        {
            transactionBlock: txb,
            chain: 'sui:testnet',
        },
        {
            onSuccess: (result: any) => {
                console.log('executed transaction block', result);
                // setDigest(result.digest);
            },
            onerror: (err: any) => {
                console.log(err)
            }
        },
    );
}

export interface MonbobFrameProps {
    gene: number,
    cap: KioskOwnerCap,
    kioskClient: KioskClient
    signAndExecuteTransactionBlock: Function
}

export async function mintMonbobInKiosk(props: MonbobFrameProps) {

    const kioskClient = props.kioskClient;
    const cap = props.cap;
	const txb = new TransactionBlock();
	const kioskTx = new KioskTransaction({ kioskClient, transactionBlock: txb, cap });

    console.log(cap)

	txb.moveCall({
		target: `${packageId}::kiosk_tone::mint_monbob_to_kiosk`,
		arguments: [
            txb.pure(props.gene),
            txb.pure(monbobs[props.gene - 1]),
            kioskTx.getKiosk(),
            kioskTx.getKioskCap()
        ],
	});
    
    kioskTx.finalize();
 
    await props.signAndExecuteTransactionBlock(
        {
            transactionBlock: txb,
            chain: 'sui:testnet',
        },
        {
            onSuccess: (result: any) => {
                console.log('executed transaction block', result);
                // setDigest(result.digest);
            },
            onerror: (err: any) => {
                console.log(err)
            }
        },
    );
}

// function createKiosk() {
//     if (address == null) {
//         return 
//     }

//     const txb = new TransactionBlock();
//     const kioskTx = new KioskTransaction({ transactionBlock: txb, kioskClient });
    
//     // Calls the creation function.
//     kioskTx.create();
    
//     // Shares the kiosk and transfers the `KioskOwnerCap` to the owner.
//     kioskTx.shareAndTransferCap(address);
    
//     // Always called as our last kioskTx interaction.
//     kioskTx.finalize();

//     signAndExecuteTransactionBlock(
//         {
//             transactionBlock: txb,
//             chain: 'sui:devnet',
//         },
//         {
//             onSuccess: (result) => {
//                 console.log('executed transaction block', result);
//                 // setDigest(result.digest);
//             },
//         },
//     );
// }
