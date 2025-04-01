import React from 'react';

function PokemonCard({ pokemon, position, fallbackImage }) {
  return (
    <div className={`pokemon-card pokemon${position}`}>
      <div className="stats-banner">
        <h2>{pokemon.name}</h2>
        <div className="hp-bar">
          <div className="hp-label">HP:</div>
          <div className="hp-wrapper">
            <div 
              className={`hp-fill pokemon${position}-hp`}
              style={{width: `${(pokemon.hp / 255) * 100}%`}}
            ></div>
          </div>
          <div className="hp-text">{pokemon.hp}</div>
        </div>
      </div>
      <img 
        src={pokemon.image} 
        alt={pokemon.name} 
        className={`pokemon${position}-img`}
        onError={(e) => {
          e.target.src = fallbackImage;
        }}
      />
      <div className="stats">
        {['attack', 'defense'].map(stat => (
          <div className="stat" key={stat}>
            <span className="stat-label">{stat.charAt(0).toUpperCase() + stat.slice(1)}:</span>
            <div className="stat-bar">
              <div style={{width: `${(pokemon[stat] / 255) * 100}%`}}></div>
            </div>
            <span>{pokemon[stat]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PokemonCard; 