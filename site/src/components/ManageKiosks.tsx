import { useState } from 'react';
import { Container, Flex, Heading } from "@radix-ui/themes";
import { KioskClient } from '@mysten/kiosk';
import '../styles.css'

import { useGetKioskItems } from "../data"

interface ManageKiosksProps {
    kioskIds: any,
    selectedKiosk: string,
    setSelectedKiosk: Function,
    kioskClient: KioskClient
}

export function ManageKiosks(props: ManageKiosksProps) {
    const [kioskItems, setKioskItems] = useState([{objectId: "" }]);
    useGetKioskItems(props.selectedKiosk, props.kioskClient, setKioskItems);

    const kiosks = props.kioskIds.map((id: string, i: number) => {
        return (
            <button key={i} onClick={() => props.setSelectedKiosk(i)}>
                <Heading className="hashHeading" size="5">{id}</Heading>
            </button>
        )
    });

    const items = kioskItems.map((item, i) => {
        return <Heading key={i} size="2">{item.objectId}</Heading>
    })

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
                    {items}
                </Flex>
            </Container>
        </>
    )
}