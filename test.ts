import v8 from 'v8';

const heapSpace = v8.getHeapSpaceStatistics();
console.log(heapSpace);
