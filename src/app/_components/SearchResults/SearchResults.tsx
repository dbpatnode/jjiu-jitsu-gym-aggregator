import Tile from "@/components/Tile/Tile";
import { Gym } from "@/types/shared";

type SearchResultsProps = {
  gyms: Gym[];
};

const SearchResults = ({ gyms }: SearchResultsProps) => {
  return (
    <div className="results">
      {gyms.map((gym) => (
        <Tile key={gym.placeId} gym={gym} />
      ))}
    </div>
  );
};

export default SearchResults;
