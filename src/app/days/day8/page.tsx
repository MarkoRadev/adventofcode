"use client";

import { useState, useEffect } from "react";

const Day8 = () => {
  const [data, setData] = useState<string>("");
  const [antinodeCount, setAntinodeCount] = useState<number>(0);

  const fetchData = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/day8/day8.txt`
    );
    const fileContent = await response.text();
    setData(fileContent);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (data) {
      calculateAntinodes(data);
    }
  }, [data]);

  const calculateAntinodes = (input: string) => {
    const lines = input.split("\n").filter((line) => line.trim() !== "");
    const map = lines.map((line) => line.split(""));
    const rows = map.length;
    const cols = map[0].length;

    const antennas: { char: string; x: number; y: number }[] = [];

    // Collect all antenna locations
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const char = map[y][x];
        if (char !== ".") {
          antennas.push({ char, x, y });
        }
      }
    }

    const antinodePositions = new Set<string>();

    // Calculate all unique positions in line with at least two antennas of the same frequency
    for (let i = 0; i < antennas.length; i++) {
      for (let j = 0; j < antennas.length; j++) {
        if (i === j) continue;

        const a = antennas[i];
        const b = antennas[j];

        if (a.char === b.char) {
          const dx = b.x - a.x;
          const dy = b.y - a.y;

          const gcd = Math.abs(getGCD(dx, dy));
          const stepX = dx / gcd;
          const stepY = dy / gcd;

          // Extend lines indefinitely within the grid bounds
          let k = 0;
          while (true) {
            const antinodeX = a.x + k * stepX;
            const antinodeY = a.y + k * stepY;
            if (!isValid(antinodeX, antinodeY, rows, cols)) break;
            antinodePositions.add(`${antinodeX},${antinodeY}`);
            k++;
          }

          k = -1;
          while (true) {
            const antinodeX = a.x + k * stepX;
            const antinodeY = a.y + k * stepY;
            if (!isValid(antinodeX, antinodeY, rows, cols)) break;
            antinodePositions.add(`${antinodeX},${antinodeY}`);
            k--;
          }
        }
      }
    }

    // Include each antenna position if it aligns with at least one other antenna of the same frequency
    const antennaFrequencies = new Map<string, number>();
    antennas.forEach(({ char }) => {
      antennaFrequencies.set(char, (antennaFrequencies.get(char) || 0) + 1);
    });

    antennas.forEach(({ char, x, y }) => {
      if (antennaFrequencies.get(char)! > 1) {
        antinodePositions.add(`${x},${y}`);
      }
    });

    setAntinodeCount(antinodePositions.size);
  };

  const getGCD = (a: number, b: number): number => {
    return b === 0 ? Math.abs(a) : getGCD(b, a % b);
  };

  const isValid = (x: number, y: number, rows: number, cols: number) => {
    return x >= 0 && x < cols && y >= 0 && y < rows;
  };

  return (
    <div className='flex flex-col items-center mt-10 gap-4'>
      <h1>Day 8: Resonant Collinearity</h1>
      <p>Unique Antinode Locations: {antinodeCount}</p>
    </div>
  );
};

export default Day8;
