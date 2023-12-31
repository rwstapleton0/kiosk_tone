import { useState } from "react";
import { Box, Container, Heading } from "@radix-ui/themes";
import '../styles.css'
import { SuiObjectData, SuiObjectResponse } from "@mysten/sui.js/client";
import { KioskItem } from "@mysten/kiosk";

export interface MonbobFrameProps {
    url: string
    gene: string,
    buttonText: string,
    hoverButtonText: string | undefined,
    onButtonSumbit: Function
}

export function MonbobFrame(props: MonbobFrameProps) {
    const [hovering, setHovering] = useState(props.buttonText)
    // const name = `Monbob${props.gene}` setup display object wrong
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
                <Heading size="8">#{props.gene}</Heading>
                <Box my="2">
                    <img
                        src={props.url}
                        alt={props.gene}
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
    data: SuiObjectData[],
    onFrameButtonSubmit: Function,
    hoverButtonText: string,
}

export function MonbobFrameList(props: MonbobFrameListProps) {
    // let monbobs = props.data.data.map((object: any, i: number) => {
    // let items = typeof props.data == KioskData ? props.data.items : props.data.data;

    let monbobs = props.data.map((object: SuiObjectData, i: number) => {
        return (
            <MonbobFrame
                key={i}
                url={convertIpfsUrl(object.display?.data?.image_url || "")}
                buttonText={object.objectId} // should fix the or situations??
                gene={object.display?.data?.gene || ""}
                onButtonSumbit={() => props.onFrameButtonSubmit(object)}
                hoverButtonText={props.hoverButtonText}
            />
        )
    })

    return (<>{monbobs}</>)
}

export function reduceResponse(objs: SuiObjectResponse[] | KioskItem[]): SuiObjectData[] {
    let list: SuiObjectData[] = []
    objs.forEach(obj => {
        let data = getSuiObjectData(obj)
        if (data != null) {
            list.push(data)
        }
    });
    return list
}

function getSuiObjectData(obj: SuiObjectResponse | KioskItem): SuiObjectData | null {
    if (obj.data && obj.data !== undefined && obj.data !== null) { // a way to check type is correct or unnesseray?
        return obj.data
    }
    return null
}

// should check if the browser supports ifps.
function convertIpfsUrl(ipfsUrl: string): string {
    const ipfsPrefix = 'ipfs://';
    const httpGateway = 'https://ipfs.io/ipfs/';

    if (ipfsUrl.startsWith(ipfsPrefix)) {
        return ipfsUrl.replace(ipfsPrefix, httpGateway);
    }

    return ipfsUrl; // Returns the original URL if it doesn't start with ipfs://
}
