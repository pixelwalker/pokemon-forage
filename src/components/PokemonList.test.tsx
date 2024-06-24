import { render, screen, fireEvent } from '@testing-library/react';
// Importing necessary functions from the React Testing Library
import { BrowserRouter as Router } from 'react-router-dom';
// Importing BrowserRouter for wrapping the component to be tested
import PokemonList from './PokemonList';
// Importing the PokemonList component to be tested

// Mock data for the test cases
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

// Mock function to simulate the handleFavourite function
const mockHandleFavourite = jest.fn();

describe('PokemonList Component', () => {
  // Test to check if the PokemonList component renders correctly with categorizedPokemon
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

    // Check if the fire type and its Pokémon are rendered
    expect(screen.getByText('fire')).toBeInTheDocument();
    expect(screen.getByText('Charmander')).toBeInTheDocument();
    expect(screen.getByText('Vulpix')).toBeInTheDocument();

    // Check if the water type and its Pokémon are rendered
    expect(screen.getByText('water')).toBeInTheDocument();
    expect(screen.getByText('Squirtle')).toBeInTheDocument();
    expect(screen.getByText('Psyduck')).toBeInTheDocument();
  });

  // Test to check if the PokemonList component filters Pokémon based on the searchTerm
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

    // Check if only Charmander is rendered when the searchTerm is 'char'
    expect(screen.getByText('Charmander')).toBeInTheDocument();
    expect(screen.queryByText('Vulpix')).not.toBeInTheDocument();
    expect(screen.queryByText('Squirtle')).not.toBeInTheDocument();
    expect(screen.queryByText('Psyduck')).not.toBeInTheDocument();
  });

  // Test to check if the favourite status toggles on button click
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

    // Get all favourite and non-favourite buttons
    const favouriteButtons = screen.getAllByText('♥');
    const nonFavouriteButtons = screen.getAllByText('♡');

    // Click on the favourite button for Charmander
    fireEvent.click(favouriteButtons[0]);
    // Check if the handleFavourite function is called with 'Charmander'
    expect(mockHandleFavourite).toHaveBeenCalledWith('Charmander');

    // Click on the non-favourite button for Vulpix
    fireEvent.click(nonFavouriteButtons[0]);
    // Check if the handleFavourite function is called with 'Vulpix'
    expect(mockHandleFavourite).toHaveBeenCalledWith('Vulpix');
  });
});
