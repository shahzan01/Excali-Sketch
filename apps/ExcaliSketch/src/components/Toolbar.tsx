import React, { useState } from "react";
import { ConfirmDialog } from "./confirmDialog";
import {
  FaSquare,
  FaCircle,
  FaArrowRight,
  FaMinus,
  FaPen,
  FaFont,
} from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import Link from "next/link";
import { MdClass, MdClear } from "react-icons/md";
import AdvancedColorPicker from "./AdvancedColorPicker";
import { BiEraser } from "react-icons/bi";
import { BsDiamond } from "react-icons/bs";
import { PiRectangleLight } from "react-icons/pi";
import { GoPencil } from "react-icons/go";

import { RxCursorArrow } from "react-icons/rx";
import { FaRegCircle } from "react-icons/fa6";
import { GiArrowCursor } from "react-icons/gi";
import { FaDiamond } from "react-icons/fa6";

import { RxLockOpen1 } from "react-icons/rx";
import { RxLockClosed } from "react-icons/rx";
import { IoHomeSharp } from "react-icons/io5";
import { Tool } from "@/models/shape";
interface ToolbarProps {
  tool: string;
  setTool: React.Dispatch<React.SetStateAction<Tool>>;

  activateText: () => void;
  color: string;
  setColor: React.Dispatch<React.SetStateAction<string>>;
  clear: () => void;

  lockMode: boolean;
  setLockMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const Toolbar: React.FC<ToolbarProps> = ({
  lockMode,
  setLockMode,
  tool,
  setTool,
  activateText,
  color,
  setColor,
  clear,
}) => {
  const tools = [
    {
      name: "select",
      icon: <RxCursorArrow />,
      activeIcon: <GiArrowCursor />,
      number: 1,
    },
    {
      name: "rectangle",
      icon: <PiRectangleLight />,
      activeIcon: <FaSquare />,
      number: 2,
    },
    {
      name: "diamond",
      icon: <BsDiamond />,
      activeIcon: <FaDiamond />,
      number: 3,
    },
    {
      name: "ellipse",
      icon: <FaRegCircle />,
      activeIcon: <FaCircle />,
      number: 4,
    },
    {
      name: "arrow",
      icon: <FaArrowRight />,
      activeIcon: <FaArrowRight />,
      number: 5,
    },
    {
      name: "line",
      icon: <FaMinus />,
      activeIcon: <FaMinus />,
      number: 6,
    },
    {
      name: "draw",
      icon: <GoPencil />,
      activeIcon: <FaPen />,
      number: 7,
    },
    {
      name: "text",
      icon: <FaFont />,
      activeIcon: <FaFont />,
      number: 8,
    },

    {
      name: "eraser",
      icon: <BiEraser />,
      activeIcon: <BiEraser />,
      number: 9,
    },
  ];
  const [deleteOpen, setdeleteOpen] = useState(false);

  return (
    <div>
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-[#232329] rounded-xl shadow-lg p-1 z-20">
        <div className="flex items-center space-x-4">
          <Link href={"/dashboard"} className="">
            <IoHomeSharp
              className=" w-7 h-7 m-0 p-0  hover:text-blue-500 transition   ml-2"
              title="Home"
            />
          </Link>

          <div className="w-px h-8 bg-gray-300"></div>
          <button
            title="Keep Selected tool active after drawing"
            className={`p-3 rounded-full text-white  ${
              lockMode
                ? "bg-blue-500 text-white"
                : " text-gray-400 hover:bg-gray-700 transition"
            }`}
            onClick={() => {
              setLockMode(!lockMode);
            }}
          >
            {lockMode ? (
              <RxLockClosed className=" w-5 h-5" />
            ) : (
              <RxLockOpen1 className=" w-5 h-5" />
            )}
          </button>

          <div className="w-px h-8 bg-gray-300"></div>

          {tools.map((t) => (
            <button
              key={t.name}
              title={t.name.charAt(0).toUpperCase() + t.name.slice(1)}
              onClick={() => {
                setTool(t.name as Tool);
                if (t.name === "text") activateText();
              }}
              className={`p-3 rounded-md text-xl flex flex-col items-center justify-center ${
                tool === t.name
                  ? "bg-blue-500 text-white"
                  : " text-gray-400 hover:bg-gray-700"
              }  hover:text-white transition`}
            >
              <div className="relative">
                {tool === t.name ? t.activeIcon : t.icon}
                <span className="text-xs absolute -translate-y-1 translate-x-2">
                  {t.number}
                </span>
              </div>
            </button>
          ))}

          <div className="w-px h-8 bg-gray-300"></div>

          <AdvancedColorPicker
            color={color}
            setColor={setColor}
          ></AdvancedColorPicker>
          <div className="w-px h-8 bg-gray-300"></div>
          <div title="Clear All">
            <MdDeleteForever
              className="text-white w-9 h-9  px-0 -ml-3 hover:text-red-600"
              onClick={() => {
                setdeleteOpen(true);
              }}
            />
          </div>
        </div>
      </div>
      <ConfirmDialog
        onClose={() => {
          setdeleteOpen(false);
        }}
        onConfirm={() => {
          setdeleteOpen(false);
          clear();
        }}
        isOpen={deleteOpen}
        title="Confirm Deleting"
        message="Are you sure you want to delete all your drawings? This action is irreversible and cannot be undone."
      ></ConfirmDialog>
    </div>
  );
};

export default Toolbar;
