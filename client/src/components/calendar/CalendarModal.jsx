import { X } from "lucide-react";
import PropTypes from "prop-types";
import CalendarPage from "../../pages/CalendarPage";

const CalendarModal = ({ isOpen, onClose, selectedProspect }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center overflow-y-auto">
      <div className="bg-white rounded-lg w-[90vw] h-[90vh] relative flex flex-col">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">
            Add {selectedProspect?.actName} to Calendar
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto">
          <CalendarPage 
            isModal={true} 
            selectedProspect={selectedProspect} 
            onEventAdded={() => {
              onClose();
            }}
          />
        </div>
      </div>
    </div>
  );
};

CalendarModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedProspect: PropTypes.object,
};

export default CalendarModal; 