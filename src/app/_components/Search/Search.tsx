"use client";
import { useState } from "react";
import { GoogleMap, LoadScriptNext, MarkerF } from "@react-google-maps/api";
import Image from "next/image";

type Gym = {
  name: string;
  address: string;
  rating: number;
  userRatingsTotal: number;
  placeId: string;
  website?: string;
  lat?: number;
  lng?: number;
  photoUrl?: string;
};

const SearchPage = () => {
  const [searchResults, setSearchResults] = useState<Gym[]>([]);
  const [city, setCity] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const mapContainerStyle = {
    width: "100%",
    height: "400px",
  };

  const defaultCenter = {
    lat: searchResults.length > 0 ? searchResults[0].lat || 47.6062 : 47.6062,
    lng:
      searchResults.length > 0 ? searchResults[0].lng || -122.3321 : -122.3321,
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
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && searchResults.length > 0 && (
        <div>
          <LoadScriptNext
            googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY!}
          >
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={defaultCenter}
              zoom={12}
            >
              {searchResults.map(
                (gym) =>
                  gym.lat &&
                  gym.lng && (
                    <MarkerF
                      key={gym.placeId}
                      position={{ lat: gym.lat, lng: gym.lng }}
                      title={gym.name}
                    />
                  )
              )}
            </GoogleMap>
          </LoadScriptNext>

          <div className="results">
            {searchResults.map((gym) => (
              <div key={gym.placeId} className="gym-tile">
                {gym.photoUrl && (
                  <Image
                    src={gym.photoUrl}
                    alt={gym.name}
                    width={400}
                    height={300}
                    layout="responsive"
                    objectFit="cover"
                  />
                )}
                <h2>{gym.name}</h2>
                <p>{gym.address}</p>
                <p>
                  Rating: {gym.rating} ({gym.userRatingsTotal} reviews)
                </p>
                {gym.website && (
                  <a
                    href={gym.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit Website
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
