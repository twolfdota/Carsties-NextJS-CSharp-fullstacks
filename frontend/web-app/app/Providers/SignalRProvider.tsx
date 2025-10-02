'use client'

import { useAuctionStore } from '@/hooks/useAuctionStore'
import { useBidStore } from '@/hooks/useBidStore'
import { Auction, AuctionFinished, Bid } from '@/types'
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr'
import { useParams } from 'next/navigation'
import React, { ReactNode, useCallback, useEffect, useRef } from 'react'
import AuctionCreatedToast from '../components/AuctionCreatedToast'
import toast from 'react-hot-toast'
import { getDetailedViewData } from '../actions/auctionActions'
import AuctionFinishedToast from '../components/AuctionFinishedToast'

type Props = {
    children: ReactNode;
    user: any | null;
}

export default function SignalRProvider({ children, user }: Props) {
    const connection = useRef<HubConnection | null>(null);
    const setCurrentPrice = useAuctionStore(state => state.setCurrentPrice);
    const addBid = useBidStore(state => state.addBid);
    const params = useParams<{ id: string }>();

    const handleAuctionFinished = useCallback((finishedAuction: AuctionFinished) => {
        const auction = getDetailedViewData(finishedAuction.auctionId);
        toast.promise(auction, {
            loading: 'Loading',
            success: (auction) =>
                <AuctionFinishedToast
                    auction={auction}
                    finishedAuction={finishedAuction}
                />,
            error: (err) => 'Auction finished'
        }, { success: { duration: 10000, icon: null } })
    }, [])

    const handleAuctionCreated = useCallback((auction: Auction) => {
        if (user?.username !== auction.seller) {
            toast(<AuctionCreatedToast auction={auction} />, { duration: 10000 })
        }
    }, [user?.username])

    const handleBidPlaced = useCallback((bid: Bid) => {
        if (bid.bidStatus.includes('Accepted')) {
            setCurrentPrice(bid.auctionId, bid.amount);
        }

        if (params.id === bid.auctionId) {
            addBid(bid);
        }
    }, [setCurrentPrice, addBid, params.id])

    useEffect(() => {
        if (!connection.current) {
            connection.current = new HubConnectionBuilder()
                .withUrl('http://localhost:6001/notifications')
                .configureLogging(LogLevel.Information)
                .withAutomaticReconnect()
                .build();

            connection.current.start()
                .then(() => {
                    console.log('Connected to notifications service');
                })
                .catch(err => console.log(err));

        }

        connection.current.on('BidPlaced', handleBidPlaced);
        connection.current.on('AuctionCreated', handleAuctionCreated);
        connection.current.on('AuctionFinished', handleAuctionFinished);

        return () => {
            connection.current?.off('BidPlaced', handleBidPlaced);
            connection.current?.off('AuctionCreated', handleAuctionCreated);
            connection.current?.off('AuctionFinished', handleAuctionFinished);
        }
    }, [setCurrentPrice, handleBidPlaced, handleAuctionCreated, handleAuctionFinished])

    return (
        children
    )
}
