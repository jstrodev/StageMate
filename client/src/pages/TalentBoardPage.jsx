import { useState, useEffect } from "react";
import DecisionFields from "./auth/DecisionFields";

const TalentBoardPage = () => {
  const [talents, setTalents] = useState([]);
  const [status, setStatus] = useState("");
  const [decision, setDecision] = useState("");

  useEffect(() => {
    const fetchTalents = async () => {
      try {
        const response = await fetch("https://your-api-endpoint.com/talents");
        const data = await response.json();
        const musicianTalents = data.filter(
          (talent) => talent.talent === "Musician"
        );
        setTalents(musicianTalents);
      } catch (error) {
        console.error("Error fetching talents:", error);
      }
    };
    fetchTalents();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Talent Board</h1>
      <DecisionFields
        status={status}
        setStatus={setStatus}
        decision={decision}
        setDecision={setDecision}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {talents.map((talent) => (
          <div key={talent.id} className="card border p-4 mb-4">
            <h2 className="text-xl font-semibold">{talent.name}</h2>
            <p className="text-sm text-gray-600">{talent.talent}</p>
            <p>
              <strong>Location:</strong> {talent.location}
            </p>
            <p>
              <strong>Venue Capacity:</strong> {talent.venueCapacity}
            </p>
            <p>
              <strong>Agent:</strong> {talent.agent}
            </p>
            <p>
              <strong>Agency:</strong> {talent.agency}
            </p>
            <p>
              <strong>Status:</strong> {talent.status}
            </p>
            <p>
              <strong>Review Notes:</strong> {talent.reviewNotes}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TalentBoardPage;
