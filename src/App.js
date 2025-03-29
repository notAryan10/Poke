import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
      
      // Generate random IDs between 1 and 898
      const id1 = Math.floor(Math.random() * 898) + 1;
      const id2 = Math.floor(Math.random() * 898) + 1;

      console.log('Fetching Pokemon with IDs:', id1, id2); // Debug log

      // Fetch both Pokemon in parallel
      const [response1, response2] = await Promise.all([
        axios.get(`https://pokeapi.co/api/v2/pokemon/${id1}`),
        axios.get(`https://pokeapi.co/api/v2/pokemon/${id2}`)
      ]);

      console.log('Pokemon 1 data:', response1.data); // Debug log
      console.log('Pokemon 2 data:', response2.data); // Debug log

      const pokemon1Data = {
        name: response1.data.name,
        image: response1.data.sprites.front_default,
        hp: response1.data.stats[0].base_stat,
        attack: response1.data.stats[1].base_stat,
        defense: response1.data.stats[2].base_stat
      };

      const pokemon2Data = {
        name: response2.data.name,
        image: response2.data.sprites.front_default,
        hp: response2.data.stats[0].base_stat,
        attack: response2.data.stats[1].base_stat,
        defense: response2.data.stats[2].base_stat
      };

      console.log('Processed Pokemon 1:', pokemon1Data); // Debug log
      console.log('Processed Pokemon 2:', pokemon2Data); // Debug log

      setPokemon1(pokemon1Data);
      setPokemon2(pokemon2Data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching Pokemon:', error);
      // Show error to user
      alert('Error loading Pokemon. Please try again.');
      setIsLoading(false);
    }
  };

  const simulateBattle = () => {
    if (!pokemon1 || !pokemon2) return;
    
    setIsLoading(true);
    
    let hp1 = pokemon1.hp;
    let hp2 = pokemon2.hp;
    
    // Calculate damage
    const damage1 = Math.max(0, pokemon1.attack - pokemon2.defense);
    const damage2 = Math.max(0, pokemon2.attack - pokemon1.defense);
    
    // Calculate results immediately
    hp2 -= damage1;
    hp1 -= damage2;

    if (hp1 > hp2) {
      setWinner(pokemon1.name);
    } else if (hp2 > hp1) {
      setWinner(pokemon2.name);
    } else {
      setWinner("It's a tie!");
    }
    
    setIsLoading(false);

    // Clear winner after 2 seconds
    setTimeout(() => {
      setWinner(null);
    }, 2000);
  };

  useEffect(() => {
    fetchRandomPokemon();
  }, []);

  return (
    <div className="App">
      <h1 className="title">Pokemon Battle Simulator</h1>
      
      {error ? (
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
      ) : isLoading && !pokemon1 ? (
        <div className="loading">
          <div className="pokeball"></div>
          <p>Loading Pokemon...</p>
        </div>
      ) : (
        <div className="battle-container">
          <div className="battle-arena">
            <div className="pokemon-container">
              {pokemon1 && (
                <div className="pokemon-card pokemon1">
                  <div className="stats-banner">
                    <h2>{pokemon1.name}</h2>
                    <div className="hp-bar">
                      <div className="hp-label">HP:</div>
                      <div className="hp-wrapper">
                        <div 
                          className="hp-fill pokemon1-hp"
                          style={{width: `${(pokemon1.hp / 255) * 100}%`}}
                        ></div>
                      </div>
                      <div className="hp-text">{pokemon1.hp}</div>
                    </div>
                  </div>
                  <img 
                    src={pokemon1.image} 
                    alt={pokemon1.name} 
                    className="pokemon1-img"
                    onError={(e) => {
                      console.log('Image failed to load:', pokemon1.image);
                      e.target.src = fallbackImage;
                    }}
                  />
                  <div className="stats">
                    <div className="stat">
                      <span className="stat-label">Attack:</span>
                      <div className="stat-bar">
                        <div style={{width: `${(pokemon1.attack / 255) * 100}%`}}></div>
                      </div>
                      <span>{pokemon1.attack}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Defense:</span>
                      <div className="stat-bar">
                        <div style={{width: `${(pokemon1.defense / 255) * 100}%`}}></div>
                      </div>
                      <span>{pokemon1.defense}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="vs">VS</div>

              {pokemon2 && (
                <div className="pokemon-card pokemon2">
                  <div className="stats-banner">
                    <h2>{pokemon2.name}</h2>
                    <div className="hp-bar">
                      <div className="hp-label">HP:</div>
                      <div className="hp-wrapper">
                        <div 
                          className="hp-fill pokemon2-hp"
                          style={{width: `${(pokemon2.hp / 255) * 100}%`}}
                        ></div>
                      </div>
                      <div className="hp-text">{pokemon2.hp}</div>
                    </div>
                  </div>
                  <img 
                    src={pokemon2.image} 
                    alt={pokemon2.name} 
                    className="pokemon2-img"
                    onError={(e) => {
                      console.log('Image failed to load:', pokemon2.image);
                      e.target.src = fallbackImage;
                    }}
                  />
                  <div className="stats">
                    <div className="stat">
                      <span className="stat-label">Attack:</span>
                      <div className="stat-bar">
                        <div style={{width: `${(pokemon2.attack / 255) * 100}%`}}></div>
                      </div>
                      <span>{pokemon2.attack}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Defense:</span>
                      <div className="stat-bar">
                        <div style={{width: `${(pokemon2.defense / 255) * 100}%`}}></div>
                      </div>
                      <span>{pokemon2.defense}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="controls">
              <button 
                className={`battle-button ${isLoading ? 'disabled' : ''}`}
                onClick={simulateBattle} 
                disabled={!pokemon1 || !pokemon2 || isLoading}
              >
                Start Battle
              </button>
              <button 
                className="new-pokemon-button"
                onClick={fetchRandomPokemon}
                disabled={isLoading}
              >
                New Pokemon
              </button>
            </div>

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
      )}
    </div>
  );
}

export default App;
