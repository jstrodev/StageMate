import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  removeProspect,
  updateProspectStatus,
  updateProspectDecision,
  setFilters,
} from "../redux/slices/prospectSlice";
import { addEvent, removeEvent } from "../redux/slices/eventSlice";
import { toast } from "sonner";
import CalendarModal from "../components/calendar/CalendarModal";

const STATUS_OPTIONS = [
  "All",
  "New",
  "Prospect",
  "Qualified",
  "Contacted",
  "Booked",
  "Completed",
  "Lost",
];
const DECISION_OPTIONS = [
  "All",
  "None",
  "Rebook",
  "Do Not Rebook",
  "Undecided",
];

const TalentBoardPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const prospects = useSelector((state) => state.prospects.prospects);
  const filters = useSelector((state) => state.prospects.filters);
  const events = useSelector((state) => state.events.events);

  // State for calendar modal
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
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

  // Add this function to check if prospect is in calendar
  const isInCalendar = (prospectId) => {
    return events.some((event) => event.prospectId === prospectId);
  };

  // Modify handleOpenCalendarModal to handle both add and remove
  const handleOpenCalendarModal = (prospect) => {
    if (isInCalendar(prospect.id)) {
      // Remove from calendar
      if (window.confirm(`Remove ${prospect.actName} from calendar?`)) {
        dispatch(removeEvent(prospect.id));
        toast.success(`${prospect.actName} removed from calendar`);
      }
    } else {
      // Add to calendar
      setSelectedProspect(prospect);
      setIsCalendarModalOpen(true);
    }
  };

  // Filter prospects
  const filteredProspects = prospects.filter((prospect) => {
    const statusMatch =
      filters.status === "All" || prospect.status === filters.status;
    const decisionMatch =
      filters.decision === "All" || prospect.decision === filters.decision;
    return statusMatch && decisionMatch;
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Talent Board</h1>

      {/* Filters */}
      <div className="mb-6 flex gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Filter by Status
          </label>
          <select
            value={filters.status}
            onChange={(e) =>
              dispatch(setFilters({ ...filters, status: e.target.value }))
            }
            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Filter by Decision
          </label>
          <select
            value={filters.decision}
            onChange={(e) =>
              dispatch(setFilters({ ...filters, decision: e.target.value }))
            }
            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
          >
            {DECISION_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
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
            <p>
              <strong>Location:</strong> {prospect.homebase}
            </p>
            <p>
              <strong>Venue Capacity:</strong> {prospect.averageVenueCapacity}
            </p>
            <p>
              <strong>Agent:</strong> {prospect.agent}
            </p>
            <p>
              <strong>Agency:</strong> {prospect.agency}
            </p>

            {/* Status & Decision Fields */}
            <div className="mt-4 space-y-3">
              {/* Status Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  value={prospect.status || "New"}
                  onChange={(e) =>
                    handleStatusChange(prospect.id, e.target.value)
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                >
                  {STATUS_OPTIONS.slice(1).map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              {/* Decision Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Decision
                </label>
                <select
                  value={prospect.decision || "None"}
                  onChange={(e) =>
                    handleDecisionChange(prospect.id, e.target.value)
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                >
                  {DECISION_OPTIONS.slice(1).map((decision) => (
                    <option key={decision} value={decision}>
                      {decision}
                    </option>
                  ))}
                </select>
              </div>
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
              className={`w-full mt-2 py-2 px-4 ${
                isInCalendar(prospect.id)
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white rounded-md`}
            >
              {isInCalendar(prospect.id)
                ? "Remove from Calendar"
                : "Add to Calendar"}
            </button>
          </div>
        ))}
      </div>

      {/* ✅ Calendar Modal */}
      <CalendarModal
        isOpen={isCalendarModalOpen}
        onClose={() => setIsCalendarModalOpen(false)}
        selectedProspect={selectedProspect}
      />
    </div>
  );
};

export default TalentBoardPage;
