export default function useSingleModeTurn(turn: number): {
  year: number;
  yearText: string;
  month: number;
  monthText: string;
  half: number;
  halfText: string;
} {
  const year = Math.floor(turn / 24) + 1;
  const yearText = (() => {
    switch (year) {
      case 1:
        return 'ジュニア級';
      case 2:
        return 'クラシック級';
      case 3:
        return 'シニア級';
      default:
        return `Year ${year}`;
    }
  })();
  const half = (turn % 2) + 1;
  const halfText = half === 1 ? '前半' : '後半';
  const month = (((turn - (half - 1)) / 2) % 12) + 1;
  const monthText = `${month} 月`;

  return {
    year,
    yearText,
    month,
    monthText,
    half,
    halfText,
  };
}
