import React, { useState, useEffect } from 'react';
const TalentBoardPage = () => {
  const [talents, setTalents] = useState([]);
  useEffect(() => {
    // Fetch the talent data from an API or use a predefined schema
    const fetchTalents = async () => {
      try {
        const response = await fetch('https://your-api-endpoint.com/talents');
        const data = await response.json();
        // Filter the data to include only musician artists
        const musicianTalents = data.filter(talent => talent.talent === 'Musician');
        setTalents(musicianTalents);
      } catch (error) {
        console.error('Error fetching talents:', error);
      }
    };
    fetchTalents();
  }, []);
  return (
    <div>
      <h1 className="text-2xl font-bold">Talent Board</h1>
      <div className="talent-board">
        {talents.map((talent) => (
          <div key={talent.id} className="talent-card border p-4 mb-4">
            <h2 className="text-xl font-semibold">{talent.name}</h2>
            <p className="text-sm text-gray-600">{talent.talent}</p>
            <p>{talent.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default TalentBoardPage;