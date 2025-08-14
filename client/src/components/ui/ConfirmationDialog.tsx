import React from 'react';

type ConfirmationDialogProps = {
  message: string;
  showDialog: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  message,
  showDialog,
  onCancel,
  onConfirm,
}) => {
  return showDialog ? (
    <div className="z-50 fixed inset-0 bg-gray-700 bg-opacity-30 overflow-y-auto h-full w-full">
      <div className="absolute bg-[#0B1215] rounded-[20px] border border-[#ffffff2b] p-4 rounded-xl drop-shadow-md top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64">
        <div className="text-center font-semibold mb-6 text-white opacity-70">{message}</div>
        <div className="flex justify-around my-2">
          <button className="text-white opacity-50 hover:opacity-70 duration-300" onClick={onCancel}>
            Cancel
          </button>
          <button className="rounded-[20px] border border-[#ffffff2b] px-[20px] py-[7px] text-[#9d8bfb] bg-[#ffffff13] hover:bg-[#ffffff2b] trasition-all duration-300 font-bold" onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default ConfirmationDialog;
