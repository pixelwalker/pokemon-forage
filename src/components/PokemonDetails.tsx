import React, { useEffect, useState } from 'react';
// Importing necessary modules and hooks from React
import { useParams, Link } from 'react-router-dom';
// Importing useParams hook for accessing route parameters and Link component for navigation
import { PokemonClient } from 'pokenode-ts';
// Importing the PokemonClient from pokenode-ts for fetching Pokémon data

const PokemonDetails: React.FC = () => {
  // Using the useParams hook to get the Pokémon name from the route parameters
  const { name } = useParams<{ name: string }>();
  // State to manage the fetched Pokémon details
  const [pokemon, setPokemon] = useState<any>(null);
  // State to manage any errors that occur during the fetch operation
  const [error, setError] = useState<string | null>(null);

  // useEffect to fetch Pokémon details when the component mounts or the name parameter changes
  useEffect(() => {
    const fetchPokemonDetails = async () => {
      if (name) {
        try {
          // Creating an instance of the PokemonClient
          const api = new PokemonClient();
          // Fetching Pokémon details by name
          const details = await api.getPokemonByName(name);
          // Updating the state with fetched details
          setPokemon(details);
        } catch (err) {
          // Setting an error message if the fetch fails
          setError('Failed to fetch Pokémon details.');
        }
      } else {
        // Setting an error message if no Pokémon name is provided
        setError('No Pokémon name provided.');
      }
    };
    fetchPokemonDetails();
  }, [name]);

  // Rendering an error message if an error occurs
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>;
  // Rendering a loading message while the Pokémon details are being fetched
  if (!pokemon) return <div className="p-4 text-center">Loading...</div>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      {/* Link to navigate back to the home page */}
      <Link to="/" className="text-blue-500 hover:underline mb-4 inline-block">Back to Home</Link>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Displaying the Pokémon's image */}
          <div className="md:w-1/3 p-4 bg-gray-100 flex items-center justify-center">
            <img src={pokemon.sprites.front_default} alt={pokemon.name} className="w-48 h-48 object-contain" />
          </div>
          <div className="md:w-2/3 p-4">
            {/* Displaying the Pokémon's name */}
            <h1 className="text-4xl font-bold capitalize mb-2">{pokemon.name}</h1>
            {/* Displaying the Pokémon's types */}
            <div className="flex items-center mb-4">
              {pokemon.types.map((typeInfo: any) => (
                <span key={typeInfo.slot} className="text-sm font-medium bg-blue-500 text-white rounded-full px-3 py-1 mr-2">
                  {typeInfo.type.name}
                </span>
              ))}
            </div>
            {/* Displaying the Pokémon's abilities */}
            <div className="mb-4">
              <h2 className="text-2xl font-bold mb-2">Abilities</h2>
              <ul>
                {pokemon.abilities.map((abilityInfo: any) => (
                  <li key={abilityInfo.slot} className="text-lg capitalize">{abilityInfo.ability.name}</li>
                ))}
              </ul>
            </div>
            {/* Displaying the Pokémon's stats */}
            <div className="mb-4">
              <h2 className="text-2xl font-bold mb-2">Stats</h2>
              <ul>
                {pokemon.stats.map((statInfo: any) => (
                  <li key={statInfo.stat.name} className="text-lg capitalize">
                    <span className="font-medium">{statInfo.stat.name}:</span> {statInfo.base_stat}
                  </li>
                ))}
              </ul>
            </div>
            {/* Displaying additional information about the Pokémon */}
            <div className="mb-4">
              <h2 className="text-2xl font-bold mb-2">Additional Info</h2>
              <p className="text-lg">Height: {pokemon.height}</p>
              <p className="text-lg">Weight: {pokemon.weight}</p>
              <p className="text-lg">Base Experience: {pokemon.base_experience}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonDetails;
