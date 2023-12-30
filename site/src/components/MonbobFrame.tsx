import { Box, Container, Heading } from "@radix-ui/themes";
import '../styles.css'

export interface MonbobFrameProps {
    url: string
    gene: number,
    buttonText: string,
    onButtonSumbit: Function,
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
                        src={props.url}
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
                onClick={() => props.onButtonSumbit}
                className="monbobFrameButton"
            ><Heading>{props.buttonText}</Heading></button>
        </Box>
    )
}
