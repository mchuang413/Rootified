import React, { useState, useEffect } from "react";
import useMeasure from "react-use-measure";
import {
  useDragControls,
  useMotionValue,
  useAnimate,
  motion,
} from "framer-motion";
import Cookies from "js-cookie";
import { FaCheckCircle, FaTimesCircle, FaStar } from "react-icons/fa";

export const DragCloseDrawerExample = () => {
  const [open, setOpen] = useState(false);
  const [userStats, setUserStats] = useState({
    correctWords: [],
    wrongWords: {},
    points: 0,
    masteredWords: [],
  });
  const userEmail = Cookies.get("userEmail");

  const fetchCorrectWords = async () => {
    try {
      const response = await fetch(`https://rootified-backend-52fb8.ondigitalocean.app/correctWords?email=${userEmail}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${Cookies.get('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        return data.correctList;
      } else {
        console.error("Failed to fetch correct words");
        return [];
      }
    } catch (error) {
      console.error("Error fetching correct words:", error);
      return [];
    }
  };
  
  const fetchWrongWords = async () => {
    try {
      const response = await fetch(`https://rootified-backend-52fb8.ondigitalocean.app/wrongWords?email=${userEmail}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${Cookies.get('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        return data.wrongList;
      } else {
        console.error("Failed to fetch wrong words");
        return {};
      }
    } catch (error) {
      console.error("Error fetching wrong words:", error);
      return {};
    }
  };
  
  const fetchPoints = async () => {
    try {
      const response = await fetch(`https://rootified-backend-52fb8.ondigitalocean.app/points?email=${userEmail}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${Cookies.get('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        console.log("User points:", data.points);
        return data.points;
      } else {
        console.error("Failed to fetch points");
        return 0;
      }
    } catch (error) {
      console.error("Error fetching points:", error);
      return 0;
    }
  };
  

  const fetchMasteredWords = async () => {
    try {
      const response = await fetch(`https://rootified-backend-52fb8.ondigitalocean.app/masteredWords?email=${userEmail}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${Cookies.get('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        return data.masteredList;
      } else {
        console.error("Failed to fetch mastered words");
        return [];
      }
    } catch (error) {
      console.error("Error fetching mastered words:", error);
      return [];
    }
  };
  
  const toggleDrawer = async () => {
    if (!open) {
      const [correctWords, wrongWords, points, masteredWords] = await Promise.all([
        fetchCorrectWords(),
        fetchWrongWords(),
        fetchPoints(),
        fetchMasteredWords(), 
      ]);
  
      setUserStats({
        correctWords,
        wrongWords,
        points,
        masteredWords, 
      });
    }
    setOpen((prev) => !prev);
  };

  const { correctWords = [], wrongWords = {}, points = 0, masteredWords = [] } = userStats;

  return (
    <div>
      <button onClick={toggleDrawer} className="btn btn-primary">
        Open Statistics
      </button>
      <DragCloseDrawer open={open} setOpen={setOpen}>
        <div className="mx-auto max-w-2xl space-y-6 text-neutral-400">
          <h2 className="text-4xl font-bold text-neutral-200 text-center">
            🎉 Your Learning Statistics 🎉
          </h2>
          <div className="space-y-4">
            {/* Correct Words */}
            <div className="flex justify-between items-center text-lg">
              <div className="flex items-center space-x-2 text-green-400">
                <FaCheckCircle />
                <span className="font-bold">Correct Words:</span>
              </div>
              <span className="text-white">{correctWords.length}</span>
            </div>
            <div className="bg-green-600 bg-opacity-20 p-4 rounded-lg">
              <table className="table-auto w-full text-white">
                <thead>
                  <tr>
                    <th className="px-4 py-2">Word</th>
                    <th className="px-4 py-2">Times Correct</th>
                  </tr>
                </thead>
                <tbody>
                  {correctWords.map((wordObj, index) => (
                    <tr key={index} className="bg-neutral-800">
                      <td className="border px-4 py-2">{wordObj.word}</td>
                      <td className="border px-4 py-2 text-center">{wordObj.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Wrong Words */}
            <div className="flex justify-between items-center text-lg">
              <div className="flex items-center space-x-2 text-red-400">
                <FaTimesCircle />
                <span className="font-bold">Wrong Words:</span>
              </div>
              <span className="text-white">{Object.keys(wrongWords).length}</span>
            </div>
            <div className="bg-red-600 bg-opacity-20 p-4 rounded-lg">
              <table className="table-auto w-full text-white">
                <thead>
                  <tr>
                    <th className="px-4 py-2">Word</th>
                    <th className="px-4 py-2">Times Incorrect</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(wrongWords).map(([word, count], index) => (
                    <tr key={index} className="bg-neutral-800">
                      <td className="border px-4 py-2">{word}</td>
                      <td className="border px-4 py-2 text-center">{count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mastered Words */}
            <div className="flex justify-between items-center text-lg">
              <div className="flex items-center space-x-2 text-blue-400">
                <FaStar />
                <span className="font-bold">Mastered Words:</span>
              </div>
              <span className="text-white">{masteredWords.length}</span>
            </div>
            <div className="bg-blue-600 bg-opacity-20 p-4 rounded-lg">
              <ul className="list-disc pl-5 text-white">
                {masteredWords.map((word, index) => (
                  <li key={index}>{word}</li> 
                ))}
              </ul>
            </div>

            {/* Total Points */}
            <div className="flex justify-between items-center text-lg">
              <div className="flex items-center space-x-2 text-yellow-400">
                <FaStar />
                <span className="font-bold">Total Points:</span>
              </div>
              <span className="text-white">{points}</span>
            </div>
          </div>

          <div className="text-center">
            <p className="text-neutral-200">
              Keep up the good work! Every correct answer gets you closer to
              mastery! 🌟
            </p>
          </div>
        </div>
      </DragCloseDrawer>
    </div>
  );
};

export default DragCloseDrawerExample;

const DragCloseDrawer = ({ open, setOpen, children }) => {
  const [scope, animate] = useAnimate();
  const [drawerRef, { height }] = useMeasure();

  const y = useMotionValue(0);
  const controls = useDragControls();

  const handleClose = async () => {
    animate(scope.current, {
      opacity: [1, 0],
    });

    const yStart = typeof y.get() === "number" ? y.get() : 0;

    await animate("#drawer", {
      y: [yStart, height],
    });

    setOpen(false);
  };

  return (
    <>
      {open && (
        <motion.div
          ref={scope}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={handleClose}
          className="fixed inset-0 z-50 bg-neutral-950/70"
        >
          <motion.div
            id="drawer"
            ref={drawerRef}
            onClick={(e) => e.stopPropagation()}
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            transition={{
              ease: "easeInOut",
            }}
            className="absolute bottom-0 h-[75vh] w-full overflow-hidden rounded-t-3xl bg-neutral-900"
            style={{ y }}
            drag="y"
            dragControls={controls}
            onDragEnd={() => {
              if (y.get() >= 100) {
                handleClose();
              }
            }}
            dragListener={false}
            dragConstraints={{
              top: 0,
              bottom: 0,
            }}
            dragElastic={{
              top: 0,
              bottom: 0.5,
            }}
          >
            <div className="absolute left-0 right-0 top-0 z-10 flex justify-center bg-neutral-900 p-4">
              <button
                onPointerDown={(e) => {
                  controls.start(e);
                }}
                className="h-2 w-14 cursor-grab touch-none rounded-full bg-neutral-700 active:cursor-grabbing"
              ></button>
            </div>
            <div className="relative z-0 h-full overflow-y-scroll p-4 pt-12">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};
