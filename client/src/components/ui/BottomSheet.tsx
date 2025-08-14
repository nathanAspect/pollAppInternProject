import React from 'react';
import { CSSTransition } from 'react-transition-group';
import { MdCancel } from 'react-icons/md';

import styles from './BottomSheet.module.css';

export type BottemSheetProps = {
  isOpen: boolean;
  onClose?: (e: React.MouseEvent<SVGElement, MouseEvent>) => void;
};

const BottomSheet: React.FC<BottemSheetProps> = ({
  isOpen = false,
  onClose,
  children,
}) => {
  return (
    <CSSTransition
      in={isOpen}
      timeout={300}
      classNames={{
        enter: styles.enter,
        enterActive: styles.enterActive,
        exit: styles.exit,
        exitActive: styles.exitActive,
      }}
      unmountOnExit
    >
      <div className="absolute left-1/2 -translate-x-1/2 max-w-screen-sm bottom-0 z-10 overflow-y-hidden flex flex-col rounded-[20px] w-full h-[500px] bg-green-500">
        <div className="absolute top-[15px] right-[14px] z-[1000] flex justify-end flex-grow-0">
          <MdCancel
            className="mr-2 mt-2 fill-current text-red-700 opacity-80 cursor-pointer hover:opacity-90"
            onClick={onClose}
            size={30}
          />
        </div>
        <div className="relative overflow-y-hidden bg-gray-50 flex-grow">
          <div className="absolute top-0 bottom-0 left-0 right-0 overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </CSSTransition>
  );
};

export default BottomSheet;
