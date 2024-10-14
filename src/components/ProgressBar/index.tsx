type Props = {
  percentage: number;
};

const ProgressBar = ({ percentage }: Props) => {
  return (
    <div className={'relative rounded-full shadow-xl'}>
      <div
        className={`relative flex ${percentage < 0.5 ? 'bg-[#266EFF]' : 'bg-[#92B6FF]'} shadow-xl border border-palette-line/20`}
        style={{ borderWidth: 5, borderColor: 'white' }}
      >
        <div
          className={`${percentage >= 0.5 ? 'bg-[#266EFF]' : 'bg-[#92B6FF]'} h-[25px]`}
          style={{ width: `calc(${percentage} * 100%)` }}
        />
        {/* Left header */}
        <div
          className={
            'h-[40px] w-[40px] bg-white rounded-full shadow-xl absolute  text-xs top-[-5px] left-[-20px] flex justify-center items-center font-bold border border-palette-line/20'
          }
          style={{ borderWidth: 2 }}
        >
          {(percentage * 100).toFixed(1)}%
        </div>
        {/* Right header */}
        <div
          className={
            'h-[40px] w-[40px] bg-white rounded-full shadow-xl absolute  text-xs top-[-5px] right-[-20px] flex justify-center items-center font-bold border border-palette-line/20'
          }
          style={{ borderWidth: 2 }}
        >
          {((1 - percentage) * 100).toFixed(1)}%
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
