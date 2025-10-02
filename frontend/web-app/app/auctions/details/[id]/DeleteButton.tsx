'use client'
import { deleteAuction } from '@/app/actions/auctionActions';
import { Button, Spinner } from 'flowbite-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import toast from 'react-hot-toast';

type Props = {
    id: string
}
export default function DeleteButton({ id }: Props) {
    const [loading, isLoading] = useState(false);
    const router = useRouter();

    function handleDelete() {
        deleteAuction(id)
            .then(res => {
                if (res.error) throw res.error;
                router.push("/")
            })
            .catch(error => {
                toast.error(error.status + " " + error.message)
            })
            .finally(() => { isLoading(false) })
    }
    return (
        <Button outline color="red" onClick={handleDelete}>
            {loading && <Spinner size="sm" className='mr-3'/>}
            Delete Auction
        </Button>
    )
}
