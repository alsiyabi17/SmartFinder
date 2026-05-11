import { Input } from "reactstrap";

function SearchBar({ value, onChange, placeholder }) {
  return (
    <div className="nav-search-container">
      <span className="search-icon">🔍</span>
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Search restaurants..."}
      />
    </div>
  );
}

export default SearchBar;
