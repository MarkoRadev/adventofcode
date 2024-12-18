type Direction = [dx: number, dy: number];

const directions: Direction[] = [
  [0, 1],   // Right
  [1, 0],   // Down
  [1, 1],   // Diagonal Down-Right
  [1, -1],  // Diagonal Down-Left
  [0, -1],  // Left
  [-1, 0],  // Up
  [-1, -1], // Diagonal Up-Left
  [-1, 1]   // Diagonal Up-Right
];

const countXMASOccurrences = (grid: string[]): number => {
  const rows = grid.length;               
  const cols = grid[0]?.length || 0;
  let totalCount = 0;                    

  for (let x = 0; x < rows; x++) {
    for (let y = 0; y < cols; y++) {
      for (const [dx, dy] of directions) {
        // Check if "XMAS" can fit from (x, y) in direction (dx, dy)
        const endX = x + 3 * dx;  // 3 because "XMAS" has 4 letters (0, 1, 2, 3)
        const endY = y + 3 * dy;
        if (endX < 0 || endY < 0 || endX >= rows || endY >= cols) continue;

        // Check if "XMAS" matches character by character
        if (
          grid[x][y] === 'X' &&
          grid[x + dx][y + dy] === 'M' &&
          grid[x + 2 * dx][y + 2 * dy] === 'A' &&
          grid[x + 3 * dx][y + 3 * dy] === 'S'
        ) {
          totalCount++;
        }
      }
    }
  }

  return totalCount;
};

const countXMASPatternOccurrences = (grid: string[]): number => {
  const rows = grid.length;           
  const cols = grid[0]?.length || 0;      
  let totalCount = 0;

  for (let x = 0; x < rows - 2; x++) { // The X pattern is 3 rows tall, so we stop at rows - 2
    for (let y = 0; y < cols - 2; y++) { // The X pattern is 3 columns wide, so we stop at cols - 2
      const topLeft = grid[x][y];
      const topRight = grid[x][y + 2];
      const center = grid[x + 1][y + 1];
      const bottomLeft = grid[x + 2][y];
      const bottomRight = grid[x + 2][y + 2];

      if (
        center === 'A' && 
        (
          ((topLeft === 'M' && bottomRight === 'S') || (topLeft === 'S' && bottomRight === 'M')) && 
          ((bottomLeft === 'M' && topRight === 'S') || (bottomLeft === 'S' && topRight === 'M'))
        )
      ) {
        totalCount++;
      }
    }
  }

  return totalCount;
};


const Day4 = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/day4.txt`);
  const fileContent = await response.text();

  console.log("File content:", fileContent);

  // Clean and process the file into a grid
  const grid = fileContent.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  console.log("Grid:", grid);

  // Count the total occurrences of the word "XMAS"
  const totalOccurrences = countXMASOccurrences(grid);
  console.log(`Total occurrences of 'XMAS':`, totalOccurrences);

  const xMasOccurrences = countXMASPatternOccurrences(grid);
  console.log("X-MAS occurrences:", xMasOccurrences);

  return (
    <div className='flex flex-col items-center mt-10 gap-4'>
      <h1>XMAS appears {totalOccurrences} times!</h1>
      <h1>X-MAS appears {xMasOccurrences} times!</h1>
    </div>
  );
};

export default Day4;