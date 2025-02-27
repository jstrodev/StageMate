// import { createContext, useContext, useState } from 'react';

// const CalendarContext = createContext();

// export const CalendarProvider = ({ children }) => {
//     const [events, setEvents] = useState([]);

//     const addEvent = (event) => {
//         setEvents([...events, event]);
//     };

//     return (
//         <CalendarContext.Provider value={{ events, addEvent }}>
//             {children}
//         </CalendarContext.Provider>
//     );
// };

// export const useCalendar = () => useContext(CalendarContext);
