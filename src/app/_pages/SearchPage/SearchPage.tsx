"use client";
import { useState, useEffect } from "react";
import SearchInput from "@/components/SearchInput/SearchInput";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import Map from "@/components/Map/Map";
import Hero from "@/components/Hero/Hero";
import SearchResults from "@/components/SearchResults/SearchResults";
import { Gym } from "@/types/shared";

const SearchPage = () => {
  const [searchResults, setSearchResults] = useState<Gym[]>([]);
  const [city, setCity] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch gyms based on user location
  useEffect(() => {
    const fetchGymsByLocation = async (latitude: number, longitude: number) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/search?lat=${latitude}&lng=${longitude}`
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setSearchResults(data.gyms);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          fetchGymsByLocation(userLat, userLng);
        },
        (error) => {
          console.error("Error getting user location:", error);
          setError("Unable to fetch location. Please allow location access.");
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/search?city=${city}`);

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setSearchResults(data.gyms);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Hero>
        <div className="gutters mb-20">
          <h1>DOJO DISCOVERER</h1>
          <p>Find a Jiu-Jitsu Gym</p>
          <SearchInput
            city={city}
            setCity={setCity}
            handleSearch={handleSearch}
          />
          <Map gyms={searchResults} setGyms={setSearchResults} />
        </div>
      </Hero>

      {loading && <p>Loading...</p>}
      <ErrorMessage error={error} />

      {!loading && !error && searchResults.length > 0 && (
        <>
          <SearchResults gyms={searchResults} />
        </>
      )}
    </div>
  );
};

export default SearchPage;
