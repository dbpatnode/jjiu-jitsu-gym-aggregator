import { useState, useEffect } from "react";
import {
  GoogleMap,
  LoadScriptNext,
  MarkerF,
  InfoWindow,
} from "@react-google-maps/api";
import { Gym } from "@/types/shared";

type MapProps = {
  gyms: Gym[];
  setGyms: (gyms: Gym[]) => void;
};

const Map = ({ gyms, setGyms }: MapProps) => {
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [selectedGym, setSelectedGym] = useState<Gym | null>(null);

  const mapContainerStyle = {
    width: "100%",
    height: "600px",
  };

  const defaultCenter = userLocation || { lat: 50.7128, lng: -84.006 };

  useEffect(() => {
    const fetchGyms = async (latitude: number, longitude: number) => {
      try {
        const response = await fetch(
          `/api/search?lat=${latitude}&lng=${longitude}`
        );
        if (response.ok) {
          const data = await response.json();
          setGyms(data.gyms);
        } else {
          console.error("Failed to fetch gyms:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching gyms for user location:", error);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;

          setUserLocation({ lat: userLat, lng: userLng });
          fetchGyms(userLat, userLng);
        },
        (error) => {
          console.error("Error getting user location:", error);
          fetchGyms(50.7128, -84.006);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      fetchGyms(50.7128, -84.006);
    }
  }, [setGyms]);

  return (
    <LoadScriptNext googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY!}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={defaultCenter}
        zoom={12}
      >
        {gyms.map((gym) => (
          <MarkerF
            key={gym.placeId}
            position={{ lat: gym.lat!, lng: gym.lng! }} // Add non-null assertion to prevent type errors
            title={gym.name}
            onClick={() => setSelectedGym(gym)}
          />
        ))}

        {/* Display InfoWindow when a gym is selected */}
        {selectedGym &&
          selectedGym.lat !== undefined &&
          selectedGym.lng !== undefined && (
            <InfoWindow
              position={{ lat: selectedGym.lat!, lng: selectedGym.lng! }}
              onCloseClick={() => setSelectedGym(null)}
            >
              <div>
                <h4>{selectedGym.name}</h4>
                <p>{selectedGym.address}</p>
                <p>
                  Rating: {selectedGym.rating} ({selectedGym.userRatingsTotal}{" "}
                  reviews)
                </p>
                {selectedGym.website && (
                  <a
                    href={selectedGym.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit Website
                  </a>
                )}
              </div>
            </InfoWindow>
          )}
      </GoogleMap>
    </LoadScriptNext>
  );
};

export default Map;
