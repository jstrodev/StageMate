import { useState, useEffect } from "react";
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  parseISO,
} from "date-fns";
import { ChevronLeft, ChevronRight, CalendarDays, Plus, X } from "lucide-react";
import EventModal from "../components/calendar/EventModal";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { addEvent, removeEvent } from "../redux/slices/eventSlice";
import PropTypes from "prop-types";

const CalendarPage = ({
  isModal = false,
  selectedProspect = null,
  onEventAdded = () => {},
}) => {
  const dispatch = useDispatch();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalDate, setModalDate] = useState(new Date());
  const events = useSelector((state) => state.events.events);

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const handleAddEvent = (date) => {
    if (isModal && selectedProspect) {
      dispatch(
        addEvent({
          prospectId: selectedProspect.id,
          actName: selectedProspect.actName,
          date: date,
        })
      );
      toast.success(`${selectedProspect.actName} added to calendar`);
      onEventAdded();
    } else {
      setModalDate(date);
      setIsModalOpen(true);
    }
  };

  const handleSaveEvent = (eventData) => {
    dispatch(addEvent(eventData));
    setIsModalOpen(false);
    toast.success("Event added successfully");
  };

  const handleDeleteEvent = (eventId, actName) => {
    if (
      window.confirm(
        `Are you sure you want to delete the event for ${actName}?`
      )
    ) {
      dispatch(removeEvent(eventId));
      toast.success("Event deleted successfully");
    }
  };

  const getEventsForDate = (date) => {
    return events.filter((event) =>
      isSameDay(parseISO(event.date.toISOString()), date)
    );
  };

  useEffect(() => {
    // This will trigger a re-render when events change
  }, [events]);

  return (
    <div
      className={`flex flex-col h-full bg-white rounded-lg shadow ${
        isModal ? "" : "min-h-screen"
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-medium">
            {format(currentMonth, "MMMM yyyy")}
          </h2>
          <div className="flex items-center gap-2">
            <button
              className="p-1 hover:bg-gray-100 rounded"
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              className="p-1 hover:bg-gray-100 rounded"
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
        <button
          className="flex items-center px-3 py-1 text-sm border rounded hover:bg-gray-50"
          onClick={() => {
            const today = new Date();
            setSelectedDate(today);
            setCurrentMonth(today);
          }}
        >
          <CalendarDays className="h-4 w-4 mr-2" />
          Today
        </button>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="grid grid-cols-7">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="text-center font-medium text-sm border-b border-r last:border-r-0 h-8 flex items-center justify-center"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="flex-1 grid grid-cols-7 grid-rows-6">
          {daysInMonth.map((date) => {
            const dayEvents = getEventsForDate(date);

            return (
              <div
                key={date.toISOString()}
                className={`border-b border-r last:border-r-0 px-2 py-1 flex flex-col relative group min-h-[100px] ${
                  !isSameMonth(date, currentMonth) ? "bg-gray-50" : ""
                } ${isSameDay(date, selectedDate) ? "bg-blue-50" : ""}`}
              >
                <div className="flex justify-between items-center">
                  <span
                    className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-sm ${
                      isSameDay(date, selectedDate)
                        ? "bg-blue-500 text-white"
                        : ""
                    }`}
                  >
                    {format(date, "d")}
                  </span>
                  <button
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100 rounded"
                    onClick={() => handleAddEvent(date)}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-1 space-y-1 overflow-y-auto">
                  {dayEvents.map((event) => (
                    <div
                      key={event.prospectId}
                      className="text-xs p-1 rounded bg-blue-500/80 text-white group/event relative flex items-center justify-between"
                    >
                      <span className="truncate">{event.actName}</span>
                      <button
                        onClick={() =>
                          handleDeleteEvent(event.prospectId, event.actName)
                        }
                        className="opacity-0 group-hover/event:opacity-100 transition-opacity p-1 hover:bg-red-600 rounded"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEvent}
        selectedDate={modalDate}
      />
    </div>
  );
};

CalendarPage.propTypes = {
  isModal: PropTypes.bool,
  selectedProspect: PropTypes.object,
  onEventAdded: PropTypes.func,
};

export default CalendarPage;
