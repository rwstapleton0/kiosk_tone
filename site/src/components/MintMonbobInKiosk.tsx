import { useSignAndExecuteTransactionBlock } from '@mysten/dapp-kit';
import { KioskClient, KioskOwnerCap, Network } from '@mysten/kiosk';
import { Box, Container, Flex, Heading } from "@radix-ui/themes";
import { MonbobFrame } from './MonbobFrame';

interface MintKioskMonbobProps {
    cap: KioskOwnerCap,
    kioskClient: KioskClient
}

export function MintMonbobInKiosk(props: MintKioskMonbobProps) {
    const { mutate: signAndExecuteTransactionBlock } = useSignAndExecuteTransactionBlock();

    let monbobs = []
    for (let i = 1; i < 4; i++) {
        monbobs.push(
            <MonbobFrame
                key={i}
                gene={i}
                cap={props.cap}
                kioskClient={props.kioskClient}
                signAndExecuteTransactionBlock={() => signAndExecuteTransactionBlock}
            />
        )
    }

    return (
        <>
            <Heading>Mint Monbob in Kiosk</Heading>
            <Container pt="4">
                <Flex gap="2" wrap="wrap">
                    {monbobs}
                </Flex>

            </Container>
        </>
    )
}
