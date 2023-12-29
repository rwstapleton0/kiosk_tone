import { Box, Container, Heading, Flex } from "@radix-ui/themes";
import { useSuiClient } from '@mysten/dapp-kit';
import { KioskClient, KioskOwnerCap, Network } from '@mysten/kiosk';
import '../styles.css'


export interface MonbobFrameProps {
    gene: number,
    cap: KioskOwnerCap,
    kioskClient: KioskClient
    signAndExecuteTransactionBlock: Function
}

export function MonbobFrame(props: MonbobFrameProps) {
    const name = `monbob${props.gene}`
    return (
        <Box
            style={{
                border: "2px solid #fff",
                borderRadius: '16px',
                background: "#C70039",
                flexShrink: 2
            }}
        >
            <Container
                p="4">
                <Heading size="8">#{name}</Heading>
                <Box mt="2">
                    <img
                        src={getImageUrl(name)}
                        alt={name}
                        style={{
                            padding: "0",
                            width: "220px",
                            border: "2px solid #fff",
                            borderRadius: "var(--radius-4)"
                        }}
                    />
                </Box>
            </Container>
            <button
                onClick={() => mintKioskMonbob(props)}
                className="monbobFrameButton"
            ><Heading>Mint Monbob</Heading></button>
        </Box>
    )
}

function getImageUrl(name: String) {
    return new URL(`../assets/${name}.png`, import.meta.url).href
}
