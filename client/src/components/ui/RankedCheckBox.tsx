import React from 'react';

type RankedCheckBoxProps = {
  rank?: number;
  value: string;
  onSelect: () => void;
};

const RankedCheckBox: React.FC<RankedCheckBoxProps> = ({
  value,
  rank,
  onSelect,
}) => (
  <div className="outline-none px-[12px] py-[7px] w-[350px] rounded-[5px] border-none bg-[#ffffff13] text-[#ffffffb2] mb-[10px] relative" onClick={() => onSelect()}>
    <div>{value}</div>
    {rank && (
      <div className="absolute w-6 h-6 -top-3 -right-3 rounded-full bg-purple-600">
        <div className="text-center font-medium text-white opacity-80">{rank}</div>
      </div>
    )}
  </div>
);

export default RankedCheckBox;
