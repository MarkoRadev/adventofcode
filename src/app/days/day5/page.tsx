const parseFileContent = (fileContent: string) => {
  const [rulesPart, updatesPart] = fileContent.split('\n\n');
  // console.log("Rules part:", rulesPart);
  // console.log("Updates part:", updatesPart);

  const rules = rulesPart
    .split('\n')
    .map(line => line.split('|').map(part => parseInt(part, 10)));
    // .filter(ruleParts => ruleParts.length === 2 && !isNaN(ruleParts[0]) && !isNaN(ruleParts[1]));

  const updates = updatesPart
    .split('\n')
    .map(line => line.split(',').map(part => parseInt(part, 10)))
    // .filter(updateParts => updateParts.length > 0 && updateParts.every(num => !isNaN(num)));

  return { rules, updates };
};

const sumfOfMiddlePageNumbers = (rules: number[][], updates: number[][]): number => {
  let sum = 0;

  const forbiddenTransitions = new Set<string>();
  for (const [firstPage, secondPage] of rules) {
    forbiddenTransitions.add(`${secondPage}|${firstPage}`);
  }

  for (const update of updates) {
    let updateIsCorrect = true;

    // Check if the update violates any rule
    for (let j = 0; j < update.length - 1; j++) {
      const transitionKey = `${update[j]}|${update[j + 1]}`;
      if (forbiddenTransitions.has(transitionKey)) {
        updateIsCorrect = false;
        break;
      }
    }

    if (updateIsCorrect) {
      const middleIndex = Math.floor(update.length / 2);
      sum += update[middleIndex];
    }
  }

  return sum;
};

const reorderedUpdatesMiddlePageSum = (rules: number[][], updates: number[][]): number => {
  let sum = 0;

  // Convert rules to a set for fast lookup
  const forbiddenTransitions = new Set<string>();
  const ruleMap = new Map<number, Set<number>>();
  
  for (const [firstRule, secondRule] of rules) {
    forbiddenTransitions.add(`${secondRule}|${firstRule}`); // Store "second|first" as the key
    if (!ruleMap.has(firstRule)) ruleMap.set(firstRule, new Set());
    ruleMap.get(firstRule)!.add(secondRule);
  }

  const incorrectUpdates: number[][] = [];

  for (const update of updates) {
    let updateIsCorrect = true;

    // Check if the update violates any rule
    for (let j = 0; j < update.length - 1; j++) {
      const transitionKey = `${update[j]}|${update[j + 1]}`; // Current page to next page
      if (forbiddenTransitions.has(transitionKey)) {
        updateIsCorrect = false;
        break;
      }
    }

    if (!updateIsCorrect) {
      incorrectUpdates.push(update);
    }
  }

  // Correct the order of each incorrect update
  const correctOrder = (update: number[]): number[] => {
    const sorted = [...update];
    let swapped = true;

    while (swapped) {
      swapped = false;
      for (let i = 0; i < sorted.length - 1; i++) {
        const current = sorted[i];
        const next = sorted[i + 1];
        if (ruleMap.get(next)?.has(current)) { // If next should come before current
          [sorted[i], sorted[i + 1]] = [sorted[i + 1], sorted[i]]; // Swap them
          swapped = true;
        }
      }
    }
    return sorted;
  };

  for (const update of incorrectUpdates) {
    const orderedUpdate = correctOrder(update);
    const middleIndex = Math.floor(orderedUpdate.length / 2);
    sum += orderedUpdate[middleIndex];
  }

  return sum;
};

const Day5 = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/day5.txt`);
  const fileContent = await response.text();

  const { rules, updates } = parseFileContent(fileContent);

  return (
    <div className='flex flex-col items-center mt-10 gap-4'>
      <h1>Middle page numbers sum: {sumfOfMiddlePageNumbers(rules, updates)}</h1>
      <h1>Middle page numbers sum of ordered updates: {reorderedUpdatesMiddlePageSum(rules, updates)}</h1>
    </div>
  );
};

export default Day5;