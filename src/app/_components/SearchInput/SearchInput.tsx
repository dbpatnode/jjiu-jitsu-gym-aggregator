// components/SearchInput.tsx
type SearchInputProps = {
  city: string;
  setCity: (value: string) => void;
  handleSearch: () => void;
};

const SearchInput = ({ city, setCity, handleSearch }: SearchInputProps) => {
  return (
    <div>
      <input
        placeholder="City"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default SearchInput;
