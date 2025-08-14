import React, { useState, useEffect } from 'react';
import { useSnapshot } from 'valtio';
import ConfirmationDialog from '../components/ui/ConfirmationDialog';
import RankedCheckBox from '../components/ui/RankedCheckBox';
import { state, actions } from '../state';
import { getTokenPayload } from '../util';

export const Voting: React.FC = () => {
  const currentState = useSnapshot(state);
  const [rankings, setRankings] = useState<string[]>([]);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [confirmVotes, setConfirmVotes] = useState(false);



  useEffect(() => {
    if (!currentState.poll) {
      const accessToken = localStorage.getItem('accessToken');

      if (!accessToken) return;

      const { exp: tokenExp } = getTokenPayload(accessToken);
      const currentTimeInSeconds = Date.now() / 1000;

      if (tokenExp < currentTimeInSeconds - 10) {
        localStorage.removeItem('accessToken');
        return;
      }

      actions.setPollAccessToken(accessToken);
      actions.initializeSocket();
    }
  }, [currentState.poll]);



  const toggleNomination = (id: string) => {
    const position = rankings.findIndex((ranking) => ranking === id);
    const hasVotesRemaining =
      (currentState.poll?.votesPerVoter || 0) - rankings.length > 0;

    if (position < 0 && hasVotesRemaining) {
      setRankings([...rankings, id]);
    } else {
      setRankings([
        ...rankings.slice(0, position),
        ...rankings.slice(position + 1, rankings.length),
      ]);
    }
  };

  const getRank = (id: string) => {
    const position = rankings.findIndex((ranking) => ranking === id);

    return position < 0 ? undefined : position + 1;
  };

  return (
    <div className="flex flex-col justify-center items-stretch h-full mx-auto w-full p-[20px] border border-[#9d8bfb] rounded-[50px]">
      <div className="w-full">
        <h1 className="text-center font-bold text-white opacity-80 mb-[15px]">Voting Page</h1>
      </div>
      <div className="w-full">
        {currentState.poll && (
          <>
            <div className="text-center font-bold text-white opacity-80 mb-[15px]">
              Select Your Top {currentState.poll?.votesPerVoter} Choices
            </div>
            <div className="text-center italic text-white opacity-80 mb-[20px]">
              {currentState.poll.votesPerVoter - rankings.length} Votes
              remaining
            </div>
          </> 
        )}
        <div className="px-2 w-full mb-[20px] flex flex-col justify-center items-center">
          {Object.entries(currentState.poll?.nominations || {}).map(
            ([id, nomination]) => (
              <RankedCheckBox
                key={id}
                value={nomination.text}
                rank={getRank(id)}
                onSelect={() => toggleNomination(id)}
              />
            )
          )}
        </div>
      </div>

      <div className="mx-auto flex items-center">

        <button
          disabled={rankings.length < (currentState.poll?.votesPerVoter ?? 100)}
          className="rounded-[20px] border border-[#ffffff2b] px-[15px] py-[7px] text-[#9d8bfb] bg-[#ffffff13] hover:bg-[#ffffff2b] trasition-all duration-300 font-bold w-[130px] mr-[15px]"
          onClick={() => setConfirmVotes(true)}
        >
          Submit
        </button>

        <ConfirmationDialog
          message="You cannot change your vote after submitting"
          showDialog={confirmVotes}
          onCancel={() => setConfirmVotes(false)}
          onConfirm={() => actions.submitRankings(rankings)}
        />
        {currentState.isAdmin && (

          <div>
            <button
              className="rounded-[20px] border border-[#ffffff2b] px-[15px] py-[7px] text-[#9d8bfb] bg-[#ffffff13] hover:bg-[#ffffff2b] trasition-all duration-300 font-bold w-[130px] mr-[15px]"
              onClick={() => setConfirmCancel(true)}
            >
              Cancel Poll
            </button>
            <ConfirmationDialog
              message="This will cancel the poll and remove all users"
              showDialog={confirmCancel}
              onCancel={() => setConfirmCancel(false)}
              onConfirm={() => actions.cancelPoll()}
            />
          </div>

        )}
      </div>
    </div>
  );
};
