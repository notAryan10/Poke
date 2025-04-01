import React from 'react';

function BattleControls({ onBattle, onNewPokemon, isLoading }) {
  return (
    <div className="controls">
      <button 
        className={`battle-button ${isLoading ? 'disabled' : ''}`}
        onClick={onBattle} 
        disabled={isLoading}
      >
        Start Battle
      </button>
      <button 
        className="new-pokemon-button"
        onClick={onNewPokemon}
        disabled={isLoading}
      >
        New Pokemon
      </button>
    </div>
  );
}

export default BattleControls; 