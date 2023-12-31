import { useEffect } from 'react';
import { KioskClient, KioskOwnerCap, KioskTransaction } from '@mysten/kiosk';
import { TransactionBlock } from '@mysten/sui.js/transactions';

export const packageId = "0x5baa221eb91015d3063e8939fbb12d1f48423ecb0a8f87a54677f1e3beae2d7c";
export const monbobType = `${packageId}::kiosk_tone::Monbob`;

const monbobs = [
    "QmazDrW6KQmAseduU3paZYri2Po423werDJxrbcXXcCiYS",
    "QmPoabi8W7Nguow5Ff76ZT9zjRaJNJSJRhHTrFxaCVsYb4",
    "QmdLo4FS9oTjajnEaQMYq2T6vhj4kkF2JCLYoLo1gj4Yqa",
    "QmdGFukAX7xcRnBUCS3ZghkoqzNdQSZYLbZ59LBdzuAwAH",
    "QmP6VFcV5LsPGZE36HwyAd8iH5bqDC7qdxz5B73cLdXWMg",
    "QmXrb9zEJsM1noZxhjuRVdxomeU59tJM4CFv7gjkbZ4Niz",
    "QmWCaZSoruxWQr1AvVQLxpxtNAyvV1cXfmsvhXZCKU8gbx",
    "QmbecCVX7uYb7PzMz2sEzLbL354EXu8QcVQzjMoSveEBsx",
    "QmXyk2jkedDf65CsGqLphsBbJuc46wTvmxXobEgsWtkCKb",
    "QmPHZuuob76b5ZaHnU13eYEk9HjT62HmooNoXFsYP3JySs",
    "QmaqpKCyJqR35YwYip1qqvqX3XfYnBnBW2vbBqugMqWXMQ",
    "QmQB3ydvm4UDmTzh9aMbAd5BMyrhadExWJqzNfJySpQC6d",
]

function getRandomInt() {
    return Math.floor(Math.random() * monbobs.length);
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

export function useGetKioskItems(kioskId: string, kioskClient: KioskClient, setKioskItems: Function) {
    useEffect(() => {
        if (kioskId == undefined || kioskId == "") {
            return 
        }
        async function getKioskItems() {
            const res = await kioskClient.getKiosk({
                id: kioskId,
                options: { // should maybe filter for monbobs here?
                    withKioskFields: true, // this flag also returns the `kiosk` object in the response, which includes the base setup
                    withListingPrices: true, // This flag enables / disables the fetching of the listing prices.
                    withObjects: true,
                }
            });
            setKioskItems(res);
        }
        getKioskItems();
    }, [kioskId])
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
            item: objectId,
            itemType: monbobType,
        })
    
    // Always called as our last kioskTx interaction.
    kioskTx.finalize();

    await signAndExecuteTransactionBlock(
        {
            transactionBlock: txb,
            chain: 'sui:testnet',
        },
        {
            onSuccess: (result: { digest: any; }) => {
                console.log('executed transaction block', result);
            },
        },
    );
}

export async function takeMonbonFromKiosk(
    address: string | undefined,
    objectId: string,
    kioskClient: KioskClient,
    kioskCap: KioskOwnerCap,
    signAndExecuteTransactionBlock: Function
) {
    if (address == undefined) {
        return
    }

    /// Assume `kioskClient` and `cap` are supplied to the function as explained in the previous section.
    const txb = new TransactionBlock();
    const kioskTx = new KioskTransaction({ transactionBlock: txb, kioskClient, cap: kioskCap });
    
    // Take item from kiosk.
    const item = kioskTx.take({
        itemId: objectId,
        itemType: monbobType,
    });
    
    // Do something with `item`, like transfer it to someone else.
    // transfer just back to me? looking for the inverse of place?
    txb.transferObjects([item], address);
    
    // Finalize the kiosk Tx.
    kioskTx.finalize();
    
    // Sign and execute transaction block.
    await signAndExecuteTransactionBlock({ transactionBlock: txb });
}

//==== Minting Functions ====//

export async function mintMonbob(signAndExecuteTransactionBlock: Function) {

    const gene = getRandomInt(); // should do this on-chain really.

	const txb = new TransactionBlock();

	txb.moveCall({
		target: `${packageId}::kiosk_tone::mint_monbob_to_sender`,
		arguments: [
            txb.pure(gene),
            txb.pure(monbobs[gene]),
        ],
	});

    await signAndExecuteTransactionBlock(
        {
            transactionBlock: txb,
            chain: 'sui:testnet',
        },
        {
            onSuccess: (result: { digest: any; }) => {
                console.log('executed transaction block', result);
            },
        },
    );

}

// This doesnt work unsure what I've done...
export async function mintMonbobInKiosk(
    cap: KioskOwnerCap,
    kioskClient: KioskClient,
    signAndExecuteTransactionBlock: Function
) {

    const gene = getRandomInt(); // should do this on-chain really.

	const txb = new TransactionBlock();
	const kioskTx = new KioskTransaction({ kioskClient, transactionBlock: txb, cap });

	txb.moveCall({
		target: `${packageId}::kiosk_tone::mint_monbob_to_kiosk`,
		arguments: [
            txb.pure(gene),
            txb.pure(monbobs[gene]),
            kioskTx.getKiosk(),
            kioskTx.getKioskCap()
        ],
	});
    
    kioskTx.finalize();
 
    await signAndExecuteTransactionBlock(
        {
            transactionBlock: txb,
            chain: 'sui:testnet',
        },
        {
            onSuccess: (result: { digest: any; }) => {
                console.log('executed transaction block', result);
            },
        },
    );
}

export function createKiosk(
    isPersonal: boolean,
    address: string | undefined,
    kioskClient: KioskClient,
    signAndExecuteTransactionBlock: Function
) {
    if (address == undefined) {
        return 
    }

    const txb = new TransactionBlock();
    const kioskTx = new KioskTransaction({ transactionBlock: txb, kioskClient });
    
    // Calls the creation function.
    if (isPersonal) {
        kioskTx.createPersonal();
    } else {
        kioskTx.create();
    }
    
    // Shares the kiosk and transfers the `KioskOwnerCap` to the owner.
    kioskTx.shareAndTransferCap(address);
    
    // Always called as our last kioskTx interaction.
    kioskTx.finalize();

    signAndExecuteTransactionBlock({ transactionBlock: txb });
}
