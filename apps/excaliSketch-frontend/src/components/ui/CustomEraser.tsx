import React from "react";

const EraserCursor: React.FC = () => {
  // Define the custom eraser cursor
  const eraserCursor =
    "url(\"data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='32'%20height='32'%20viewBox='0%200%2032%2032'%3E%3Ccircle%20cx='16'%20cy='16'%20r='15'%20fill='none'%20stroke='white'%20stroke-width='2'/%3E%3C/svg%3E\") 16 16, auto";

  return (
    <div
      style={{
        cursor: eraserCursor,
        height: "100vh",
        background: "#333",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontSize: "1.5rem",
      }}
    >
      Hover here to see the custom eraser cursor!
    </div>
  );
};

export default EraserCursor;
