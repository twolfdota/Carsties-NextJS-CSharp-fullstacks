'use client';

import {Auction} from "@/types";
import {Table, TableBody, TableRow, TableCell} from "flowbite-react";

type Props = {
    auction: Auction
}
export default function DetailedSpecs({auction}: Props) {
    return (
        <Table striped={true}>
            <TableBody className="divide-y">
                <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        Seller
                    </TableCell>
                    <TableCell>
                        {auction.seller}
                    </TableCell>
                </TableRow>
                <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        Make
                    </TableCell>
                    <TableCell>
                        {auction.make}
                    </TableCell>
                </TableRow>
                <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        Model
                    </TableCell>
                    <TableCell>
                        {auction.model}
                    </TableCell>
                </TableRow>
                <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        Year manufactured
                    </TableCell>
                    <TableCell>
                        {auction.year}
                    </TableCell>
                </TableRow>
                <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        Mileage
                    </TableCell>
                    <TableCell>
                        {auction.mileage}
                    </TableCell>
                </TableRow>
                <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        Has reserve price?
                    </TableCell>
                    <TableCell>
                        {auction.reservePrice > 0 ? 'Yes' : 'No'}
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>
    );
}