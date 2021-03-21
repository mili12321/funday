import React, { useState, useEffect } from "react";
import axios from "axios";

export function Filter() {
    const [countries, setCountries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [filteredCountries, setFilteredCountries] = useState([]);

    useEffect(() => {
        setLoading(true);
        axios
          .get("https://restcountries.eu/rest/v2/all")
          .then((res) => {
            setCountries(res.data);
            setLoading(false);
          })
          .catch((err) => {
            console.log(err);
          });
    }, []);


    useEffect(() => {
      setFilteredCountries(
        countries.filter((country) =>
          country.name.toLowerCase().includes(search.toLowerCase())
        )
      );
    }, [search, countries]);
    
    if (loading) {
      return <p>Loading countries...</p>;
    }

    return (
        <div className="search">
            <input
                type="text"
                placeholder="Search Countries"
                onChange={(e) => setSearch(e.target.value)}
            />
            {filteredCountries.map((country, idx) => (
                <>
                <p  key={idx}>
                  <img src={country.flag} alt={country.name} style={{ width: "20px", height: "20px" }} />
                </p>
                <p>{country.name}</p>
              </>
            ))}
        </div>
    )
}
