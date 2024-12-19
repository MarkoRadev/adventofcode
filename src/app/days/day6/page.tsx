"use client";

import { useEffect, useState } from 'react';

type Position = { x: number; y: number };

type Direction = 'up' | 'right' | 'down' | 'left';

const Day6: React.FC = () => {
  const [visitedPositions, setVisitedPositions] = useState<Set<string>>(new Set());
  const [possibleObstructionPositions, setPossibleObstructionPositions] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/day6.txt`);
      const fileContent = await response.text();
      countVisitedPositions(fileContent);
      countPossibleObstructionPositions(fileContent);
    };
    
    fetchData();
  }, []);
  
  const countVisitedPositions = (fileContent: string) => {
    const map: string[][] = fileContent.split('\n').map(line => line.split(''));
    const directions: Direction[] = ['up', 'right', 'down', 'left'];
    let currentDirectionIndex = 0; // Start facing up
    let currentPosition: Position = { x: 0, y: 0 };
    
    // Locate the starting position
    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[y].length; x++) {
        if ('^>v<'.includes(map[y][x])) {
          currentPosition = { x, y };
          currentDirectionIndex = '^>v<'.indexOf(map[y][x]);
          break;
        }
      }
      if (currentPosition.x !== 0 || currentPosition.y !== 0) break;
    }
    
    const visited = new Set<string>();
    const height = map.length;
    const width = map[0].length;
    
    const moveForward = (position: Position, direction: Direction): Position => {
      switch (direction) {
        case 'up': return { x: position.x, y: position.y - 1 };
        case 'down': return { x: position.x, y: position.y + 1 };
        case 'left': return { x: position.x - 1, y: position.y };
        case 'right': return { x: position.x + 1, y: position.y };
        default: return position;
      }
    };
    
    const isWithinBounds = (position: Position): boolean => {
      return position.x >= 0 && position.x < width && position.y >= 0 && position.y < height;
    };
    
    while (true) {
      const currentPosKey = `${currentPosition.x},${currentPosition.y}`;
      visited.add(currentPosKey);
      
      const nextPosition = moveForward(currentPosition, directions[currentDirectionIndex]);
      
      if (!isWithinBounds(nextPosition)) {
        break; // End of patrol, guard is out of the map
      }
    
      if (map[nextPosition.y][nextPosition.x] === '#') {
        // Turn right (90 degrees clockwise)
        currentDirectionIndex = (currentDirectionIndex + 1) % 4;
      } else {
        // Move forward
        currentPosition = nextPosition;
      }
    }
    
    setVisitedPositions(visited);
  };

  const countPossibleObstructionPositions = (fileContent: string) => {
    const map: string[][] = fileContent.split('\n').map(line => line.split(''));
    const directions: Direction[] = ['up', 'right', 'down', 'left'];
    let currentDirectionIndex = 0; // Start facing up
    let currentPosition: Position = { x: 0, y: 0 };
    
    // Locate the starting position
    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[y].length; x++) {
        if ('^>v<'.includes(map[y][x])) {
          currentPosition = { x, y };
          currentDirectionIndex = '^>v<'.indexOf(map[y][x]);
          break;
        }
      }
      if (currentPosition.x !== 0 || currentPosition.y !== 0) break;
    }
    
    const startPositionKey = `${currentPosition.x},${currentPosition.y}`;
    let possiblePositions = 0;
    const height = map.length;
    const width = map[0].length;
    
    const moveForward = (position: Position, direction: Direction): Position => {
      switch (direction) {
        case 'up': return { x: position.x, y: position.y - 1 };
        case 'down': return { x: position.x, y: position.y + 1 };
        case 'left': return { x: position.x - 1, y: position.y };
        case 'right': return { x: position.x + 1, y: position.y };
        default: return position;
      }
    };
    
    const isWithinBounds = (position: Position): boolean => {
      return position.x >= 0 && position.x < width && position.y >= 0 && position.y < height;
    };
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const positionKey = `${x},${y}`;
        if (map[y][x] === '.' && positionKey !== startPositionKey) {
          const updatedMap = map.map(row => [...row]);
          updatedMap[y][x] = '#';

          let currentLoopDirectionIndex = currentDirectionIndex;
          let currentLoopPosition: Position = { ...currentPosition };
          const loopVisited = new Set<string>();

          while (true) {
            const currentLoopPosKey = `${currentLoopPosition.x},${currentLoopPosition.y},${currentLoopDirectionIndex}`;
            if (loopVisited.has(currentLoopPosKey)) {
              possiblePositions++;
              break;
            }
            loopVisited.add(currentLoopPosKey);

            const nextLoopPosition = moveForward(currentLoopPosition, directions[currentLoopDirectionIndex]);
            if (!isWithinBounds(nextLoopPosition)) break;
            
            if (updatedMap[nextLoopPosition.y][nextLoopPosition.x] === '#') {
              currentLoopDirectionIndex = (currentLoopDirectionIndex + 1) % 4;
            } else {
              currentLoopPosition = nextLoopPosition;
            }
          }
        }
      }
    }
    
    setPossibleObstructionPositions(possiblePositions);
  };
  
  return (
    <div className='flex flex-col items-center mt-10 gap-4'>
      <h1>Day 6: Guard Gallivant</h1>
      <p>Number of distinct positions visited: {visitedPositions.size}</p>
      <p>Possible obstruction positions to get the guard stuck in a loop: {possibleObstructionPositions}</p>
    </div>
  );
};

export default Day6;
