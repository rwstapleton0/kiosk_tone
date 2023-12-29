// import { Box, Container, Heading, Flex } from "@radix-ui/themes";
import { useSuiClient, useCurrentAccount, useSignAndExecuteTransactionBlock } from '@mysten/dapp-kit';
import { KioskClient, Network, KioskTransaction } from '@mysten/kiosk';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { useEffect, useState } from 'react';

export function MyMonbobs() {
    const [kiosks, setKiosks] = useState({})

    const { mutate: signAndExecuteTransactionBlock } = useSignAndExecuteTransactionBlock();
    const account = useCurrentAccount();
    const client = useSuiClient();

    const address = account?.address

    console.log(address)

    const kioskClient = new KioskClient({
        client,
        network: Network.TESTNET,
    });
    
    useEffect(() =>  {
        async function getKiosk() { 
            if (address == null) {
                return 
            }

            const ks = await kioskClient.getOwnedKiosks({ address });
            setKiosks(ks)
            // console.log(kioskOwnerCaps + " " + kioskIds);
        }
        getKiosk();
    }, [account])

    useEffect(() => {
        
    }, [kiosks])

    function createKiosk() {
        if (address == null) {
            return 
        }

        const txb = new TransactionBlock();
        const kioskTx = new KioskTransaction({ transactionBlock: txb, kioskClient });
        
        // Calls the creation function.
        kioskTx.create();
        
        // Shares the kiosk and transfers the `KioskOwnerCap` to the owner.
        kioskTx.shareAndTransferCap(address);
        
        // Always called as our last kioskTx interaction.
        kioskTx.finalize();

        signAndExecuteTransactionBlock(
            {
                transactionBlock: txb,
                chain: 'sui:devnet',
            },
            {
                onSuccess: (result) => {
                    console.log('executed transaction block', result);
                    // setDigest(result.digest);
                },
            },
        );
    }

    return (
        <>
            <button onClick={createKiosk}/>
        </>
    )
}