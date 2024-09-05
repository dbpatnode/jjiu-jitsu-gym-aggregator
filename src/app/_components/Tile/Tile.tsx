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

type TileProps = {
  gym: Gym;
};

const Tile = ({ gym }: TileProps) => (
  <div className="gym-tile">
    <img
      src={gym.pagemap?.cse_image?.[0]?.src || "/default-gym.jpg"}
      alt={gym.title}
    />
    <h2>{gym.title}</h2>
    <p>{gym.snippet}</p>
    {gym.classTimes && (
      <div>
        <strong>Class Times:</strong>
        <ul>
          {Object.entries(gym.classTimes).map(([time, value]) => (
            <li key={time}>{`${
              time.charAt(0).toUpperCase() + time.slice(1)
            }: ${value}`}</li>
          ))}
        </ul>
      </div>
    )}
    <a href={gym.link} target="_blank" rel="noopener noreferrer">
      Visit Website
    </a>
  </div>
);

export default Tile;
