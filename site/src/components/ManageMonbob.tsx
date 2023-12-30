import { useState } from "react";
import { useSignAndExecuteTransactionBlock, useSuiClientQuery } from '@mysten/dapp-kit';
import { KioskClient, KioskOwnerCap, Network } from '@mysten/kiosk';
import { Box, Container, Flex, Heading } from "@radix-ui/themes";
import { MonbobFrame } from './MonbobFrame';
import "../styles.css";

import { mintMonbob, placeMonbonToKiosk, packageId } from '../data';

// const packageId = "0xe3b521dbda814a2fd8149956ebfd7fbda048adb58d39f6a91763e990aa86aecb";
const monbobType = `${packageId}::kiosk_tone::Monbob`;

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

    let monbobs = data?.data.map((object, i) => {
        return (
            <button key={i}
                onClick={() => placeMonbonToKiosk(
                    object.data?.objectId || "",
                    props.kioskClient,
                    props.selectedKioskCap,
                    signAndExecuteTransactionBlock
                )}
            >
                <Heading size="5" className="hashHeading">
                    {object.data?.objectId}
                </Heading>
            </button>
        )
    })


    return (
        <>
            <Heading>Manage Monbob</Heading>
            <Container py="2">

                <button onClick={() => mintMonbob({ signAndExecuteTransactionBlock })}><Heading size="5">Mint Monbob</Heading></button>
            </Container>

            <Heading size="4">Owned Monbobs - onclick =&gt; Place in selected kiosk</Heading>
            <Container py="2">
                <Flex gap="2" wrap="wrap">
                    {monbobs}
                </Flex>
            </Container>
        </>
    )
}
