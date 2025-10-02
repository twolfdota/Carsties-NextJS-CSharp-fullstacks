'use server';

import { auth } from "@/auth";
import { fetchWrapper } from "@/lib/fetchWrapper";
import { Auction, Bid, PagedResult } from "@/types";
import { FieldValues } from "react-hook-form";

export async function getData(query: string): Promise<PagedResult<Auction>> {
    return fetchWrapper.get(`search${query}`);

}

export async function getDetailedViewData(id: string): Promise<Auction> {
    return fetchWrapper.get(`auctions/${id}`);
}

export async function createAuction(data: FieldValues) {
    return fetchWrapper.post("auctions", data);
}

export async function updateAuctionTest(): Promise<{ status: number, message: string }> {
    const data = {
        mileage: Math.floor(Math.random() * 10000) + 1
    }

    return fetchWrapper.put("auctions/6a5011a1-fe1f-47df-9a32-b5346b289391", data);
}

export async function updateAuctionTest2() {
    const data = {
        mileage: Math.floor(Math.random() * 10000) + 1
    }
    const session = await auth();
    const headers = {
        'Content-type': 'application/json',
        'Authorization': 'Bearer ' + session?.accessToken
    }
    const res = await fetch('http://localhost:6001/auctions/6a5011a1-fe1f-47df-9a32-b5346b289391', {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify(data)
    });
    console.log(headers);
    if (!res.ok) return { status: res.status, message: res.statusText }
    return { status: res.status, message: res.statusText }
}

export async function updateAuction(data: FieldValues, id: string) {
    return fetchWrapper.put(`auctions/${id}`, data);
}

export async function deleteAuction(id: string) {
    return fetchWrapper.del(`auctions/${id}`);
}

export async function getBidsForAuction(id: string): Promise<Bid[]> {
    return fetchWrapper.get(`bids/${id}`)
}

export async function placeBidForAution(auctionId: string, amount: number) {
    return fetchWrapper.post(`bids?auctionId=${auctionId}&amount=${amount}`, {})
}