import PropTypes from "prop-types";

const STATUS_OPTIONS = [
  "New",
  "Prospect",
  "Qualified",
  "Contacted",
  "Booked",
  "Completed",
  "Lost",
];

const DECISION_OPTIONS = ["None", "Rebook", "Do Not Rebook", "Undecided"];

const DecisionFields = ({ status, setStatus, decision, setDecision }) => {
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Status
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
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
          Decision
        </label>
        <select
          value={decision}
          onChange={(e) => setDecision(e.target.value)}
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
  );
};

DecisionFields.propTypes = {
  status: PropTypes.string.isRequired,
  setStatus: PropTypes.func.isRequired,
  decision: PropTypes.string.isRequired,
  setDecision: PropTypes.func.isRequired,
};

export default DecisionFields;
