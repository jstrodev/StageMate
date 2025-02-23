import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  removeProspect,
  updateProspectStatus,
  updateProspectDecision,
  setFilters,
} from "../redux/slices/prospectSlice";
import DecisionFields from "../components/ui/DecisionFields";
import { toast } from "sonner";

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
  const prospects = useSelector((state) => state.prospects.prospects);
  const filters = useSelector((state) => state.prospects.filters);

  const handleRemoveProspect = (prospectId) => {
    dispatch(removeProspect(prospectId));
    toast.success("Prospect removed");
  };

  const handleStatusChange = (prospectId, newStatus) => {
    dispatch(updateProspectStatus({ id: prospectId, status: newStatus }));
    toast.success("Status updated");
  };

  const handleDecisionChange = (prospectId, newDecision) => {
    dispatch(updateProspectDecision({ id: prospectId, decision: newDecision }));
    toast.success("Decision updated");
  };

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

      {/* Filter Controls */}
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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProspects.map((prospect) => (
          <div key={prospect.id} className="card border p-4 mb-4">
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

            <div className="mt-4">
              <DecisionFields
                status={prospect.status}
                setStatus={(newStatus) =>
                  handleStatusChange(prospect.id, newStatus)
                }
                decision={prospect.decision}
                setDecision={(newDecision) =>
                  handleDecisionChange(prospect.id, newDecision)
                }
              />
            </div>

            <button
              onClick={() => handleRemoveProspect(prospect.id)}
              className="w-full mt-4 py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium shadow-sm"
            >
              Remove Prospect
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TalentBoardPage;
