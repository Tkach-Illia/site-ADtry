import React, { useState, useEffect } from "react";

const ColorPicker: React.FC = () => {
  const [availableColors, setAvailableColors] = useState<string[]>([]);
  const [selectedColor, setSelectedColor] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/color`);
        const colors = await response.json();
        setAvailableColors(colors);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const isColorAvailable = (color: string) => {
    return availableColors.includes(color);
  };

  const onColorSelected = (color: string) => {
    if (isColorAvailable(color)) {
      setSelectedColor(color);
    }
  };

  return (
    <div>
      <p>Available colors: {availableColors.join(", ")}</p>
      <p>Selected color: {selectedColor}</p>
      <div style={{ display: "flex", flexDirection: "row" }}>
        {availableColors.map((color) => (
          <div
            key={color}
            style={{
              backgroundColor: color,
              width: "30px",
              height: "30px",
              marginRight: "10px",
              cursor: isColorAvailable(color) ? "pointer" : "default",
              opacity: isColorAvailable(color) ? 1 : 0.5,
            }}
            onClick={() => onColorSelected(color)}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default ColorPicker;
