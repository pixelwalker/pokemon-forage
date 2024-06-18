import React, { useEffect, useState } from 'react';
import { PokemonClient, NamedAPIResource } from 'pokenode-ts';
import PokemonList from '../components/PokemonList';

interface PokemonWithDetails extends NamedAPIResource {
  imageUrl: string;
  types: string[];
}

const HomePage: React.FC = () => {
  const [categorizedPokemon, setCategorizedPokemon] = useState<{ [type: string]: PokemonWithDetails[] }>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [favourites, setFavourites] = useState<string[]>([]);

  useEffect(() => {
    const fetchPokemon = async () => {
      const api = new PokemonClient();
      const response = await api.listPokemons(0, 151);
      const allPokemon = response.results;
      const detailedPokemonList = [];

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
  
        const categorized = detailedPokemonList.reduce((acc, pokemon) => {
          pokemon.types.forEach(type => {
            if (!acc[type]) acc[type] = [];
            acc[type].push(pokemon);
          });
          return acc;
        }, {} as { [type: string]: PokemonWithDetails[] });

        setCategorizedPokemon(categorized);

        // Sleep for 1 second after each batch
        if (i + 20 < allPokemon.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    };
    fetchPokemon();
  }, []);

  useEffect(() => {
    const favs = localStorage.getItem('favourites');
    if (favs) {
      setFavourites(JSON.parse(favs));
    }
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

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
      <input
        type="text"
        placeholder="Search Pokémon"
        value={searchTerm}
        onChange={handleSearch}
        className="w-full p-2 mb-4 border rounded"
      />
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
