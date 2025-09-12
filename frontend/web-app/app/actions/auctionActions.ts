'use server';
import { Auction, PagedResult } from "@/types";

export async function getData(query: string): Promise<PagedResult<Auction>> {
    try {
        const res = await fetch(`http://localhost:5107/api/search${query}`);

        return res.json();
    } catch (error) {
        console.error('Error fetching data:', error);
        return { result: [], pageCount: 0, totalCount: 0 };
    }

}