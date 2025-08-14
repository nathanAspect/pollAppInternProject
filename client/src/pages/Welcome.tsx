import React from 'react';
import { actions, AppPage } from '../state';

const Welcome: React.FC = () => {

  return (

    <div className="flex justify-around items-center h-full border border-[#9d8bfb] rounded-[50px]">

      <div className='flext justify-around items-center mt-[20px]'>
        <div className='h-[50px] w-[300px] flex flex-col items-center justify-center mb-[30px]'>
            <h1 className="text-center text-[40px] text-white bold font-bold">Vote. Share. </h1>
            <span className='text-[#9d8bfb] text-[40px] font-bold'>Decide.</span>
        </div>
          
        <p className='text-white text-[18px] opacity-80 w-[300px] text-center mb-[25px]'>Welcome to <span className='text-[#9d8bfb] font-bold'>RankR</span> , Where every opinion matters and every vote shapes the outcome!</p>

        <div className="flex items-center justify-center">
          <button
            className="rounded-[20px] border border-[#ffffff2b] px-[15px] py-[7px] my-2 text-[#9d8bfb] bg-[#ffffff13] hover:bg-[#ffffff2b] trasition-all duration-300 font-bold w-[130px] mr-[15px]"
            onClick={() => actions.setPage(AppPage.Create)}
          >
            Create Poll
          </button>
          <button
            className="rounded-[20px] border border-[#ffffff2b] px-[15px] py-[7px] my-2 text-[#9d8bfb] bg-[#ffffff13] hover:bg-[#ffffff2b] trasition-all duration-300 font-bold w-[130px]"
            onClick={() => actions.setPage(AppPage.Join)}
          >
            Join Poll
          </button>
        </div>

      </div>

      <div>
        <img src='/hero_img.png' className='w-[400px]'/>
      </div>
    
    </div>

  );

};

export default Welcome;
