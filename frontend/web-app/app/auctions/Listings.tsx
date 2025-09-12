'use client';

import AuctionCard from "./AuctionCard";
import AppPagination from "../components/AppPagination";
import { getData } from "../actions/auctionActions";
import { use, useEffect, useState } from "react";
import { Auction, PagedResult } from "@/types";
import Filters from "./Filters";
import { useParamsStore } from "@hooks/useParamsStore";
import { useShallow } from "zustand/shallow";
import qs from "query-string";
import EmptyFilter from "../components/EmptyFilter";


export default function Listings() {
    const [data, setData] = useState<PagedResult<Auction>>();
    const params = useParamsStore(useShallow(state => ({
        pageNumber: state.pageNumber,
        pageSize: state.pageSize,
        searchTerm: state.searchTerm,
        orderBy: state.orderBy,
        filterBy: state.filterBy,
    })));

    const setParams = useParamsStore(state => state.setParams);

    function setPageNumber(pageNumber: number) {
        setParams({ pageNumber });
    }

    const url = qs.stringifyUrl({
        url: '',
        query: params,
    }, { skipEmptyString: true });

    useEffect(() => {
        getData(url).then(data => {
            setData(data);
        });
    }, [url]);

    if (!data) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Filters />
            {data.totalCount === 0 ? (<EmptyFilter showReset />) : (
                <>
                    <div className="grid grid-cols-4 gap-6">{data && data.result.map((auction) =>
                        <AuctionCard auction={auction} key={auction.id} />
                    )}</div>
                    <div className="flex justify-center mt-4">
                        <AppPagination pageChanged={setPageNumber} currentPage={params.pageNumber} pageCount={data.pageCount} />
                    </div>
                </>
            )}

        </>
    );
}