import React, { useState, useCallback } from 'react';
import BookingDTO from './BookingDTO';
import './App.css'; // Import your CSS file for styling

const ConferenceRoomBookingScreen = () => {
  const [currentDate] = useState(new Date());
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [headcount, setHeadcount] = useState('');
  const [isRoomAvailable, setIsRoomAvailable] = useState(false);

  const setStartTimeOptions = useCallback(() => {
    const currentHour = new Date().getHours();
    const currentMinute = new Date().getMinutes();

    const timeOptions = [];
    for (let hour = currentHour; hour < 24; hour++) {
      let startMinute = 0;
      if (hour === currentHour) {
        startMinute = Math.ceil(currentMinute / 15) * 15; // Round up to the nearest 15 minutes
      }

      for (let minute = startMinute; minute < 60; minute += 15) {
        const formattedHour = hour.toString().padStart(2, '0');
        const formattedMinute = minute.toString().padStart(2, '0');
        const time = `${formattedHour}.${formattedMinute}`;
        timeOptions.push(time);
      }
    }

    return timeOptions;
  }, []);

  const setEndTimeOptions = useCallback(
    (selectedStartTime) => {
      if (!selectedStartTime) {
        return [];
      }

      const [selectedHour, selectedMinute] = selectedStartTime.split('.').map(Number);

      const endOptions = [];
      for (let hour = selectedHour; hour < 24; hour++) {
        let startMinute = 0;
        if (hour === selectedHour) {
          startMinute = selectedMinute + 15; // Set start minute for the selected hour
        }

        for (let minute = startMinute; minute < 60; minute += 15) {
          const formattedHour = hour.toString().padStart(2, '0');
          const formattedMinute = minute.toString().padStart(2, '0');
          const time = `${formattedHour}.${formattedMinute}`;
          endOptions.push(time);
        }
      }

      return endOptions;
    },
    []
  );

  const handleStartTimeChange = (time) => {
    setStartTime(time);
    setEndTimeOptions(time); // Update end time options based on the selected start time
  };

  const handleHeadcountChange = (value) => {
    const newHeadcount = Math.max(1, parseInt(value, 10) || 1);
    setHeadcount(newHeadcount);
  };

  const resetFields = () => {
    setStartTime('');
    setEndTime('');
    setHeadcount('');
    setIsRoomAvailable(false);
  };

  const isBookingEnabled = startTime && endTime && headcount;

  const checkBooking = async () => {
    try {
      const bookingDTO = new BookingDTO(startTime, endTime, headcount, false); // Set isCreate to false initially
      const combinedStartDate = combineDateTime(currentDate, startTime);
      const combinedEndDate = combineDateTime(currentDate, endTime);
      bookingDTO.startDateTime = combinedStartDate;
      bookingDTO.endDateTime = combinedEndDate;

      const response = await fetch('https://conference-scheduler.onrender.com/api/bookings/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingDTO),
      });

      const result = await response.json(); // Assuming the response is in JSON format
      console.log(result);
      

      // Modify the response to include isRoomAvailable and a message
      const { roomAvailable, message } = result;
      
      setIsRoomAvailable(roomAvailable);
    
      if (roomAvailable) {
        alert(message);
        console.log('Room is available:', message);
      
      } else {
        alert(message);
        console.log('Room is not available:', message);
      }
    } catch (error) {
      console.error('Error checking booking:', error);
    }
  };

  const createBooking = async () => {
    try {
      const bookingDTO = new BookingDTO(startTime, endTime, headcount,true);
      const combinedStartDate = combineDateTime(currentDate, startTime);
      const combinedEndDate = combineDateTime(currentDate, endTime);
      bookingDTO.startDateTime = combinedStartDate;
      bookingDTO.endDateTime = combinedEndDate;

      const response = await fetch('https://conference-scheduler.onrender.com/api/bookings/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingDTO),
      });

      const result = await response.json();
      console.log(result);
      console.log(result.message);

      const { message } = result;
      alert(message);
      resetFields();
    } catch (error) {
      console.error('Error creating booking:', error);
    }
  };

  const combineDateTime = (date, time) => {
    const [hours, minutes] = time.split('.').map(Number);
    const combinedDate = new Date(date);
    combinedDate.setHours(hours, minutes, 0, 0);

    // Adjust the combined date-time to the desired time zone or offset
    const timeZoneOffsetInMinutes = combinedDate.getTimezoneOffset();
    const adjustedDate = new Date(combinedDate.getTime() - timeZoneOffsetInMinutes * 60000);

    return adjustedDate.toISOString();
  };


  return (
    <div className="conference-room-booking-screen">
      <div className="box">
        <h2>Conference Room Booking</h2>
        <div className="container">
          <div className="current-day">
            <h3>{currentDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })} </h3>
          </div>
          <div className="time-picker-section">
            <h2>Select Time</h2>
            <div className="time-selectors">
              <div className="time-selector">
                <label>Start Time:</label>
                <select value={startTime} onChange={(e) => handleStartTimeChange(e.target.value)}>
                  <option value="">Select Time</option>
                  {(setStartTimeOptions() || []).map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
              <div className="time-selector">
                <label>End Time:</label>
                <select value={endTime} onChange={(e) => setEndTime(e.target.value)} disabled={!startTime}>
                  <option value="">Select Time</option>
                  {(setEndTimeOptions(startTime) || []).map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="headcount-section">
            <h2 style={{ color: 'black' }}>Headcount</h2>

            <input
              type="number"
              value={headcount}
              onChange={(e) => handleHeadcountChange(e.target.value)}
              placeholder="Enter Headcount"
            />
          </div>
          <div className="button-section">
            <button onClick={checkBooking} disabled={!isBookingEnabled}>
              Check Booking
            </button>
            <button onClick={createBooking} disabled={!isRoomAvailable || !isBookingEnabled}>
              Create Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConferenceRoomBookingScreen;
