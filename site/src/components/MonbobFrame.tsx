import { useState } from "react";
import { Box, Container, Heading } from "@radix-ui/themes";
import '../styles.css'
import { PaginatedObjectsResponse } from "@mysten/sui.js/client";
import { KioskData } from "@mysten/kiosk";

export interface MonbobFrameProps {
    url: string
    gene: number,
    buttonText: string,
    hoverButtonText: string | undefined,
    onButtonSumbit: Function
}

export function MonbobFrame(props: MonbobFrameProps) {
    const [hovering, setHovering] = useState(props.buttonText)
    const name = `Monbob${props.gene}`
    return (
        <Box
            style={{
                border: "2px solid #fff",
                borderRadius: '16px',
                background: "#C70039",
                flexShrink: 2
            }}
        >
            <Container p="2">
                <Heading size="8">#{name}</Heading>
                <Box my="2">
                    <img
                        src={props.url}
                        alt={name}
                        style={{
                            padding: "0",
                            width: "252px",
                            border: "2px solid #fff",
                            borderRadius: "var(--radius-4)"
                        }}
                    />
                </Box>
                {
                    props.hoverButtonText != undefined
                        ? <button
                            onClick={() => props.onButtonSumbit()}
                            onMouseEnter={() => setHovering(props.hoverButtonText!)}
                            onMouseLeave={() => setHovering(props.buttonText)}>
                            <Heading
                                style={{ width: "200px" }}
                                className="hashHeading"
                                size="5">{hovering}
                            </Heading>
                        </button>
                        : <button onClick={() => props.onButtonSumbit()}>
                            <Heading
                                style={{ width: "200px" }}
                                className="hashHeading"
                                size="5">{props.buttonText}
                            </Heading>
                        </button>
                }
            </Container>
        </Box>
    )
}

interface MonbobFrameListProps {
    data: KioskData,
    // data: PaginatedObjectsResponse,
    // data: PaginatedObjectsResponse | KioskData,
    onFrameButtonSubmit: Function,
}

export function MonbobFrameList(props: MonbobFrameListProps) {
    // let monbobs = props.data.data.map((object: any, i: number) => {

    let monbobs = props.data.items.map((object: any, i: number) => {
        return (
            <MonbobFrame
                key={i}
                url={convertIpfsUrl(object.data?.display?.data?.image_url)}
                buttonText={object.objectId} // should fix the or situations??
                gene={0}
                onButtonSumbit={() => props.onFrameButtonSubmit(object)}
                hoverButtonText={"Take from Kiosk"}
            />
        )
    })

    return (<>{monbobs}</>)
}

function convertIpfsUrl(ipfsUrl: string): string {
    const ipfsPrefix = 'ipfs://';
    const httpGateway = 'https://ipfs.io/ipfs/';

    if (ipfsUrl.startsWith(ipfsPrefix)) {
        return ipfsUrl.replace(ipfsPrefix, httpGateway);
    }

    return ipfsUrl; // Returns the original URL if it doesn't start with ipfs://
}
