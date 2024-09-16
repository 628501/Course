import { Box } from "@mui/material";
import React from "react";

interface StarRatingProps {
  stars: number;
  size?: number;
}

const StarRating: React.FC<StarRatingProps> = ({ stars, size = 18 }) => {
  const styles = {
    width: `${size}px`,
    height: `${size}px`,
    marginRight: `${size / 6}px`,
    display: 'inline-block',
  };

  interface StarProps {
    number: number;
  }

  const Star: React.FC<StarProps> = ({ number }) => {
    const halfNumber = number - 0.5;

    return stars >= number ? (
      <img src="/star-full.svg" style={styles} alt={`${number}`} />
    ) : stars >= halfNumber ? (
      <img src="/star-half.svg" style={styles} alt={`${number}`} />
    ) : (
      <img src="/star-empty (1).svg" style={styles} alt={`${number}`} />
    );
  };

  return (
    <Box sx={{
      display: "flex",
      flexWrap: "nowrap",
      backgroundColor: "transparent",
      padding: 0,
      margin: 0,
    }}>
      {[1, 2, 3, 4, 5].map((number) => (
        <Star key={number} number={number} />
      ))}
    </Box>
  );
};

StarRating.defaultProps = {
  size: 20,
};

export default StarRating;