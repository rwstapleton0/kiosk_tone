import { useState } from "react";
import { useSignAndExecuteTransactionBlock, useSuiClientQuery } from '@mysten/dapp-kit';
import { KioskClient, KioskOwnerCap, Network } from '@mysten/kiosk';
import { Box, Container, Flex, Heading } from "@radix-ui/themes";
import { MonbobFrame } from './MonbobFrame';
import "../styles.css";

import { mintMonbob, placeMonbonToKiosk } from '../data';

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
