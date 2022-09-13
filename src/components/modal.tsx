import { ReactNode, useEffect } from 'react';

export type ModalProps = {
  isVisible: boolean;
  onClose: () => void;
  children: ReactNode;
};

export function Modal({ children, isVisible, onClose }: ModalProps) {
  useEffect(() => {
    if (!isVisible) {
      return;
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    document.addEventListener('keyup', handleEscape);

    return () => document.removeEventListener('keyup', handleEscape);
  }, [isVisible, onClose]);

  return (
    <div
      className={`relative z-10 ${
        isVisible
          ? 'easeOut duration-300 visible'
          : 'easeIn duration-200 invisible'
      }`}
      role='dialog'
      aria-modal='true'
    >
      <div
        className={`hidden fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity md:block ${
          isVisible
            ? 'easeOut duration-300 opacity-100'
            : 'easeIn duration-200 opacity-0'
        }`}
      ></div>

      <div
        className='fixed z-10 inset-0 overflow-y-auto'
        onClick={() => onClose()}
      >
        <div className='flex items-stretch md:items-center justify-center min-h-full text-center md:px-2 lg:px-4'>
          <div
            className={`flex text-base text-left transform transition w-full md:max-w-2xl md:px-4 md:my-8 lg:max-w-4xl ${
              isVisible
                ? 'easeOut duration-300 opacity-100 translate-y-0 md:scale-100'
                : 'easeIn duration-200 opacity-0 translate-y-4 md:translate-y-0 md:scale-95'
            }`}
            onClick={event => event.stopPropagation()}
          >
            <div className='w-full relative flex items-center bg-white px-4 pt-14 pb-8 overflow-hidden shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8'>
              <button
                type='button'
                aria-label='Close'
                className='absolute top-4 right-4 text-gray-400 hover:text-gray-500 sm:top-8 sm:right-6 md:top-6 md:right-6 lg:top-8 lg:right-8'
                onClick={event => {
                  event.preventDefault();
                  onClose();
                }}
              >
                <svg
                  aria-hidden
                  className='h-6 w-6'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth='2'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </button>

              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
