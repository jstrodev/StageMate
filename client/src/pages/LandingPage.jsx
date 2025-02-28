import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex">
      {/* Left side with background image */}
      <div
        className="w-1/2 bg-cover bg-center"
        style={{ backgroundImage: 'url("/StageMateLogo.png")' }}
      >
        <div className="h-full w-full bg-black bg-opacity-30"></div>
      </div>

      {/* Right side with content */}
      <div className="w-1/2 flex flex-col justify-center items-center px-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          <span className="block text-primary-DEFAULT mb-4">StageMate</span>
        </h1>

        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          <span className="block text-primary-DEFAULT mb-4">Create memorable patron experiences</span>
        </h1>

        {/* Three statements */}
        <div className="grid grid-cols-3 gap-8 mb-12 w-full">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-primary-DEFAULT mb-2">
              Book Smarter
            </h3>
            <p className="text-gray-600 text-sm">
              Book the perfect talent for your venue
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold text-primary-DEFAULT mb-2">
              Manage Talent
            </h3>
            <p className="text-gray-600 text-sm">
              Streamline the talent management process
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold text-primary-DEFAULT mb-2">
              Track Performance
            </h3>
            <p className="text-gray-600 text-sm">
              Track the success of your talent
            </p>
          </div>
        </div>

        {/* Sign Up Button */}
        <button
          onClick={() => navigate("/auth")}
          className="bg-[#2196f3] text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-[#1976d2] transition-colors w-48"
        >
          Sign Up Now
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
