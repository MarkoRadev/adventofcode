import { data } from './data';

const Day2 = () => {
  const reports = data
    .trim()
    .split('\n')
    .map((row) => row.split(" ").map(Number));

  const countSafeReports = (reports: number[][]): number => {
    const isSafe = (report: number[]): boolean => {
      let isIncreasing = true;
      let isDecreasing = true;

      for (let i = 1; i < report.length; i++) {
        const diff = report[i] - report[i - 1];
        const absDiff = Math.abs(diff);

        if (absDiff < 1 || absDiff > 3) {
          return false;
        }

        if (diff < 0) {
          isIncreasing = false;
        }
        if (diff > 0) {
          isDecreasing = false;
        }

        if (!isIncreasing && !isDecreasing) {
          return false;
        }
      }

      return isIncreasing || isDecreasing;
    };

    const isSafeWithDampener = (report: number[]) => {
      if (isSafe(report)) {
        return true;
      }
  
      for (let i = 0; i < report.length; i++) {
        const modifiedReport = [...report.slice(0, i), ...report.slice(i + 1)];
        if (isSafe(modifiedReport)) {
          return true;
        }
      }
  
      return false;
    };

    return reports.filter(isSafeWithDampener).length;
  };

  console.log("Number of safe reports:", countSafeReports(reports));

  return (
    <div className='flex justify-center mt-10'>
      <h1>Number of safe reports: {countSafeReports(reports)}</h1>
    </div>
  );
};

export default Day2;