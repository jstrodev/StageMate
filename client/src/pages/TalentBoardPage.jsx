// import { useNavigate } from "react-router-dom";
// import { useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import {
//   removeProspect,
//   updateProspectStatus,
//   updateProspectDecision,
//   setFilters,
// } from "../redux/slices/prospectSlice";
// import DecisionFields from "../components/ui/DecisionFields";
// import { toast } from "sonner";

// const STATUS_OPTIONS = [
//   "All",
//   "New",
//   "Prospect",
//   "Qualified",
//   "Contacted",
//   "Booked",
//   "Completed",
//   "Lost",
// ];
// const DECISION_OPTIONS = [
//   "All",
//   "None",
//   "Rebook",
//   "Do Not Rebook",
//   "Undecided",
// ];

// const TalentBoardPage = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const prospects = useSelector((state) => state.prospects.prospects);
//   const filters = useSelector((state) => state.prospects.filters);

//   // State to track which prospects are in the calendar
//   const [calendarProspects, setCalendarProspects] = useState({});

//   const handleRemoveProspect = (prospectId) => {
//     dispatch(removeProspect(prospectId));
//     toast.success("Prospect removed");
//     navigate("/search");
//   };

//   const handleStatusChange = (prospectId, newStatus) => {
//     dispatch(updateProspectStatus({ id: prospectId, status: newStatus }));
//     toast.success("Status updated");
//   };

//   const handleDecisionChange = (prospectId, newDecision) => {
//     dispatch(updateProspectDecision({ id: prospectId, decision: newDecision }));
//     toast.success("Decision updated");
//   };

//   const toggleCalendarStatus = (prospectId) => {
//     setCalendarProspects((prev) => ({
//       ...prev,
//       [prospectId]: !prev[prospectId],
//     }));

//     const actionText = calendarProspects[prospectId]
//       ? "removed from"
//       : "added to";
//     toast.success(`Prospect ${actionText} calendar`);
//   };

//   const filteredProspects = prospects.filter((prospect) => {
//     const statusMatch =
//       filters.status === "All" || prospect.status === filters.status;
//     const decisionMatch =
//       filters.decision === "All" || prospect.decision === filters.decision;
//     return statusMatch && decisionMatch;
//   });

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">Talent Board</h1>

//       {/* Filter Controls */}
//       <div className="mb-6 flex gap-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700">
//             Filter by Status
//           </label>
//           <select
//             value={filters.status}
//             onChange={(e) =>
//               dispatch(setFilters({ ...filters, status: e.target.value }))
//             }
//             className="mt-1 block w-full rounded-md border border-gray-300 p-2"
//           >
//             {STATUS_OPTIONS.map((option) => (
//               <option key={option} value={option}>
//                 {option}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700">
//             Filter by Decision
//           </label>
//           <select
//             value={filters.decision}
//             onChange={(e) =>
//               dispatch(setFilters({ ...filters, decision: e.target.value }))
//             }
//             className="mt-1 block w-full rounded-md border border-gray-300 p-2"
//           >
//             {DECISION_OPTIONS.map((option) => (
//               <option key={option} value={option}>
//                 {option}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//         {filteredProspects.map((prospect) => (
//           <div key={prospect.id} className="card border p-4 mb-4">
//             <h2 className="text-xl font-semibold">{prospect.actName}</h2>
//             <p className="text-sm text-gray-600">{prospect.genre}</p>
//             <p>
//               <strong>Location:</strong> {prospect.homebase}
//             </p>
//             <p>
//               <strong>Venue Capacity:</strong> {prospect.averageVenueCapacity}
//             </p>
//             <p>
//               <strong>Agent:</strong> {prospect.agent}
//             </p>
//             <p>
//               <strong>Agency:</strong> {prospect.agency}
//             </p>

//             <div className="mt-4">
//               <DecisionFields
//                 status={prospect.status}
//                 setStatus={(newStatus) =>
//                   handleStatusChange(prospect.id, newStatus)
//                 }
//                 decision={prospect.decision}
//                 setDecision={(newDecision) =>
//                   handleDecisionChange(prospect.id, newDecision)
//                 }
//               />
//             </div>

//             {/* Remove Prospect Button */}
//             <button
//               onClick={() => handleRemoveProspect(prospect.id)}
//               className="w-full mt-4 py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium shadow-sm"
//             >
//               Remove Prospect
//             </button>

//             {/* Add/Remove from Calendar Button */}
//             <button
//               onClick={() => toggleCalendarStatus(prospect.id)}
//               className={`w-full mt-2 py-2 px-4 rounded-md transition-colors font-medium shadow-sm ${
//                 calendarProspects[prospect.id]
//                   ? "bg-gray-600 text-white hover:bg-gray-700"
//                   : "bg-blue-600 text-white hover:bg-green-700"
//               }`}
//             >
//               {calendarProspects[prospect.id] ? "Remove from Calendar" : "Add to Calendar"}
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default TalentBoardPage;
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";  
import {
  removeProspect,
  updateProspectStatus,
  updateProspectDecision,
  setFilters,
} from "../redux/slices/prospectSlice";
import { addEvent } from "../redux/slices/eventSlice"; // ✅ Import addEvent from eventSlice
import { toast } from "sonner";
import EventModal from "../components/calendar/EventModal";

const STATUS_OPTIONS = ["All", "New", "Prospect", "Qualified", "Contacted", "Booked", "Completed", "Lost"];
const DECISION_OPTIONS = ["All", "None", "Rebook", "Do Not Rebook", "Undecided"];

const TalentBoardPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();  
  const prospects = useSelector((state) => state.prospects.prospects);
  const filters = useSelector((state) => state.prospects.filters);
  
  // State for calendar modal
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedProspect, setSelectedProspect] = useState(null);

  const handleRemoveProspect = (prospectId) => {
    dispatch(removeProspect(prospectId));
    toast.success("Prospect removed");
    navigate("/search");  
  };

  const handleStatusChange = (prospectId, newStatus) => {
    dispatch(updateProspectStatus({ id: prospectId, status: newStatus }));
    toast.success("Status updated");
  };

  const handleDecisionChange = (prospectId, newDecision) => {
    dispatch(updateProspectDecision({ id: prospectId, decision: newDecision }));
    toast.success("Decision updated");
  };

  // ✅ Open Calendar Modal
  const handleOpenCalendarModal = (prospect) => {
    setSelectedProspect(prospect);
    setIsCalendarOpen(true);
  };

  // ✅ Save prospect to calendar and navigate to Calendar Page
  const handleSaveToCalendar = (eventData) => {
    if (!selectedProspect) return;

    dispatch(
      addEvent({
        prospectId: selectedProspect.id,
        actName: selectedProspect.actName,
        date: eventData.date, // User-selected date from EventModal
      })
    );

    toast.success(`${selectedProspect.actName} added to calendar on ${eventData.date}`);
    setIsCalendarOpen(false);
    navigate("/calendar");  // ✅ Redirect to calendar page after adding
  };

  // Filter prospects
  const filteredProspects = prospects.filter((prospect) => {
    const statusMatch = filters.status === "All" || prospect.status === filters.status;
    const decisionMatch = filters.decision === "All" || prospect.decision === filters.decision;
    return statusMatch && decisionMatch;
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Talent Board</h1>

      {/* Filters */}
      <div className="mb-6 flex gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Filter by Status</label>
          <select
            value={filters.status}
            onChange={(e) => dispatch(setFilters({ ...filters, status: e.target.value }))}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Filter by Decision</label>
          <select
            value={filters.decision}
            onChange={(e) => dispatch(setFilters({ ...filters, decision: e.target.value }))}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
          >
            {DECISION_OPTIONS.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Talent Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProspects.map((prospect) => (
          <div key={prospect.id} className="border p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">{prospect.actName}</h2>
            <p className="text-sm text-gray-600">{prospect.genre}</p>
            <p><strong>Location:</strong> {prospect.homebase}</p>
            <p><strong>Venue Capacity:</strong> {prospect.averageVenueCapacity}</p>
            <p><strong>Agent:</strong> {prospect.agent}</p>
            <p><strong>Agency:</strong> {prospect.agency}</p>

            {/* Status & Decision */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select 
                value={prospect.status} 
                onChange={(e) => handleStatusChange(prospect.id, e.target.value)}
                className="border p-2 rounded-md w-full"
              >
                {STATUS_OPTIONS.slice(1).map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            {/* Remove Prospect */}
            <button
              onClick={() => handleRemoveProspect(prospect.id)}
              className="w-full mt-4 py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Remove Prospect
            </button>

            {/* ✅ Add to Calendar Button (opens modal) */}
            <button
              onClick={() => handleOpenCalendarModal(prospect)}
              className="w-full mt-2 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add to Calendar
            </button>
          </div>
        ))}
      </div>

      {/* ✅ Calendar Modal */}
      <EventModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        onSave={handleSaveToCalendar}
        selectedDate={new Date()}
      />
    </div>
  );
};

export default TalentBoardPage;
