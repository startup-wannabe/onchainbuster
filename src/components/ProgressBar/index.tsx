import React from 'react';

type Props = {
  percentage: number;
};

const ProgressBar = ({ percentage }: Props) => {
  const barSize = 250;
  return (
    <div className={`relative w-[${barSize}px] rounded-full shadow-xl`}>
      <div
        className={`relative flex ${percentage >= 0.5 ? 'bg-[#92B6FF]' : 'bg-[#266EFF]'} shadow-xl border border-palette-line/20`}
        style={{ borderWidth: 5, borderColor: 'white' }}
      >
        <div
          className={` ${percentage < 0.5 ? 'bg-[#92B6FF]' : 'bg-[#266EFF]'} h-[25px]`}
          style={{ width: barSize * percentage }}
        />
        <div
          className={`h-[50px] w-[50px] bg-white rounded-full shadow-xl absolute top-[-10px] text-xs left-[-10px] flex justify-center items-center font-bold border border-palette-line/20`}
          style={{ borderWidth: 2 }}
        >
          {(percentage * 100).toFixed(1)}%
        </div>
        <div
          className={`h-[50px] w-[50px] bg-white rounded-full shadow-xl absolute top-[-10px] text-xs right-[-10px] flex justify-center items-center font-bold border border-palette-line/20`}
          style={{ borderWidth: 2 }}
        >
          {((1 - percentage) * 100).toFixed(1)}%
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
