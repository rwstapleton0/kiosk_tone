import { useState } from 'react';
import { Container, Flex, Heading } from "@radix-ui/themes";
import { KioskClient, KioskData, KioskOwnerCap } from '@mysten/kiosk';
import '../styles.css'

import { takeMonbonFromKiosk, useGetKioskItems } from "../data"
import { MonbobFrameList } from './MonbobFrame';
import { useSignAndExecuteTransactionBlock } from '@mysten/dapp-kit';

interface ManageKiosksProps {
    address: string | undefined,
    kioskIds: any,
    selectedKiosk: string,
    selectedKioskCap: KioskOwnerCap,
    setSelectedKiosk: Function,
    kioskClient: KioskClient
}

export function ManageKiosks(props: ManageKiosksProps) {
    
    const { mutate: signAndExecuteTransactionBlock } = useSignAndExecuteTransactionBlock();

    const [kioskItems, setKioskItems] = useState<KioskData>();
    useGetKioskItems(props.selectedKiosk, props.kioskClient, setKioskItems);

    const kiosks = props.kioskIds.map((id: string, i: number) => {
        return (
            <button key={i} onClick={() => props.setSelectedKiosk(i)}>
                <Heading className="hashHeading" size="5">{id}</Heading>
            </button>
        )
    });

    // const items = kioskItems?.items.map((item, i) => {
    //     return <Heading key={i} size="2">{item.objectId}</Heading>
    // })

    
    const onFrameButtonSubmit = (object: any) => takeMonbonFromKiosk(
        props.address,
        object.data?.objectId || "",
        props.kioskClient,
        props.selectedKioskCap,
        signAndExecuteTransactionBlock
    )

    return (
        <>
            <Flex justify="between">
                <Heading>Kiosk Manager</Heading>
                <Flex align="baseline">
                    <Heading size="4" className="hashHeading">Selected kiosk:&nbsp;&nbsp;</Heading>
                    <Heading className="hashHeading">{props.selectedKiosk}</Heading>
                </Flex>
            </Flex>
            <Heading size="4">New Kiosk</Heading>
            <Container py="2">
                <Flex gap="2">
                    <button><Heading size="5">Create Kiosk</Heading></button>
                    <button><Heading size="5">Create Personal Kiosk</Heading></button>
                </Flex>
            </Container>

            <Heading size="4">Owned Kiosks</Heading>
            <Container py="2">
                <Flex gap="2">
                    {kiosks}
                </Flex>
            </Container>

            <Heading size="4">Monbob in kiosk</Heading>
            <Container py="4">
                <Flex gap="2">
                    {
                        kioskItems != undefined
                            ? <MonbobFrameList
                                data={kioskItems}
                                onFrameButtonSubmit={onFrameButtonSubmit}
                            />
                            : <></>
                    }
                </Flex>
            </Container>
        </>
    )
}