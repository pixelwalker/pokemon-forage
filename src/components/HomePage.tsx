import React, { useEffect, useState } from 'react';
// Importing necessary modules and hooks from React
import { PokemonClient, NamedAPIResource } from 'pokenode-ts';
// Importing API client and types from pokenode-ts
import PokemonList from '../components/PokemonList';
// Importing the PokemonList component

// Extending NamedAPIResource interface to include additional properties
interface PokemonWithDetails extends NamedAPIResource {
  imageUrl: string;
  types: string[];
}

const HomePage: React.FC = () => {
  // State to manage categorized Pokémon
  const [categorizedPokemon, setCategorizedPokemon] = useState<{ [type: string]: PokemonWithDetails[] }>({});
  // State to manage the search term input
  const [searchTerm, setSearchTerm] = useState('');
  // State to manage the list of favorite Pokémon
  const [favourites, setFavourites] = useState<string[]>([]);

  // useEffect to fetch Pokémon data on component mount
  useEffect(() => {
    const fetchPokemon = async () => {
      const api = new PokemonClient();
      // Fetch the list of Pokémon
      const response = await api.listPokemons(0, 151);
      const allPokemon = response.results;
      const detailedPokemonList = [];

      // Fetch detailed information in batches of 20 Pokémon
      for (let i = 0; i < allPokemon.length; i += 20) {
        const batch = allPokemon.slice(i, i + 20);
        const batchDetails = await Promise.all(
          batch.map(async (pokemon) => {
            const details = await api.getPokemonByName(pokemon.name);
            return {
              ...pokemon,
              imageUrl: details.sprites.front_default || '',
              types: details.types.map(typeInfo => typeInfo.type.name),
            };
          })
        );
        detailedPokemonList.push(...batchDetails);
  
        // Categorize Pokémon by their types
        const categorized = detailedPokemonList.reduce((acc, pokemon) => {
          pokemon.types.forEach(type => {
            if (!acc[type]) acc[type] = [];
            acc[type].push(pokemon);
          });
          return acc;
        }, {} as { [type: string]: PokemonWithDetails[] });

        // Update state with categorized Pokémon
        setCategorizedPokemon(categorized);

        // Sleep for 1 second after each batch to avoid API rate limits
        if (i + 20 < allPokemon.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    };
    fetchPokemon();
  }, []);

  // useEffect to fetch favorite Pokémon from localStorage on component mount
  useEffect(() => {
    const favs = localStorage.getItem('favourites');
    if (favs) {
      setFavourites(JSON.parse(favs));
    }
  }, []);

  // Handler for updating the search term
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Handler for adding/removing Pokémon from favorites
  const handleFavourite = (name: string) => {
    let updatedFavourites;
    if (favourites.includes(name)) {
      updatedFavourites = favourites.filter(fav => fav !== name);
    } else {
      updatedFavourites = [...favourites, name];
    }
    setFavourites(updatedFavourites);
    localStorage.setItem('favourites', JSON.stringify(updatedFavourites));
  };

  return (
    <div className="p-4">
      {/* Input field for searching Pokémon */}
      <input
        type="text"
        placeholder="Search Pokémon"
        value={searchTerm}
        onChange={handleSearch}
        className="w-full p-2 mb-4 border rounded"
      />
      {/* PokemonList component for displaying categorized Pokémon */}
      <PokemonList
        categorizedPokemon={categorizedPokemon}
        searchTerm={searchTerm}
        favourites={favourites}
        handleFavourite={handleFavourite}
      />
    </div>
  );
};

export default HomePage;
