import { data } from './data';

const calculateChecksum = (diskMap: string): number => {
  let checksum = 0;
  // Parse the disk map into blocks
  const blocks: (number | null)[] = [];
  let currentFileId = 0;

  for (let i = 0; i < diskMap.length; i += 2) {
    const fileLength = parseInt(diskMap[i], 10);
    const freeSpaceLength = parseInt(diskMap[i + 1], 10);

    // Add file blocks
    for (let j = 0; j < fileLength; j++) {
      blocks.push(currentFileId);
    }

    // Add free space blocks
    for (let j = 0; j < freeSpaceLength; j++) {
      blocks.push(null);
    }

    // Increment file ID for the next file
    currentFileId++;
  }

  console.log("Initial blocks:", blocks);

  let rearrangedBlocks = [...blocks];

  for (let i = blocks.length - 1; i >= 0; i--) {
    // Find the last file in the blocks array
    if (blocks[i] !== null) {
      const fileId = blocks[i];
      let fileLength = 1;

      // Calculate the length of the file by counting consecutive blocks with the same fileId
      for (let j = i - 1; j >= 0; j--) {
        if (blocks[j] === fileId) {
          fileLength++;
        } else {
          break;
        }
      }

      // Find the first free space span that can accommodate the file
      for (let j = 0; j < i - fileLength; j++) {
        if (rearrangedBlocks[j] === null) {
          let freeSpaceLength = 1;

          for (let k = j + 1; k < j + fileLength; k++) {
            if (rearrangedBlocks[k] === null) {
              freeSpaceLength++;
            } else {
              break;
            }
          }

          if (freeSpaceLength === fileLength) {
            for (let k = 0; k < fileLength; k++) {
              rearrangedBlocks[j + k] = fileId;
            }

            // Clear the original file positions
            for (let k = i; k > i - fileLength; k--) {
              rearrangedBlocks[k] = null;
            }

            // File has been moved; break to process the next file
            break;
          }
        }
      }

      // Update i to skip past the file we just processed
      i -= fileLength - 1;
    }
  }

  console.log("Rearranged blocks:", rearrangedBlocks);

  for (let i = 0; i < rearrangedBlocks.length; i++) {
    if (rearrangedBlocks[i] !== null) {
      checksum += i * (rearrangedBlocks[i] as number);
    }
  }
  
  return checksum;
};

const Day9 = () => {
  const checksum = calculateChecksum(data);
  console.log("Filesystem Checksum:", checksum);

  return <div>Filesystem Checksum: {checksum}</div>;
};

export default Day9;
