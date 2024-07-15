"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useStore } from "@/store/useStore";
import getData from "@/api/api";

export default function Home() {
  const { searchTerm, setSearchTerm, filteredData, setData } = useStore();
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [originalFilteredData, setOriginalFilteredData] = useState<any[]>([]);
  const [evaluatedResult, setEvaluatedResult] = useState<string | null>(null);

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const { data, isLoading, isError } = useQuery({
    queryFn: async () => await getData(),
    queryKey: ["data"],
  });

  useEffect(() => {
    if (data) {
      setData(data);
      setOriginalFilteredData(data);
    }
  }, [data, setData]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleInputFocus = () => {
    setIsPopoverOpen(true);
  };

  const handleItemClick = (item: any) => {
    if (item.value) {
      setSelectedItems([...selectedItems, item]);
    } else {
      setSelectedItems([...selectedItems, { value: item }]);
    }
    setIsPopoverOpen(false);
    setSearchTerm("");
    setOriginalFilteredData([...originalFilteredData]);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && searchTerm.trim() !== "") {
      const isOperator = /^[+\-*/]$/.test(searchTerm.trim());

      if (isOperator) {
        setSelectedItems([...selectedItems, { value: searchTerm.trim() }]);
        setSearchTerm("");
        setOriginalFilteredData([...originalFilteredData]);
      } else {
        const firstFilteredItem = originalFilteredData.find(
          (item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !selectedItems.some((selectedItem) => selectedItem.id === item.id)
        );
        if (firstFilteredItem) {
          setSelectedItems([...selectedItems, firstFilteredItem]);
          setSearchTerm("");
          setOriginalFilteredData([...originalFilteredData]);
        }
      }
    }
  };

  const dataFilter = originalFilteredData.filter((data) =>
    data.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    try {
      let result = selectedItems.map((item) => item.value).join("");
      const evaluated = eval(result);
      setEvaluatedResult(evaluated.toString());
    } catch (error) {
      console.error("Error evaluating expression:", error);
      setEvaluatedResult("#ERROR");
    }
  }, [selectedItems]);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-1/2 mx-auto p-6 bg-white shadow-md rounded-md flex justify-center">
          Loading...
        </div>
      </div>
    );
  if (isError)
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <div className="w-1/2 mx-auto p-6 bg-black shadow-md rounded-md">
          Sorry, there was an Error!
        </div>
      </div>
    );

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-1/2 mx-auto p-6 bg-white shadow-md rounded-md">
        <input
          type="text"
          placeholder="Search by name or operator and press Enter to select..."
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
        />

        {isPopoverOpen && (
          <div className="absolute mt-2 w-[100px] bg-white border border-gray-300 rounded-md shadow-lg overflow-scroll h-[100px]">
            <ul>
              {dataFilter.map((data: any, index) => (
                <li
                  key={index}
                  className="py-2 px-4 cursor-pointer hover:bg-gray-100 bg-slate-300 w-[100px] rounded-lg shadow-md"
                  onClick={() => handleItemClick(data)}
                >
                  {data.name}
                </li>
              ))}
              <li
                className="py-2 px-4 cursor-pointer hover:bg-gray-100"
                onClick={() => handleItemClick("+")}
              >
                +
              </li>
              <li
                className="py-2 px-4 cursor-pointer hover:bg-gray-100"
                onClick={() => handleItemClick("-")}
              >
                -
              </li>
              <li
                className="py-2 px-4 cursor-pointer hover:bg-gray-100"
                onClick={() => handleItemClick("*")}
              >
                *
              </li>
              <li
                className="py-2 px-4 cursor-pointer hover:bg-gray-100"
                onClick={() => handleItemClick("/")}
              >
                /
              </li>
            </ul>
          </div>
        )}

        {selectedItems.length > 0 && (
          <div className="mt-4 p-2 border border-gray-300 rounded-md">
            <strong>Selected Items:</strong>
            <ul className="flex gap-2">
              {selectedItems.map((item, index) => (
                <li key={index}>{item.value ? item.value : item.name}</li>
              ))}
            </ul>
            <strong>Result:</strong>
            <p>{evaluatedResult}</p>
          </div>
        )}
      </div>
    </div>
  );
}
