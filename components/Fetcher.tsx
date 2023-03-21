import useSWR from 'swr';
import Image from "next/image";
import axios from "axios";

interface Cell {
    value: number;
    symbol: string;
  }

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function Profile({ userId }: { userId: string }) {
  const { data, error } = useSWR(`/api/hello`, fetcher);

  if (error) return <div>Failed to load user</div>;
  if (!data) return <div>Loading...</div>;

  const updateUser = async (rowIndex: number, colIndex: number, symbol: string) => {
    try {
      const response = await axios.put(`/api/hello`, { rowIndex: rowIndex, colIndex: colIndex, symbol: symbol });
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  const handleCellClick = (rowIndex: number, colIndex: number) => {
    updateUser(rowIndex, colIndex, 'g');
  };
  const handleContextMenu = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    rowIndex: number,
    colIndex: number
  ) => {
    
    event.preventDefault();
  };
  return (
    <div>{data.grid.map((row: Cell[], rowIndex: number) => (
        <div key={rowIndex} style={{ display: "flex" }}>
          {row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              style={{
                width: "50px",
                height: "50px",
                backgroundColor: "white",
                border: "1px solid black",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                userSelect: "none",
              }}
              onClick={() => handleCellClick(rowIndex, colIndex)}
              onContextMenu={(event) =>
                handleContextMenu(event, rowIndex, colIndex)
              }
            >
              {cell.value <= 3 ? (
                <Image
                  src={`/${cell.symbol}/number-${cell.value}.png`}
                  alt={`${cell.value}`}
                  width={30}
                  height={30}
                />
              ) : (
                <div style={{ fontSize: "20px" }}>{cell.value}</div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default function Home1() {
  return <Profile userId="1" />;
}