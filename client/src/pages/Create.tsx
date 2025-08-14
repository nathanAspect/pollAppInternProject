import React, { useState } from 'react';
import { Poll } from 'shared/poll-types';
import { makeRequest } from '../api';
import CountSelector from '../components/ui/CountSelector';
import { actions, AppPage } from '../state';

const Create: React.FC = () => {
  const [pollTopic, setPollTopic] = useState('');
  const [maxVotes, setMaxVotes] = useState(3);
  const [name, setName] = useState('');
  const [apiError, setApiError] = useState('');

  const areFieldsValid = (): boolean => {
    if (pollTopic.length < 1 || pollTopic.length > 100) {
      return false;
    }

    if (maxVotes < 1 || maxVotes > 5) {
      return false;
    }

    if (name.length < 1 || name.length > 25) {
      return false;
    }

    return true;
  };

  const handleCreatePoll = async () => {
    actions.startLoading();
    setApiError('');

    const { data, error } = await makeRequest<{
      poll: Poll;
      accessToken: string;
    }>('/polls', {
      method: 'POST',
      body: JSON.stringify({
        topic: pollTopic,
        votesPerVoter: maxVotes,
        name,
      }),
    });

    console.log(data, error);

    if (error && error.statusCode === 400) {
      console.log('400 error', error);
      setApiError('Name and poll topic are both required!');
    } else if (error && error.statusCode !== 400) {
      setApiError(error.messages[0]);
    } else {
      actions.initializePoll(data.poll);
      actions.setPollAccessToken(data.accessToken);
      actions.setPage(AppPage.WaitingRoom);
    }

    actions.stopLoading();
  };

  return (

    <div className="flex flex-col justify-center items-stretch h-full mx-auto w-full p-[20px] border border-[#9d8bfb] rounded-[50px]">
      
      <div className="mb-12">
        <h3 className="text-center font-bold text-white opacity-80 mb-[15px]">Topic</h3>
        <div className="text-center w-full ">
          <input
            maxLength={100}
            onChange={(e) => setPollTopic(e.target.value)}
            className="outline-none px-[12px] py-[7px] w-[300px] rounded-[5px] border-none bg-[#ffffff13] text-[#ffffffb2] mb-[10px]"
            placeholder='Where should we eat today?'
          />
        </div>
        <h3 className="text-center font-bold text-white opacity-80 mt-[20px] mb-[15px]">Votes Per Participant</h3>
        <div className="w-48 mx-auto my-4">
          <CountSelector
            min={1}
            max={5}
            initial={3}
            step={1}  
            onChange={(val) => setMaxVotes(val)}
          />
        </div>
        <div className="mb-[10px]">
          <h3 className="text-center font-bold text-white opacity-80 mb-[15px]">Enter Name</h3>
          <div className="text-center w-full">
            <input
              maxLength={25}
              onChange={(e) => setName(e.target.value)}
              className="outline-none px-[12px] py-[7px] w-[300px] rounded-[5px] border-none bg-[#ffffff13] text-[#ffffffb2]"
              placeholder='Jhon'
            />
          </div>
        </div>
        {apiError && (
          <p className="text-center text-red-600 font-light mt-8">{apiError}</p>
        )}
      </div>
      <div className="flex justify-center items-center">
        <button
          className="rounded-[20px] border border-[#ffffff2b] px-[15px] py-[7px] text-[#9d8bfb] bg-[#ffffff13] hover:bg-[#ffffff2b] trasition-all duration-300 font-bold w-[130px] mr-[15px]"
          onClick={handleCreatePoll}
          disabled={!areFieldsValid()}
        >
          Create
        </button>
        <button
          className="rounded-[20px] border border-[#ffffff2b] px-[15px] py-[7px] text-[#9d8bfb] bg-[#ffffff13] hover:bg-[#ffffff2b] trasition-all duration-300 font-bold w-[130px] mr-[15px]"
          onClick={() => actions.startOver()}
        >
          Start Over
        </button>
      </div>
    </div>
  );

};

export default Create;
