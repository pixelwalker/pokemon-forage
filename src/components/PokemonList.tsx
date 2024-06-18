import React from 'react';
import { Link } from 'react-router-dom';

interface PokemonWithDetails {
  name: string;
  imageUrl: string;
  types: string[];
}

interface PokemonListProps {
  categorizedPokemon: { [type: string]: PokemonWithDetails[] };
  searchTerm: string;
  favourites: string[];
  handleFavourite: (name: string) => void;
}

const PokemonList: React.FC<PokemonListProps> = ({ categorizedPokemon, searchTerm, favourites, handleFavourite }) => {

  const filteredPokemon = (pokemonList: PokemonWithDetails[]) =>
    pokemonList.filter(pokemon =>
      pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <>
      {Object.keys(categorizedPokemon).map(type => (
        filteredPokemon(categorizedPokemon[type]).length > 0 && (
          <div key={type} className="mb-8">
            <h2 className="mb-2 text-2xl font-bold capitalize">{type}</h2>
            <div className="flex space-x-4 overflow-x-scroll py-4">
              {filteredPokemon(categorizedPokemon[type]).map((pokemon: PokemonWithDetails) => (
                <div key={pokemon.name} className="relative min-w-[200px]">
                  <Link to={`/pokemon/${pokemon.name}`} className="block bg-gray-800 rounded overflow-hidden shadow-lg transform transition-transform hover:scale-105">
                    <img src={pokemon.imageUrl} alt={pokemon.name} className="w-full h-[200px] object-cover" />
                    <div className="p-4 text-white">
                      <h2 className="text-lg font-bold capitalize">{pokemon.name}</h2>
                    </div>
                  </Link>
                  <button
                    className={`absolute top-2 right-2 p-2 rounded-full ${favourites.includes(pokemon.name) ? 'bg-red-500' : 'bg-blue-500'}`}
                    onClick={() => handleFavourite(pokemon.name)}
                  >
                    {favourites.includes(pokemon.name) ? '♥' : '♡'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )
      ))}
    </>
  );
};

export default PokemonList;
