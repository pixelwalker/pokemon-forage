import React from 'react';
// Importing the React library
import { Link } from 'react-router-dom';
// Importing the Link component from react-router-dom for navigation

// Defining the interface for PokemonWithDetails
interface PokemonWithDetails {
  name: string;
  imageUrl: string;
  types: string[];
}

// Defining the interface for the props of PokemonList
interface PokemonListProps {
  categorizedPokemon: { [type: string]: PokemonWithDetails[] };
  searchTerm: string;
  favourites: string[];
  handleFavourite: (name: string) => void;
}

// Defining the PokemonList functional component
const PokemonList: React.FC<PokemonListProps> = ({ categorizedPokemon, searchTerm, favourites, handleFavourite }) => {

  // Function to filter Pokémon based on the search term
  const filteredPokemon = (pokemonList: PokemonWithDetails[]) =>
    pokemonList.filter(pokemon =>
      pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <>
      {/* Mapping over the categorized Pokémon types */}
      {Object.keys(categorizedPokemon).map(type => (
        filteredPokemon(categorizedPokemon[type]).length > 0 && (
          <div key={type} className="mb-8">
            {/* Displaying the type of Pokémon */}
            <h2 className="mb-2 text-2xl font-bold capitalize">{type}</h2>
            <div className="flex space-x-4 overflow-x-scroll py-4">
              {/* Mapping over the filtered Pokémon list */}
              {filteredPokemon(categorizedPokemon[type]).map((pokemon: PokemonWithDetails) => (
                <div key={pokemon.name} className="relative min-w-[200px]">
                  {/* Link to the Pokémon details page */}
                  <Link to={`/pokemon/${pokemon.name}`} className="block bg-gray-800 rounded overflow-hidden shadow-lg transform transition-transform hover:scale-105">
                    {/* Displaying the Pokémon's image */}
                    <img src={pokemon.imageUrl} alt={pokemon.name} className="w-full h-[200px] object-cover" />
                    <div className="p-4 text-white">
                      {/* Displaying the Pokémon's name */}
                      <h2 className="text-lg font-bold capitalize">{pokemon.name}</h2>
                    </div>
                  </Link>
                  {/* Button to add/remove the Pokémon from favourites */}
                  <button
                    className={`absolute top-2 right-2 p-2 rounded-full ${favourites.includes(pokemon.name) ? 'bg-red-500' : 'bg-blue-500'}`}
                    onClick={() => handleFavourite(pokemon.name)}
                  >
                    {/* Displaying a heart icon based on whether the Pokémon is a favourite */}
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
// Exporting the PokemonList component as the default export
