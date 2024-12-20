"use client";

import { useState, useEffect } from 'react';

const Day7 = () => {
  const [data, setData] = useState<string>('');
  const [parsedData, setParsedData] = useState<{ 
    testValue: number, 
    calculatedValues: number[] 
  }[]>([]);
  const [totalCalibrationResult, setTotalCalibrationResult] = useState<number>(0);
  const [newTotalCalibrationResult, setNewTotalCalibrationResult] = useState<number>(0);

  const fetchData = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/day7/day7.txt`);
    const fileContent = await response.text();
    setData(fileContent);
  };

  const generateOperatorCombinations = (length: number) => {
    const operators = ['+', '*', '||'];
    return Array.from({ length: Math.pow(operators.length, length) }, (_, i) => {
      return i.toString(3).padStart(length, '0').split('').map(bit => {
        if (bit === '0') return '+';
        if (bit === '1') return '*';
        return '||';
      });
    });
  };

  const evaluateEquation = (numbers: number[], operators: string[]) => {
    return numbers.slice(1).reduce((acc, num, i) => {
      const operator = operators[i];
      if (operator === '+') {
        return acc + num;
      } else if (operator === '*') {
        return acc * num;
      } else if (operator === '||') {
        return parseInt(acc.toString() + num.toString());
      }
      return acc;
    }, numbers[0]);
  };

  const canBeCalculated = (testValue: number, numbers: number[], useConcatenation = false) => {
    if (numbers.length === 1) return testValue === numbers[0]; // Edge case with only one number
    const operatorCombinations = generateOperatorCombinations(numbers.length - 1);
    if (!useConcatenation) {
      // Filter combinations to only include + and *
      const filteredCombinations = operatorCombinations.filter(ops => ops.every(op => op !== '||'));
      return filteredCombinations.some(operators => evaluateEquation(numbers, operators) === testValue);
    }
    return operatorCombinations.some(operators => evaluateEquation(numbers, operators) === testValue);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (data) {
      const parsed = data.split('\n')
        .filter(line => line.trim() !== '')
        .map(line => {
          const [testValue, ...calculatedValues] = line.split(': ').flatMap(part => part.split(' ').map(Number));
          return { testValue, calculatedValues };
        });
      setParsedData(parsed);
    }
  }, [data]);

  useEffect(() => {
    if (parsedData.length > 0) {
      const oldTotal = parsedData.reduce((sum, { testValue, calculatedValues }) => {
        return canBeCalculated(testValue, calculatedValues, false) ? sum + testValue : sum;
      }, 0);
      setTotalCalibrationResult(oldTotal);

      // Calculate new total calibration result (with +, *, and ||)
      const newTotal = parsedData.reduce((sum, { testValue, calculatedValues }) => {
        return canBeCalculated(testValue, calculatedValues, true) ? sum + testValue : sum;
      }, 0);
      setNewTotalCalibrationResult(newTotal);
    }
  }, [parsedData]);

  return (
    <div className='flex flex-col items-center mt-10 gap-4'>
      <h1>Day 7 Calculation</h1>
      <h2>Total Calibration Result: {totalCalibrationResult}</h2>
      <h2>New Total Calibration Result (using +, *, ||): {newTotalCalibrationResult}</h2>
    </div>
  );
};

export default Day7;