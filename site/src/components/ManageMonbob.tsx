import { useSignAndExecuteTransactionBlock, useSuiClientQuery } from '@mysten/dapp-kit';
import { KioskClient, KioskOwnerCap } from '@mysten/kiosk';
import { Container, Flex, Heading } from "@radix-ui/themes";
import "../styles.css";
import { mintMonbob, placeMonbonToKiosk, packageId, mintMonbobInKiosk } from '../data';
import { MonbobFrameList } from './MonbobFrame';

interface MintMonbobProps {
    account: any,
    selectedKioskCap: KioskOwnerCap,
    kioskClient: KioskClient,
}

export function MintMonbob(props: MintMonbobProps) {
    const { mutate: signAndExecuteTransactionBlock } = useSignAndExecuteTransactionBlock();

    const { data } = useSuiClientQuery(
        "getOwnedObjects",
        {
            owner: props.account?.address as string,
            filter: {
                MoveModule: {
                    module: "kiosk_tone",
                    package: packageId,
                }
            }
        },
        {
            enabled: !!props.account,
        },
    );

    const onFrameButtonSubmit = (object: any) => placeMonbonToKiosk(
        object.data?.objectId || "",
        props.kioskClient,
        props.selectedKioskCap,
        signAndExecuteTransactionBlock
    )

    return (
        <>
            <Heading>Manage Monbob</Heading>
            <Container py="2">
                <Flex gap="2">
                    {/* unsure if i can recycle this sign and execute func?? need to test */}
                    <button
                        onClick={() => mintMonbob(signAndExecuteTransactionBlock)}>
                        <Heading size="5">Mint Monbob</Heading>
                    </button>
                    <button
                        // disabled={true}
                        onClick={() => mintMonbobInKiosk(props.selectedKioskCap,
                            props.kioskClient, signAndExecuteTransactionBlock)}>
                        <Heading size="5">Mint Monbob In Kiosk</Heading>
                    </button>
                </Flex>
            </Container>

            <Heading size="4">Owned Monbobs - onclick =&gt; Place in selected kiosk</Heading>
            <Container py="2">
                <Flex gap="2" justify="between">
                    {/* {
                        data != undefined
                            ? <MonbobFrameList
                                data={data}
                                onFrameButtonSubmit={onFrameButtonSubmit}
                            />
                            : <></>
                    } */}
                </Flex>
            </Container>
        </>
    )
}
