"use client";
import { useState } from "react";
import GymTile from "@/components/Tile/Tile"; // Ensure this path is correct

type Gym = {
  link: string;
  title: string;
  snippet: string;
  pagemap?: {
    cse_image?: { src: string }[];
  };
  classTimes?: {
    morning: string;
    afternoon: string;
    evening: string;
  };
};

const SearchPage = () => {
  const [searchResults, setSearchResults] = useState<Gym[]>([]);
  const [city, setCity] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null); // State for managing errors

  const handleSearch = async () => {
    setLoading(true);
    setError(null); // Clear any previous errors

    try {
      const response = await fetch(`/api/search?city=${city}`);

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setSearchResults(data.gyms);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Find a Jiu-Jitsu Gym</h1>
      <input
        placeholder="City"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}{" "}
      {/* Display error if any */}
      {!loading && !error && (
        <div className="results">
          {searchResults.map((gym, index) => (
            <GymTile key={index} gym={gym} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
