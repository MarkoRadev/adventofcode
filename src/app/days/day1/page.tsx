"use client";

import { useState } from "react";

const Day1 = () => {
	const [input, setInput] = useState<string>("");
  const [list1, setList1] = useState<number[]>([]);
  const [list2, setList2] = useState<number[]>([]);
	const [totalDistance, setTotalDistance] = useState<number>(0);
	const [similarityScore, setSimilarityScore] = useState<number>(0);

	const processNumbers = (input: string): void => {
    const numbers = input
      .trim()
      .split(/\s+/)
      .map(Number);

    const tempList1: number[] = [];
    const tempList2: number[] = [];

    numbers.forEach((num, index) => {
      if (index % 2 === 0) {
        tempList1.push(num);
      } else {
        tempList2.push(num);
      }
    });

    setList1(tempList1.sort((a, b) => a - b));
    setList2(tempList2.sort((a, b) => a - b));
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
		processNumbers(event.target.value);
  };

  const calculateTotalDistance = () => {
    let totalDistanceTemp = 0;

		for (let i = 0; i < list1.length; i++) {
			totalDistanceTemp += Math.abs(list1[i] - list2[i]);
		}

		setTotalDistance(totalDistanceTemp);
  };

	const calculateSimilarityScore = () => {
    let similarityScore = 0;
  
    const frequencyMap = new Map<number, number>();
    for (const num of list2) {
      frequencyMap.set(num, (frequencyMap.get(num) || 0) + 1);
    }
  
    for (const num of list1) {
      const appearance = frequencyMap.get(num) || 0;
      similarityScore += num * appearance;
    }
  
    setSimilarityScore(similarityScore);
  };

	return (
		<div className="flex flex-col justify-center items-center bg-slate-200">
      <h2>Day1</h2>
      <textarea
        rows={10}
        cols={50}
        placeholder="Paste your numbers here (e.g., '58990 83989\n26183 15707')"
        value={input}
        onChange={handleInputChange}
        style={{ marginBottom: "10px", display: "block" }}
      />
      <button className="bg-blue-200" onClick={calculateTotalDistance}>
        Calculate Total Distance
      </button>
			<span>Total distance: {totalDistance}</span>
			<button className="bg-blue-200" onClick={calculateSimilarityScore}>
        Calculate Similarity Score
      </button>
			<span>Similarity score: {similarityScore}</span>
    </div>
	)
};

export default Day1;