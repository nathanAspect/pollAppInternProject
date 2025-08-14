import React, { useState } from 'react';
import { MdCancel } from 'react-icons/md';
import { Nominations } from '../pollState';
import BottomSheet, { BottemSheetProps } from './ui/BottomSheet';

type NominationFormProps = {
  title?: string;
  nominations?: Nominations;
  userID?: string;
  isAdmin: boolean;
  onSubmitNomination: (nomination: string) => void;
  onRemoveNomination: (nominationID: string) => void;
} & BottemSheetProps;

const NominationForm: React.FC<NominationFormProps> = ({
  isOpen,
  onClose,
  title,
  nominations = {},
  onSubmitNomination,
  onRemoveNomination,
  userID,
  isAdmin,
}) => {
  const [nominationText, setNominationText] = useState<string>('');

  const handleSubmitNomination = (nominationText: string) => {
    onSubmitNomination(nominationText);
    setNominationText('');
  };

  const getBoxStyle = (id: string): string => {
    return id === userID
      ? 'bg-orange-100 flex-row'
      : 'bg-[#ffffff13] flex-row';
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col px-[40px] items-center mb-2 bg-[#0B1215] border border-[#ffffff2b] rounded-[20px] h-full">
        <h3 className="font-bold mt-[30px] text-white opacity-80 mb-[15px]">{title}</h3>
        <div className="w-full my-4">
          <textarea
            rows={1}
            maxLength={100}
            className="outline-none px-[12px] py-[10px] w-full rounded-[5px] border-none bg-[#ffffff13] text-[#ffffffb2] mb-[10px] text-[17px]"
            value={nominationText}
            onChange={(e) => setNominationText(e.currentTarget.value)}
            placeholder='Put your nomination'
          />
        </div>
        <button
          className="rounded-[20px] border border-[#ffffff2b] px-[15px] py-[7px] text-[#9d8bfb] bg-[#ffffff13] hover:bg-[#ffffff2b] trasition-all duration-300 font-bold w-[130px] mr-[15px] mb-[30px]"
          disabled={!nominationText.length || nominationText.length > 100}
          onClick={() => handleSubmitNomination(nominationText)}
        >
          Nominate
        </button>

        <div className="w-full mb-2">
          {Object.entries(nominations).map(([nominationID, nomination]) => (
            <div
              key={nominationID}
              className={`my-2 flex justify-between items-center px-[12px] py-[10px] w-full rounded-[5px] border-none  text-[#ffffffb2] mb-[10px] text-[17px] ${getBoxStyle(
                nomination.userID
              )}`}
            >
              <div>{nomination.text}</div>
              {isAdmin && (
                <div className="ml-2">
                  <MdCancel
                    className="fill-current cursor-pointer hover:opacity-80"
                    onClick={() => onRemoveNomination(nominationID)}
                    size={24}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </BottomSheet>
  );
};

export default NominationForm;
