import React, { useState } from 'react';
import { Calendar, momentLocalizer, BigCalendar } from 'react-big-calendar';
import moment from 'moment';
import CalendarEvents from './CalendarEvents';
import { useEffect } from 'react';
import AddCalendarEvent from '../CalendarEvents/AddCalendarEvent';
import { BsCalendarPlus } from 'react-icons/bs';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser } from '../../../redux/user';
import axios from 'axios';
import { selectEvents } from '../../../redux/calendar';
import './calendarStyles.css';

const teamCalendar = (props) => {
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [teamCodes, setTeamCodes] = useState([]);
  const [calendarData, setCalendarData] = useState();

  const { calendar } = useSelector(selectEvents);
  const { user } = useSelector(selectUser);

  const localizer = momentLocalizer(moment);
  var currentTime = new Date();
  const currentYear = currentTime.getFullYear();
  const currentDay = currentTime.getDay();
  const currentMonth = currentTime.getMonth();

  useEffect(() => {
    setCalendarEvents(CalendarEvents);
  }, [CalendarEvents]);

  // GET TEAM CALENDAR EVENTS
  const getCalendarEvents = () => {
    const teamArray = [];

    const getTeamCodes = user.teams.map((team, index) => {
      // teamArray.push(team.teamCode);
      teamArray.push(
        `http://localhost:3000/api/getCalendarEvents/${team.teamCode}`
      );
    });

    var newArray = teamArray.filter(function (elem, pos) {
      return teamArray.indexOf(elem) == pos;
    });
    setTeamCodes(newArray);

    fetchEventForTeam(teamArray);
  };

  const fetchEventForTeam = async (teamArray) => {
    let allEvents = [];
    const request = await axios
      .all(teamArray.map((endpoint) => axios.get(endpoint)))
      .then((data) =>
        data.map((team, index) => {
          allEvents.push(team.data.data);
        })
      );
    allEvents = allEvents.flat();
    setCalendarData(allEvents);
  };

  useEffect(() => {
    getCalendarEvents();
  }, [user]);

  useEffect(() => {
    console.log(calendarData);
  }, [calendarData]);

  return (
    <div>
      <div className="">
        {calendarData && (
          <Calendar
            selectable
            localizer={localizer}
            startAccessor="start"
            endAccessor="end"
            events={calendarData}
            style={{ height: 500 }}
            step={60}
            defaultDate={new Date(currentYear, currentMonth, currentDay)}
            // eventPropGetter={(event) => {
            // 	const backgroundColor = event.allday ? 'yellow' : 'blue';
            // 	return {style: {backgroundColor}}
            // }}
          />
        )}
        {showModal && (
          <AddCalendarEvent
            fetchEvents={getCalendarEvents}
            show={showModal}
            allEvents={calendarData}
          />
        )}
        {showModal && (
          <button
            onClick={() => setShowModal(!showModal)}
            className="z-50 absolute top-20 right-96 bg-red-500 p-4 rounded-xl text-white"
          >
            Close
          </button>
        )}
      </div>
      <div className="w-40  mt-10 text-sm text-white bg-lightBlue p-2 rounded-lg flex flex-row text-center items-center justify-center">
        <button
          className="flex flex-row justify-around flex flex-row text-center items-center"
          onClick={() => setShowModal(!showModal)}
        >
          <BsCalendarPlus className="mr-4" />
          Add New Event
        </button>
      </div>
    </div>
  );
};

export default teamCalendar;
