import { NextResponse } from "next/server";
import axios from "axios";
import cheerio from "cheerio";

type ClassTimes = {
  morning: string;
  afternoon: string;
  evening: string;
};

type Gym = {
  link: string;
  title: string;
  snippet: string;
  pagemap?: {
    cse_image?: { src: string }[];
  };
  classTimes?: ClassTimes;
};

const excludedDomains = [
  "yelp.com",
  "reddit.com",
  "blogspot.com",
  "wordpress.com",
  "bjjglobetrotters.com",
];

// Function to check if the gym result is relevant
function isRelevantResult(gym: Gym): boolean {
  try {
    const url = new URL(gym.link);
    return !excludedDomains.includes(url.hostname);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(
        "Error parsing URL in isRelevantResult:",
        gym.link,
        error.message
      );
    } else {
      console.error(
        "Unknown error parsing URL in isRelevantResult:",
        gym.link,
        error
      );
    }
    return false; // Exclude the result if the URL is invalid
  }
}

// Function to scrape additional details like class times from the gym website
async function scrapeGymDetails(url: string): Promise<Partial<Gym>> {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const classTimes: ClassTimes = {
      morning: $(".class-times.morning").text() || "",
      afternoon: $(".class-times.afternoon").text() || "",
      evening: $(".class-times.evening").text() || "",
    };

    return { classTimes };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error scraping gym details for URL:", url, error.message);
    } else {
      console.error("Unknown error scraping gym details for URL:", url, error);
    }
    return {};
  }
}

// Main GET handler for the API route
export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city") || "";
  const state = searchParams.get("state") || "";
  const query = searchParams.get("query") || "";
  const gi = searchParams.get("gi") || "";
  const noGi = searchParams.get("noGi") || "";

  // Construct the search query to filter out unwanted results
  const searchQuery = `${query} jiu jitsu gym in ${city}, ${state} ${
    gi ? "gi" : ""
  } ${
    noGi ? "no gi" : ""
  } -site:yelp.com -site:reddit.com -site:blogspot.com -site:wordpress.com -site:bjjglobetrotters.com`;

  try {
    console.log("Executing search with query:", searchQuery);

    // Fetch data from the Google Custom Search API
    const response = await axios.get(
      "https://www.googleapis.com/customsearch/v1",
      {
        params: {
          key: process.env.GOOGLE_API_KEY,
          cx: process.env.GOOGLE_SEARCH_ENGINE_ID,
          q: searchQuery,
        },
      }
    );

    if (!response.data.items) {
      console.error("No items returned from Google API");
      return NextResponse.json({ error: "No results found" }, { status: 404 });
    }

    // Get the gym results from the response and filter out unwanted results
    const gyms: Gym[] = response.data.items;
    const filteredGyms = gyms.filter(isRelevantResult);

    console.log("Filtered gyms count:", filteredGyms.length);

    // Scrape additional details for each relevant gym
    const gymDetailsPromises = filteredGyms.map(async (gym) => {
      try {
        const details = await scrapeGymDetails(gym.link);
        return { ...gym, ...details };
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(
            "Error scraping details for gym:",
            gym.link,
            error.message
          );
        } else {
          console.error(
            "Unknown error scraping details for gym:",
            gym.link,
            error
          );
        }
        return gym; // Return gym without details if scraping fails
      }
    });

    const gymsWithDetails = await Promise.all(gymDetailsPromises);

    // Return the final filtered and enriched list of gyms
    return NextResponse.json({ gyms: gymsWithDetails });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching data from Google API:", error.message);
      return NextResponse.json(
        {
          error: "Error fetching data from Google API",
          details: error.message,
        },
        { status: 500 }
      );
    } else {
      console.error("Unknown error fetching data from Google API:", error);
      return NextResponse.json(
        { error: "Unknown error fetching data from Google API" },
        { status: 500 }
      );
    }
  }
}
