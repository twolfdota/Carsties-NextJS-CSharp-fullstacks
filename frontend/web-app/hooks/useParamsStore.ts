import { create } from "zustand";

type State = {
    pageNumber: number;
    pageSize: number;
    pageCount: number;
    searchTerm: string;
    orderBy: string;
    filterBy: string;
}

type Action = {
    setParams: (params: Partial<State>) => void;
    reset: () => void;
}

const initalState: State = {
    pageNumber: 1,
    pageSize: 4,
    pageCount: 1,
    searchTerm: '',
    orderBy: 'make',
    filterBy: 'live',
};

export const useParamsStore = create<State & Action>((set) => ({
    ...initalState,
    setParams: (params: Partial<State>) => {
        set ((state) => {
            if (params.pageNumber) {
                return { ...state, pageNumber: params.pageNumber };
            } else {
                return { ...state, ...params, pageNumber: 1 };
            }

        })

    },
    reset: () => set(initalState)
}));