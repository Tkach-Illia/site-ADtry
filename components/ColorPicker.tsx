import useSWR from "swr";
import axios from "axios";
import { fetcher } from "@/fetchers/fetcher";

interface Data {
  selectedColor: string | undefined;
  setSelectedColor: (color: string) => void;
}

const ColorPicker: React.FC<Data> = ({ selectedColor, setSelectedColor }) => {
  const { data, error } = useSWR("/api/color", fetcher, {
    refreshInterval: 500,
  });

  const updateColors = async (color: string) => {
    try {
      const response = await axios.put(`/api/color`, {
        pickedColor: color,
        oldColor: selectedColor,
      });
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  const isColorAvailable = (color: string) => {
    return data?.includes(color);
  };

  const onColorSelected = (color: string) => {
    if (isColorAvailable(color)) {
      updateColors(color);
      setSelectedColor(color);
    }
  };

  return (
    <div>
      <p>Available colors: {data?.join(", ")}</p>
      <p>Selected color: {selectedColor}</p>
      <div style={{ display: "flex", flexDirection: "row" }}>
        {data?.map((color: string, index: number) => (
          <div
            key={index}
            style={{
              backgroundColor: color,
              width: "30px",
              height: "30px",
              marginRight: "10px",
              cursor: isColorAvailable(color) ? "pointer" : "default",
              opacity: isColorAvailable(color) ? 1 : 0.5,
            }}
            onClick={() => onColorSelected(color)}
          />
        ))}
      </div>
    </div>
  );
};

export default ColorPicker;
