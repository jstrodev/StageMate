import { useSelector } from "react-redux";
import PropTypes from "prop-types";

const EventModal = ({ isOpen, onClose, onSave, selectedDate }) => {
  const prospects = useSelector((state) => state.prospects.prospects);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-lg font-semibold mb-4">
          Add Event for {selectedDate.toLocaleDateString()}
        </h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Prospect
          </label>
          <select
            className="w-full border rounded-md p-2"
            onChange={(e) => {
              const prospect = prospects.find(p => p.id === e.target.value);
              if (prospect) {
                onSave({
                  prospectId: prospect.id,
                  actName: prospect.actName,
                  date: selectedDate
                });
              }
            }}
            defaultValue=""
          >
            <option value="" disabled>Select a prospect...</option>
            {prospects.map((prospect) => (
              <option key={prospect.id} value={prospect.id}>
                {prospect.actName}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

EventModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  selectedDate: PropTypes.instanceOf(Date).isRequired,
};

export default EventModal; 