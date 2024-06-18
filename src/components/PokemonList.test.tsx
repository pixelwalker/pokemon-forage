import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import PokemonList from './PokemonList';

const mockPokemon = {
  fire: [
    { name: 'Charmander', imageUrl: 'charmander.png', types: ['fire'] },
    { name: 'Vulpix', imageUrl: 'vulpix.png', types: ['fire'] }
  ],
  water: [
    { name: 'Squirtle', imageUrl: 'squirtle.png', types: ['water'] },
    { name: 'Psyduck', imageUrl: 'psyduck.png', types: ['water'] }
  ]
};

const mockHandleFavourite = jest.fn();

describe('PokemonList Component', () => {
  test('renders PokemonList component with categorizedPokemon', () => {
    render(
      <Router>
        <PokemonList
          categorizedPokemon={mockPokemon}
          searchTerm=""
          favourites={[]}
          handleFavourite={mockHandleFavourite}
        />
      </Router>
    );

    expect(screen.getByText('fire')).toBeInTheDocument();
    expect(screen.getByText('Charmander')).toBeInTheDocument();
    expect(screen.getByText('Vulpix')).toBeInTheDocument();
    expect(screen.getByText('water')).toBeInTheDocument();
    expect(screen.getByText('Squirtle')).toBeInTheDocument();
    expect(screen.getByText('Psyduck')).toBeInTheDocument();
  });

  test('filters Pokemon based on searchTerm', () => {
    render(
      <Router>
        <PokemonList
          categorizedPokemon={mockPokemon}
          searchTerm="char"
          favourites={[]}
          handleFavourite={mockHandleFavourite}
        />
      </Router>
    );

    expect(screen.getByText('Charmander')).toBeInTheDocument();
    expect(screen.queryByText('Vulpix')).not.toBeInTheDocument();
    expect(screen.queryByText('Squirtle')).not.toBeInTheDocument();
    expect(screen.queryByText('Psyduck')).not.toBeInTheDocument();
  });

  test('toggles favourite status on button click', () => {
    render(
      <Router>
        <PokemonList
          categorizedPokemon={mockPokemon}
          searchTerm=""
          favourites={['Charmander']}
          handleFavourite={mockHandleFavourite}
        />
      </Router>
    );

    const favouriteButtons = screen.getAllByText('♥');
    const nonFavouriteButtons = screen.getAllByText('♡');

    // Click on the favourite button for Charmander
    fireEvent.click(favouriteButtons[0]);
    expect(mockHandleFavourite).toHaveBeenCalledWith('Charmander');

    // Click on the non-favourite button for Vulpix
    fireEvent.click(nonFavouriteButtons[0]);
    expect(mockHandleFavourite).toHaveBeenCalledWith('Vulpix');
  });
});
