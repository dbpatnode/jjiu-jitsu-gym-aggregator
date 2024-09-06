// components/Tile.tsx
import Image from "next/image";
import { Gym } from "@/types/shared";

type TileProps = {
  gym: Gym;
};

const Tile = ({ gym }: TileProps) => {
  return (
    <div className="gym-tile">
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
        <a href={gym.website} target="_blank" rel="noopener noreferrer">
          Visit Website
        </a>
      )}
    </div>
  );
};

export default Tile;
