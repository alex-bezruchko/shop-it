// AlertContainer.js
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { removeAlert } from './../actions/alertActions';

const AlertContainer = ({ alert, removeAlert }) => {
  const { message, alertType } = alert;

  useEffect(() => {
    if (message && alertType) {
      const timer = setTimeout(() => {
        removeAlert();
      }, 3800); // 3 seconds

      return () => clearTimeout(timer);
    }
  }, [message, alertType, removeAlert]);

  const handleClose = () => {
    removeAlert();
  };

  return (
    <div className='flex justify-center'>
      {message && alertType && (
        <div className={`w-full text-center md:w-2/3 lg:w-2/3 xl:w-2/3 flex justify-between sm:justify-between mt-8 p-3 rounded border border-[1.5px] border-${alertType} ${alertType === 'primaryGreen' ? 'bg-lightGreen' : alertType === 'primaryOrange' ? 'bg-lightOrange' : 'bg-lightRed'}` }>
          <span>{message}</span>
          <button aria-label="Close alert button" onClick={handleClose}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={`w-6 h-6 text-${alertType}`}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  alert: state.alert
});

const mapDispatchToProps = {
  removeAlert
};

export default connect(mapStateToProps, mapDispatchToProps)(AlertContainer);
