import React, { useState } from 'react';
import { useEffect } from 'react';

type CountSelectorProps = {
  min: number;
  max: number;
  step: number;
  initial: number;
  onChange: (val: number) => void;
};

const CountSelector: React.FC<CountSelectorProps> = ({
  min,
  max,
  step,
  initial,
  onChange,
}) => {
  if (initial < min || initial > max) {
    console.warn(
      `'initial' = ${initial} must in the rang eof ${min} and ${max}. Setting a default initial value`
    );

    const steps = (max - min) / step;

    initial = min + Math.floor(steps);
  }

  const [current, setCurrent] = useState(initial);

  useEffect(() => {
    onChange(current);
  }, [current]);

  return (
    <div className="flex justify-between items-center">
      <button
        type="button"
        className="rounded-full p-[5px] size-[40px] text-white opacity-80 font-bold text-[20px] text-center bg-[#ffffff13] flex justify-center items-center hover:bg-[#ffffff2b] duration-300"
        disabled={current - step < min}
        onClick={() => setCurrent(current - step)}
      >
        -
      </button>
      <div className="text-white opacity-80 font-bold text-[16px]]">{current}</div>
      <button
        type="button"
        className="rounded-full p-[5px] size-[40px] text-white opacity-80 font-bold text-[20px] text-center bg-[#ffffff13] flex justify-center items-center hover:bg-[#ffffff2b] duration-300"
        disabled={current + step > max}
        onClick={() => setCurrent(current + step)}
      >
        +
      </button>
    </div>
  );
};

export default CountSelector;
