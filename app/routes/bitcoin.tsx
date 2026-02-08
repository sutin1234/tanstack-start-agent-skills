import BitcoinFeed from "../components/bitcoin-feed";
import type { Route } from "./+types/bitcoin";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Bitcoin Price Feed | Real-time Crypto Tracker" },
        {
            name: "description",
            content:
                "Real-time Bitcoin price tracker with live updates in USD, EUR, and THB currencies.",
        },
    ];
}

export default function Bitcoin() {
    return (
        <main
            style={{
                minHeight: "100vh",
                background: "linear-gradient(180deg, #0f0f1a 0%, #1a1a2e 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "1rem",
            }}
        >
            <BitcoinFeed />
        </main>
    );
}
