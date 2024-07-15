import create from "zustand";

interface AppState {
  searchTerm: string;
  filteredData: any[];
  setSearchTerm: (searchTerm: string) => void;
  setData: (data: any[]) => void;
}

export const useStore = create<AppState>((set) => ({
  searchTerm: "",
  filteredData: [],

  setSearchTerm: (searchTerm: string) =>
    set((state) => ({
      searchTerm,
      filteredData: state.filteredData.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    })),

  setData: (data: any[]) =>
    set((state) => ({
      ...state,
      filteredData: data,
    })),
}));
