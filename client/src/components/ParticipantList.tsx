import React from 'react';
import { MdClose } from 'react-icons/md';
import BottomSheet, { BottemSheetProps } from './ui/BottomSheet';
import { Participants } from 'shared/poll-types';

type ParticipantListProps = {
  participants?: Participants;
  userID?: string;
  isAdmin: boolean;
  onRemoveParticipant: (id: string) => void;
} & BottemSheetProps;

const ParticipantList: React.FC<ParticipantListProps> = ({
  isOpen,
  onClose,
  participants = {},
  onRemoveParticipant,
  userID,
  isAdmin,
}) => (
  <BottomSheet isOpen={isOpen} onClose={onClose}>
    <div className="px-8 flex flex-wrap justify-center mb-2 bg-[#0B1215] border border-[#ffffff2b] rounded-[20px] h-full">
      {Object.entries(participants).map(([id, participant]) => (
        <div
          key={id}
          className="bg-[#0B1215] rounded-[20px] border border-[#ffffff2b] mx-1 my-[20px] px-[7px] shadow-xl flex justify-center items-center rounded-md min-w-[100px] h-[40px]"
        >
          <span className="ml-2 mr-1 text-white opacity-80 text-xl text-center">
            {participant}
          </span>
          {isAdmin && userID !== id && (
            <span
              className="ml-1 mr-2 cursor-pointer"
              onClick={() => onRemoveParticipant(id)}
            >
              <MdClose
                className="fill-current text-white opacity-80 align-middle"
                size={18}
              />
            </span>
          )}
        </div>
      ))}
    </div>
  </BottomSheet>
);

export default ParticipantList;
