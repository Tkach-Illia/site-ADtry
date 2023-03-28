import React, { useState, useEffect } from "react";

interface Props {
  players: number;
  onGameStart: () => void;
}

const WaitingRoom: React.FC<Props> = ({ players, onGameStart }) => {
  const [readyPlayers, setReadyPlayers] = useState(0);

  return (
    <div>
      <h2>Waiting for players...</h2>
      <p>
        {readyPlayers} / {players} players ready
      </p>
      <button onClick={onGameStart}>Ready</button>
    </div>
  );
};

export default WaitingRoom;
