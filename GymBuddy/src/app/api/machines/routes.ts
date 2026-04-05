import { NetworkConfig } from "../../../config/network.config";

export async function GET() {
    const res = await fetch(`http://localhost:${NetworkConfig.API_PORT}/api/machines`);
    const data = await res.json();

    return Response.json(data);
}