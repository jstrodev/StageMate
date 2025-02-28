const HomePage = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-primary-DEFAULT mb-6">
          Welcome to StageMate
        </h1>
        <p className="text-gray-600 mb-4">
          Your platform for discovering and booking musicians.
        </p>
        <div className="grid gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded">
                <p className="text-sm text-gray-600">Total Musicians: (Number of musicians that match your venue criteria)</p>
                <p className="text-2xl font-bold text-primary-DEFAULT">1000+</p>
              </div>
              <div className="p-4 bg-gray-50 rounded">
                <p className="text-sm text-gray-600">Active Bookings: (Number of bookings that are currently active)</p>
                <p className="text-2xl font-bold text-primary-DEFAULT">50+</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
