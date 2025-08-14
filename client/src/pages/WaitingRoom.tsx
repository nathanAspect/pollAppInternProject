import React, { useEffect, useState } from 'react';
import { BsPencilSquare } from 'react-icons/bs';
import { MdContentCopy, MdPeopleOutline } from 'react-icons/md';
import { useCopyToClipboard } from 'react-use';
import { useSnapshot } from 'valtio';
import NominationForm from '../components/NominationForm';
import ParticipantList from '../components/ParticipantList';
import ConfirmationDialog from '../components/ui/ConfirmationDialog';
import { actions, state } from '../state';
import { colorizeText } from '../util';

export const WaitingRoom: React.FC = () => {
  const [_copiedText, copyToClipboard] = useCopyToClipboard();
  const [isParticipantListOpen, setIsParticipantListOpen] = useState(false);
  const [isNominationFormOpen, setIsNominationFormOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [participantToRemove, setParticipantToRemove] = useState<string>();
  const [showConfirmation, setShowConfirmation] = useState(false);

  const currentState = useSnapshot(state);

  const confirmRemoveParticipant = (id: string) => {
    setConfirmationMessage(
      `Remove ${currentState.poll?.participants[id]} from poll?`
    );
    setParticipantToRemove(id);
    setIsConfirmationOpen(true);
  };

  const submitRemoveParticipant = () => {
    participantToRemove && actions.removeParticipant(participantToRemove);
    setIsConfirmationOpen(false);
  };

  useEffect(() => {
    console.log('Waiting room useEffect');
    actions.initializeSocket();
  }, []);
  return (
    <div className='flex flex-col justify-around items-center h-full mx-auto w-full p-[20px] border border-[#9d8bfb] rounded-[50px]'>
      <div className="flex flex-col w-full justify-between items-center h-full">
        <div>
          <h2 className="text-center font-bold text-white opacity-80 mt-[20px]">Poll Topic</h2>

          <p className="italic text-center text-white opacity-80 mt-[10px] mb-[10px]">{currentState.poll?.topic}</p>

          <h2 className="text-center font-bold text-white opacity-80 mt-[20px]">Poll ID</h2>

          <h3 className="italic text-center text-white opacity-80 mt-[10px] mb-[10px]">Click to copy!</h3>

          <div
            onClick={() => copyToClipboard(currentState.poll?.id || '')}
            className="mb-4 flex justify-center align-middle cursor-pointer text-white opacity-70 hover:opacity-100 duration-300 mb-[25px]"
          >
            <div className="font-extrabold text-center mr-2">
              {currentState.poll && colorizeText(currentState.poll?.id)}
            </div>
            <MdContentCopy size={24} />
          </div>

        </div>
        <div className="flex justify-center">

          <button
            className="rounded-[10px] flex justify-center items-center border border-[#ffffff2b] px-[5px] py-[5px] text-[#BDBEBF] bg-[#ffffff13] hover:bg-[#ffffff2b] trasition-all duration-300 font-bold w-[60px] mr-[15px] mb-[7px]"
            onClick={() => setIsParticipantListOpen(true)}
          >
            <MdPeopleOutline size={30} />
            <span>{currentState.participantCount}</span>
          </button>

          <button
            className="rounded-[10px] flex justify-center items-center border border-[#ffffff2b] px-[5px] py-[5px] text-[#BDBEBF] bg-[#ffffff13] hover:bg-[#ffffff2b] trasition-all duration-300 font-bold w-[60px] mr-[15px] mb-[7px]"
            onClick={() => setIsNominationFormOpen(true)}
          >
            <BsPencilSquare size={24} />
            <span>{currentState.nominationCount}</span>
          </button>

        </div>

        {currentState.isAdmin ? (

          <div className="text-center italic text-white opacity-80">
              {currentState.poll?.votesPerVoter} Nominations Required to
            Start!
          </div> ): (
            <div className="text-center italic text-white opacity-80">
            Waiting for Admin,{' '}
            <span className="font-semibold">
              {currentState.poll?.participants[currentState.poll?.adminID]}
            </span>
            , to start the voting.
          </div>
          )
        }

        <div className="flex justify-center items-center">
          {currentState.isAdmin ? (
            <button
              className="rounded-[20px] border border-[#ffffff2b] px-[15px] py-[7px] text-[#9d8bfb] bg-[#ffffff13] hover:bg-[#ffffff2b] trasition-all duration-300 font-bold w-[130px] mr-[15px] mb-[15px]"
              disabled={!currentState.canStartVote}
              onClick={() => actions.startVote()}
            >
              Start Voting
            </button>
          ) : (null)}
            <button
              className="rounded-[20px] border border-[#ffffff2b] px-[15px] py-[7px] text-[#9d8bfb] bg-[#ffffff13] hover:bg-[#ffffff2b] trasition-all duration-300 font-bold w-[130px] mr-[15px] mb-[15px]"
              onClick={() => setShowConfirmation(true)}
            >
              Leave Poll
            </button>


          <ConfirmationDialog
            message="You'll be kicked out of the poll"
            showDialog={showConfirmation}
            onCancel={() => setShowConfirmation(false)}
            onConfirm={() => actions.startOver()}
          />
        </div>
      </div>
      <ParticipantList
        isOpen={isParticipantListOpen}
        onClose={() => setIsParticipantListOpen(false)}
        participants={currentState.poll?.participants}
        onRemoveParticipant={confirmRemoveParticipant}
        isAdmin={currentState.isAdmin || false}
        userID={currentState.me?.id}
      />
      <NominationForm
        title={currentState.poll?.topic}
        isOpen={isNominationFormOpen}
        onClose={() => setIsNominationFormOpen(false)}
        onSubmitNomination={(nominationText) =>
          actions.nominate(nominationText)
        }
        nominations={currentState.poll?.nominations}
        userID={currentState.me?.id}
        onRemoveNomination={(nominationID) =>
          actions.removeNomination(nominationID)
        }
        isAdmin={currentState.isAdmin || false}
      />
      <ConfirmationDialog
        showDialog={isConfirmationOpen}
        message={confirmationMessage}
        onConfirm={() => submitRemoveParticipant()}
        onCancel={() => setIsConfirmationOpen(false)}
      />
    </div>
  );
};
