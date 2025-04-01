import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PokemonCard from './components/PokemonCard';
import BattleControls from './components/BattleControls';
import './App.css';

function App() {
  const [pokemon1, setPokemon1] = useState(null);
  const [pokemon2, setPokemon2] = useState(null);
  const [winner, setWinner] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fallbackImage = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png";

  const fetchRandomPokemon = async () => {
    try {
      setIsLoading(true);
      setWinner(null);
      
      const ids = [
        Math.floor(Math.random() * 898) + 1,
        Math.floor(Math.random() * 898) + 1
      ];

      const responses = await Promise.all(
        ids.map(id => axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`))
      );

      const pokemonData = responses.map(response => ({
        name: response.data.name,
        image: response.data.sprites.front_default,
        hp: response.data.stats[0].base_stat,
        attack: response.data.stats[1].base_stat,
        defense: response.data.stats[2].base_stat
      }));

      setPokemon1(pokemonData[0]);
      setPokemon2(pokemonData[1]);
    } catch (error) {
      console.error('Error fetching Pokemon:', error);
      setError('Error loading Pokemon. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const simulateBattle = () => {
    if (!pokemon1 || !pokemon2) return;
    
    setIsLoading(true);
    
    const damage1 = Math.max(0, pokemon1.attack - pokemon2.defense);
    const damage2 = Math.max(0, pokemon2.attack - pokemon1.defense);
    
    const hp1 = pokemon1.hp - damage2;
    const hp2 = pokemon2.hp - damage1;

    setWinner(
      hp1 > hp2 ? pokemon1.name :
      hp2 > hp1 ? pokemon2.name :
      "It's a tie!"
    );
    
    setIsLoading(false);
    setTimeout(() => setWinner(null), 2000);
  };

  useEffect(() => {
    fetchRandomPokemon();
  }, []);

  if (error) {
    return (
      <div className="error-message">
        <h2>Something went wrong</h2>
        <p>{error}</p>
        <button onClick={() => {
          setError(null);
          fetchRandomPokemon();
        }}>
          Try Again
        </button>
      </div>
    );
  }

  if (isLoading && !pokemon1) {
    return (
      <div className="loading">
        <div className="pokeball"></div>
        <p>Loading Pokemon...</p>
      </div>
    );
  }

  return (
    <div className="App">
      <h1 className="title">Pokemon Battle Simulator</h1>
      <div className="battle-container">
        <div className="battle-arena">
          <div className="pokemon-container">
            {pokemon1 && <PokemonCard pokemon={pokemon1} position={1} fallbackImage={fallbackImage} />}
            <div className="vs">VS</div>
            {pokemon2 && <PokemonCard pokemon={pokemon2} position={2} fallbackImage={fallbackImage} />}
          </div>

          <BattleControls 
            onBattle={simulateBattle}
            onNewPokemon={fetchRandomPokemon}
            isLoading={isLoading}
          />

          {winner && (
            <div className="winner-announcement">
              <div className="winner-content">
                <h2>Winner: {winner}</h2>
                <div className="winner-effects"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
