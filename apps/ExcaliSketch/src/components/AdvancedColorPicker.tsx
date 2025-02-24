import React, { useState, useRef, useEffect } from "react";
import { ChromePicker, ColorResult } from "react-color";

interface AdvancedColorPickerProps {
  color: string;
  setColor: React.Dispatch<React.SetStateAction<string>>;
}

export default function AdvancedColorPicker({
  color,
  setColor,
}: AdvancedColorPickerProps): any {
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Predefined color options
  const predefinedColors: string[] = [
    "#D3D3D3", // white
    "#FF8383", // orange
    "#9479E1", // purple
    "#56A2E8", // blue
    "#3A994C", // green
  ];

  // Close the picker when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setShowPicker(false);
      }
    }

    if (showPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPicker]);

  return (
    <div className="relative" ref={pickerRef} title="Pick Color">
      {/* Color button */}
      <button
        className="w-8 h-8 rounded-lg border-2 p-2 m-0 mr-2 border-gray-400 shadow-md cursor-pointer"
        style={{ backgroundColor: color }}
        onClick={() => setShowPicker((prev) => !prev)}
      />

      {/* Color picker panel */}
      {showPicker && (
        <div className="absolute top-14 left-0 z-10 bg-white p-2 shadow-lg rounded">
          {/* ChromePicker for detailed selection */}
          <ChromePicker
            color={color}
            onChange={(newColor: ColorResult) => setColor(newColor.hex)}
          />

          {/* Predefined color options */}
          <div className="flex space-x-2 mt-2 justify-around">
            {predefinedColors.map((preColor) => (
              <button
                key={preColor}
                className="w-8 h-8 rounded-full border border-gray-600 cursor-pointer"
                style={{ backgroundColor: preColor }}
                onClick={() => {
                  setColor(preColor);
                  setShowPicker(false);
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
