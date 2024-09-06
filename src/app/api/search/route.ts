import { NextResponse } from "next/server";
import axios from "axios";

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

type GooglePlaceResult = {
  name: string;
  formatted_address: string;
  rating: number;
  user_ratings_total: number;
  place_id: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  photos?: { photo_reference: string }[];
  website?: string;
};

export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city") || "Seattle";
  const apiKey = process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    console.error("Google API key is missing.");
    return NextResponse.json(
      { error: "Google API key is missing." },
      { status: 500 }
    );
  }

  const googlePlacesUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=BJJ+gym+in+${city}&key=${apiKey}`;

  try {
    console.log("Requesting data from Google Places API:", googlePlacesUrl);
    const response = await axios.get(googlePlacesUrl);

    if (response.data.status !== "OK") {
      console.error(
        "Error from Google Places API:",
        response.data.status,
        response.data.error_message
      );
      return NextResponse.json(
        { error: response.data.status, details: response.data.error_message },
        { status: 500 }
      );
    }

    const basicGyms: Gym[] = response.data.results.map(
      (place: GooglePlaceResult) => ({
        name: place.name,
        address: place.formatted_address,
        rating: place.rating,
        userRatingsTotal: place.user_ratings_total,
        placeId: place.place_id,
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng,
      })
    );

    // Fetch detailed information for each place, including the website and photos
    const detailedGyms = await Promise.all(
      basicGyms.map(async (gym) => {
        try {
          const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${gym.placeId}&fields=name,website,photo&key=${apiKey}`;
          const detailsResponse = await axios.get(detailsUrl);

          if (detailsResponse.data.status === "OK") {
            const placeDetails = detailsResponse.data.result;
            gym.website = placeDetails.website || null;

            // Check if photos are available and grab the first one
            if (placeDetails.photos && placeDetails.photos.length > 0) {
              const photoReference = placeDetails.photos[0].photo_reference;
              gym.photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${apiKey}`;
            }
          }
        } catch (error) {
          console.error(
            `Error fetching details for placeId ${gym.placeId}:`,
            (error as Error).message
          );
        }
        return gym;
      })
    );

    return NextResponse.json({ gyms: detailedGyms });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(
        "Error fetching data from Google Places API:",
        error.message
      );
      return NextResponse.json(
        {
          error: "Error fetching data from Google Places API",
          details: error.message,
        },
        { status: 500 }
      );
    } else {
      console.error(
        "Unknown error fetching data from Google Places API:",
        error
      );
      return NextResponse.json(
        { error: "Unknown error fetching data from Google Places API" },
        { status: 500 }
      );
    }
  }
}
