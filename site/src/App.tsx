import { ConnectButton } from "@mysten/dapp-kit";
import { useSuiClient, useCurrentAccount } from '@mysten/dapp-kit';
import { KioskClient, Network } from '@mysten/kiosk';
import { Box, Container, Flex, Heading } from "@radix-ui/themes";
import { useState } from 'react';
import './styles.css';

import { useGetKiosks } from "./data"
import { ManageKiosks } from "./components/ManageKiosks";
import { ManageMonbob } from "./components/ManageMonbob";

function App() {
    const client = useSuiClient();
    const account = useCurrentAccount();

    const [kiosks, setKiosks] = useState({ kioskOwnerCaps: [], kioskIds: [] });
    const [selectedKiosk, setSelectedKiosk] = useState<number>();

    const kioskClient = new KioskClient({
        client,
        network: Network.TESTNET,
    });

    useGetKiosks(account, kioskClient, setKiosks);

    return (
        <Container size="4" px="2">
            <Flex
                position="sticky"
                py="2"
                justify="between"
                align="center"
            >
                <Box>
                    <Heading>Kiosk Tone</Heading>
                </Box>
                <Flex align="center">
                    <Container mr="4">
                        <Heading className="hashHeading">{account?.address}</Heading>
                    </Container>
                    <ConnectButton />
                </Flex>
            </Flex>
            <Container py="4">

                <ManageKiosks
                    address={account?.address}
                    kioskIds={kiosks.kioskIds}
                    selectedKiosk={kiosks.kioskIds[selectedKiosk!]}
                    selectedKioskCap={kiosks.kioskOwnerCaps[selectedKiosk!]}
                    setSelectedKiosk={setSelectedKiosk}
                    kioskClient={kioskClient}
                />

                <ManageMonbob
                    account={account}
                    selectedKioskCap={kiosks.kioskOwnerCaps[selectedKiosk!]}
                    kioskClient={kioskClient}
                />

                {/* <MintMonbobInKiosk
                    cap={kiosks.kioskOwnerCaps[selectedKiosk!]}
                    kioskClient={kioskClient}
                /> */}
            </Container>
        </Container>
    );
}

export default App;
