import React, { useState } from 'react';
import { useSnapshot } from 'valtio';
import ConfirmationDialog from '../components/ui/ConfirmationDialog';
import ResultCard from '../components/ui/ResultCard';
import { actions, state } from '../state';

export const Results: React.FC = () => {
  const { poll, isAdmin, participantCount, rankingsCount } = useSnapshot(state);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [isLeavePollOpen, setIsLeavePollOpen] = useState(false);

  return (
    <div className='flex flex-col justify-center items-stretch h-full mx-auto w-full p-[20px] border border-[#9d8bfb] rounded-[50px]'>
      <div className="mx-auto flex flex-col w-full justify-between items-center h-full max-w-sm">
        <div className="w-full">
          <h1 className="text-center font-bold text-white opacity-80 my-[15px]">Results</h1>
          {poll?.results.length ? (
            <ResultCard results={poll?.results} />
          ) : (
            <p className="text-center text-[18px] text-white opacity-80 mb-[15px]">
              <span className="text-center text-[19px] font-bold text-white mb-[15px]">{rankingsCount}</span> of{' '}
              <span className="text-center text-[19px] font-bold text-white mb-[15px]">{participantCount}</span>{' '}
              participants have voted
            </p>
          )}
        </div>
        <div className="flex flex-col justify-center">
          {isAdmin && !poll?.results.length && (
            <>
              <button
                className="rounded-[20px] border border-[#ffffff2b] px-[15px] py-[7px] text-[#9d8bfb] bg-[#ffffff13] hover:bg-[#ffffff2b] trasition-all duration-300 font-bold w-[130px] mr-[15px] mb-[20px]"
                onClick={() => setIsConfirmationOpen(true)}
              >
                End Poll
              </button>
            </>
          )}
          {!isAdmin && !poll?.results.length && (
            <div className="text-center text-[16px] italic text-white opacity-70 mb-[15px]">
              Waiting for Admin{' '}
              <span className="font-bold">
                {poll?.participants[poll?.adminID]}
              </span>
              , to finalize the poll.
            </div>
          )}
          {!!poll?.results.length && (
            <button
              className="rounded-[20px] border border-[#ffffff2b] px-[15px] py-[7px] text-[#9d8bfb] bg-[#ffffff13] hover:bg-[#ffffff2b] trasition-all duration-300 font-bold w-[130px] mr-[15px] mb-[20px]"
              onClick={() => setIsLeavePollOpen(true)}
            >
              Leave Poll
            </button>
          )}
        </div>
      </div>
      {isAdmin && (
        <ConfirmationDialog
          message="Are you sure close the poll and calculate the results?"
          showDialog={isConfirmationOpen}
          onCancel={() => setIsConfirmationOpen(false)}
          onConfirm={() => {
            actions.closePoll();
            setIsConfirmationOpen(false);
          }}
        />
      )}
      {isLeavePollOpen && (
        <ConfirmationDialog
          message="You'll lose ya results. Dat alright?"
          showDialog={isLeavePollOpen}
          onCancel={() => setIsLeavePollOpen(false)}
          onConfirm={() => actions.startOver()}
        />
      )}
    </div>
  );
};
