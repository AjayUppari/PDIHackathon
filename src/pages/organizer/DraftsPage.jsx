import { useEffect, useState } from "react";
import DraftsList from "../../components/organizer/DraftsList";
import Navbar from "../../components/Navbar";

function DraftsPage() {
  const [draftsData, setDraftsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDraftsData = async () => {
      try {
        const response = await fetch("http://localhost:5000/getDraftsDataNew");
        if (!response.ok) {
          throw new Error("Failed to fetch drafts data");
        }
        const data = await response.json();
        setDraftsData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDraftsData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p>Loading drafts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <>
      <Navbar userType='organizer' username={JSON.parse(localStorage.getItem("userData")).name}/>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DraftsList drafts={draftsData} />
      </div>
    </>
  );
}

export default DraftsPage;
