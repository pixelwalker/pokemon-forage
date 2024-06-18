import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PokemonClient } from 'pokenode-ts';

const PokemonDetails: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const [pokemon, setPokemon] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      if (name) {
        try {
          const api = new PokemonClient();
          const details = await api.getPokemonByName(name);
          setPokemon(details);
        } catch (err) {
          setError('Failed to fetch Pokémon details.');
        }
      } else {
        setError('No Pokémon name provided.');
      }
    };
    fetchPokemonDetails();
  }, [name]);

  if (error) return <div className="p-4 text-center text-red-500">{error}</div>;
  if (!pokemon) return <div className="p-4 text-center">Loading...</div>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <Link to="/" className="text-blue-500 hover:underline mb-4 inline-block">Back to Home</Link>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 p-4 bg-gray-100 flex items-center justify-center">
            <img src={pokemon.sprites.front_default} alt={pokemon.name} className="w-48 h-48 object-contain" />
          </div>
          <div className="md:w-2/3 p-4">
            <h1 className="text-4xl font-bold capitalize mb-2">{pokemon.name}</h1>
            <div className="flex items-center mb-4">
              {pokemon.types.map((typeInfo: any) => (
                <span key={typeInfo.slot} className="text-sm font-medium bg-blue-500 text-white rounded-full px-3 py-1 mr-2">
                  {typeInfo.type.name}
                </span>
              ))}
            </div>
            <div className="mb-4">
              <h2 className="text-2xl font-bold mb-2">Abilities</h2>
              <ul>
                {pokemon.abilities.map((abilityInfo: any) => (
                  <li key={abilityInfo.slot} className="text-lg capitalize">{abilityInfo.ability.name}</li>
                ))}
              </ul>
            </div>
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
