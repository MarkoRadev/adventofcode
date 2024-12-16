const Day3 = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/day3.txt`);
  const fileContent = await response.text();

  const instructions = fileContent.match(/(?<!\w)(mul\((\d+),(\d+)\)|do\(\)|don't\(\))/g) || [];

  let isEnabled = true;
  let totalSum = 0;

  instructions.forEach(instruction => {
    if (instruction === 'do()') {
      isEnabled = true;
    } else if (instruction === "don't()") {
      isEnabled = false;
    } else {
      const match = instruction.match(/mul\((\d+),(\d+)\)/);
      if (match && isEnabled) {
        const x = Number(match[1]);
        const y = Number(match[2]);
        totalSum += x * y;
      }
    }
  });

  return (
    <div className='flex justify-center mt-10'>
      <h1>Total sum of enabled multiplications: {totalSum}</h1>
    </div>
  );
};

export default Day3;