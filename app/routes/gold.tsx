import GoldFeed from "../components/gold-feed";
import type { Route } from "./+types/gold";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "ราคาทองคำวันนี้ | Gold Price Thailand" },
        {
            name: "description",
            content:
                "ราคาทองคำแท่งและทองรูปพรรณวันนี้ อัปเดตล่าสุดจากสมาคมค้าทองคำ",
        },
    ];
}

export default function Gold() {
    return (
        <main
            style={{
                minHeight: "100vh",
                background: "linear-gradient(180deg, #0f0d0a 0%, #1a1510 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "1rem",
            }}
        >
            <GoldFeed />
        </main>
    );
}
