import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import styles from "../styles/Quiz.module.css";
import Attest from "../../utils/attestUser"; // Import the Attest component

const quizData = {
  "course_title": "Fundamentals of Computer Literacy",
  "duration": "10 minutes",
  "total_questions": 50,
  "marks_per_question": 2,
  "questions": [
    {
      "question": "Which component of a computer is responsible for executing instructions?",
      "options": [
        "Hard Drive",
        "RAM",
        "CPU",
        "GPU"
      ],
      "answer": "CPU"
    },
    {
      "question": "What is the primary difference between RAM and ROM?",
      "options": [
        "RAM is non-volatile, while ROM is volatile",
        "RAM is temporary storage, while ROM is permanent storage",
        "ROM is faster than RAM",
        "ROM stores data permanently but is erased when power is off"
      ],
      "answer": "RAM is temporary storage, while ROM is permanent storage"
    },
    {
      "question": "Which function key is commonly used to enter the BIOS/UEFI setup during boot?",
      "options": [
        "F1",
        "F2",
        "F8",
        "F12"
      ],
      "answer": "F2"
    },
    {
      "question": "Which of the following file formats is NOT used for storing images?",
      "options": [
        ".jpg",
        ".png",
        ".wav",
        ".bmp"
      ],
      "answer": ".wav"
    },
    {
      "question": "Which keyboard shortcut allows you to open Task Manager quickly in Windows?",
      "options": [
        "Ctrl + Shift + Esc",
        "Ctrl + Alt + Delete",
        "Win + R",
        "Alt + F4"
      ],
      "answer": "Ctrl + Shift + Esc"
    },
    {
      "question": "What is the primary advantage of an SSD over an HDD?",
      "options": [
        "Larger storage capacity",
        "Lower power consumption and faster read/write speeds",
        "Better for long-term storage",
        "Less expensive"
      ],
      "answer": "Lower power consumption and faster read/write speeds"
    },
    {
      "question": "Which of the following is NOT an example of system software?",
      "options": [
        "Windows 10",
        "Linux Kernel",
        "Google Chrome",
        "macOS"
      ],
      "answer": "Google Chrome"
    },
    {
      "question": "Which file system is commonly used by modern Windows operating systems?",
      "options": [
        "FAT32",
        "NTFS",
        "ext4",
        "HFS+"
      ],
      "answer": "NTFS"
    },
    {
      "question": "Which of the following is a programming file format?",
      "options": [
        ".exe",
        ".docx",
        ".py",
        ".mp3"
      ],
      "answer": ".py"
    },
    {
      "question": "What is the function of the Alt + Tab keyboard shortcut?",
      "options": [
        "Opens the Start menu",
        "Switches between open applications",
        "Shows the desktop",
        "Closes the active window"
      ],
      "answer": "Switches between open applications"
    },
    {
      "question": "Which hardware component determines how many programs can run simultaneously on a computer?",
      "options": [
        "RAM",
        "CPU",
        "GPU",
        "Power Supply"
      ],
      "answer": "RAM"
    },
    {
      "question": "What is the purpose of a graphics processing unit (GPU)?",
      "options": [
        "Manages internet connections",
        "Processes graphics and visual data",
        "Handles audio processing",
        "Increases hard drive speed"
      ],
      "answer": "Processes graphics and visual data"
    },
    {
      "question": "Which of the following file formats is used for compressed files?",
      "options": [
        ".exe",
        ".zip",
        ".mp4",
        ".iso"
      ],
      "answer": ".zip"
    },
    {
      "question": "What happens when you press Ctrl + Z on a computer?",
      "options": [
        "Redoes the last action",
        "Undoes the last action",
        "Copies text",
        "Deletes a file permanently"
      ],
      "answer": "Undoes the last action"
    },
    {
      "question": "Which operating system is based on the Linux kernel?",
      "options": [
        "Windows 11",
        "macOS",
        "Android",
        "DOS"
      ],
      "answer": "Android"
    },
    {
      "question": "Which of the following is considered volatile memory?",
      "options": [
        "HDD",
        "SSD",
        "RAM",
        "Flash Drive"
      ],
      "answer": "RAM"
    },
    {
      "question": "Which key is commonly used to cancel an operation or close a dialog box?",
      "options": [
        "Ctrl",
        "Esc",
        "Shift",
        "Tab"
      ],
      "answer": "Esc"
    },
    {
      "question": "What is the primary function of an operating system?",
      "options": [
        "Managing computer hardware and software resources",
        "Providing internet access",
        "Running antivirus programs",
        "Enhancing gaming performance"
      ],
      "answer": "Managing computer hardware and software resources"
    },
    {
      "question": "What does the acronym BIOS stand for?",
      "options": [
        "Basic Input Output System",
        "Binary Integrated Operating System",
        "Basic Internal Operations Software",
        "Boot Integrated Output System"
      ],
      "answer": "Basic Input Output System"
    },
    {
      "question": "What does the F12 key typically do in most web browsers?",
      "options": [
        "Opens developer tools",
        "Refreshes the page",
        "Closes the browser",
        "Takes a screenshot"
      ],
      "answer": "Opens developer tools"
    },
    {
      "question": "What is a computer?",
      "options": ["A device for processing data", "A type of software", "A network of devices", "A storage medium"],
      "answer": "A device for processing data"
    },
    {
      "question": "What does the IPO cycle stand for?",
      "options": ["Input, Process, Output", "Input, Print, Output", "Input, Program, Output", "Input, Process, Organize"],
      "answer": "Input, Process, Output"
    },
    {
      "question": "What layout is commonly used on standard keyboards?",
      "options": ["AZERTY", "Dvorak", "QWERTY", "Colemak"],
      "answer": "QWERTY"
    },
    {
      "question": "What is a compact keyboard?",
      "options": ["A keyboard with fewer keys", "A keyboard for gaming", "A keyboard with a numeric pad", "A keyboard with backlighting"],
      "answer": "A keyboard with fewer keys"
    },
    {
      "question": "What is the purpose of the Shift key?",
      "options": ["To type uppercase letters", "To delete text", "To save files", "To open applications"],
      "answer": "To type uppercase letters"
    },
    {
      "question": "What does Ctrl+C do?",
      "options": ["Copy selected text", "Paste copied text", "Cut selected text", "Undo last action"],
      "answer": "Copy selected text"
    },
    {
      "question": "What is the function of the F1 key?",
      "options": ["Open help menu", "Refresh page", "Open developer tools", "Close application"],
      "answer": "Open help menu"
    },
    {
      "question": "What is the primary function of a mouse?",
      "options": ["To type text", "To navigate and select items", "To print documents", "To store data"],
      "answer": "To navigate and select items"
    },
    {
      "question": "What is a file?",
      "options": ["A collection of data", "A type of software", "A hardware component", "A network connection"],
      "answer": "A collection of data"
    },
    {
      "question": "What does it mean to zip a folder?",
      "options": ["To compress files", "To delete files", "To rename files", "To move files"],
      "answer": "To compress files"
    },
    {
      "question": "What is an archive?",
      "options": ["A collection of files", "A type of software", "A hardware component", "A network connection"],
      "answer": "A collection of files"
    },
    {
      "question": "What file format is commonly used for documents?",
      "options": [".jpg", ".mp3", ".docx", ".zip"],
      "answer": ".docx"
    },
    {
      "question": "What does .jpg represent?",
      "options": ["Audio file", "Image file", "Document file", "Compressed file"],
      "answer": "Image file"
    },
    {
      "question": "What is the purpose of a CPU?",
      "options": ["To store data", "To process instructions", "To manage input devices", "To connect to the internet"],
      "answer": "To process instructions"
    },
    {
      "question": "What is a GUI?",
      "options": ["Graphical User Interface", "General User Interface", "Global User Interface", "Graphical Universal Interface"],
      "answer": "Graphical User Interface"
    },
    {
      "question": "What is the function of the Alt key?",
      "options": ["To type special characters", "To switch between applications", "To save files", "To open the task manager"],
      "answer": "To switch between applications"
    },
    {
      "question": "What does the term 'file path' refer to?",
      "options": ["The location of a file in a system", "The size of a file", "The type of a file", "The content of a file"],
      "answer": "The location of a file in a system"
    },
    {
      "question": "What is the purpose of the Esc key?",
      "options": ["To exit menus or applications", "To save files", "To open settings", "To refresh the page"],
      "answer": "To exit menus or applications"
    },
    {
      "question": "What is the role of a file extension?",
      "options": ["To indicate the file type", "To encrypt the file", "To compress the file", "To rename the file"],
      "answer": "To indicate the file type"
    },
    {
      "question": "What is the function of the right-click on a mouse?",
      "options": ["To select an item", "To open a context menu", "To scroll", "To double-click"],
      "answer": "To open a context menu"
    },
    {
      "question": "What is the purpose of a software update?",
      "options": ["To add new features and fix bugs", "To delete old files", "To compress files", "To change the file format"],
      "answer": "To add new features and fix bugs"
    },
    {
      "question": "What does the term 'cloud storage' refer to?",
      "options": ["Storing data on local devices", "Storing data on remote servers", "Storing data on external drives", "Storing data in RAM"],
      "answer": "Storing data on remote servers"
    },
    {
      "question": "What is the purpose of a firewall?",
      "options": ["To protect a network from unauthorized access", "To store data", "To manage user accounts", "To provide internet connectivity"],
      "answer": "To protect a network from unauthorized access"
    },
    {
      "question": "What does the term 'URL' stand for?",
      "options": ["Uniform Resource Locator", "Universal Resource Locator", "Uniform Resource Link", "Universal Resource Link"],
      "answer": "Uniform Resource Locator"
    },
    {
      "question": "What is the function of the Ctrl+S shortcut?",
      "options": ["Save the current document", "Open a new document", "Close the application", "Print the document"],
      "answer": "Save the current document"
    },
    {
      "question": "What is the purpose of a web server?",
      "options": ["To host websites and serve content", "To create documents", "To manage files", "To browse the internet"],
      "answer": "To host websites and serve content"
    },
    {
      "question": "What is the role of a motherboard?",
      "options": ["To connect all components of a computer", "To store data", "To process data", "To manage power supply"],
      "answer": "To connect all components of a computer"
    },
    {
      "question": "What does the term 'bandwidth' refer to?",
      "options": ["The amount of data that can be transmitted in a given time", "The speed of a processor", "The size of a hard drive", "The capacity of RAM"],
      "answer": "The amount of data that can be transmitted in a given time"
    },
    {
      "question": "What is the function of the Ctrl+F shortcut?",
      "options": ["To find text in a document", "To save files", "To close applications", "To refresh the page"],
      "answer": "To find text in a document"
    }
  ]
};

// Function to shuffle an array using Fisher-Yates algorithm
const shuffleArray = (array) => {
  let shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const QuizModal = ({ isOpen, onClose }) => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [questions, setQuestions] = useState([]); // Store shuffled questions
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [timer, setTimer] = useState(10 * 60); // 10 minutes in seconds
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const [userName, setUserName] = useState("Primidac");
  const [attestationUID, setAttestationUID] = useState(null);


  useEffect(() => {
    if (!isOpen) return;
    setQuestions(shuffleArray(quizData.questions));
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setIsCompleted(false);
    setTimer(10 * 60); // Reset timer to 10 minutes
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      if (timer <= 0 || isTimerPaused) {
        clearInterval(interval);
        if (timer <= 0) setIsCompleted(true);
      } else {
        setTimer((prevTimer) => prevTimer - 1);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, timer, isTimerPaused]);

  useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_accounts", []);
      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
        const storedAttempts = localStorage.getItem(`quizAttempts_${accounts[0]}`);
        setAttempts(storedAttempts ? parseInt(storedAttempts, 10) : 0);
        fetchUserName(accounts[0]); // Fetch user's name after wallet is connected
      }
    }
  };

  // Fetch user's name using wallet address
  const fetchUserName = async (address) => {
    try {
      const response = await fetch(`https://byteapi-two.vercel.app/api/user/${address}`);
      if (!response.ok) throw new Error("Failed to fetch user data");
      const data = await response.json();
      setUserName(data.user.fullname || "Unknown User");
    } catch (error) {
      console.error("Error fetching user name:", error);
      setUserName("Unknown User");
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }
    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    if (accounts.length > 0) {
      setWalletAddress(accounts[0]);
      const storedAttempts = localStorage.getItem(`quizAttempts_${accounts[0]}`);
      setAttempts(storedAttempts ? parseInt(storedAttempts, 10) : 0);
      fetchUserName(accounts[0]); // Fetch user's name after wallet is connected
    }
  };

  const handleAnswerClick = (option) => {
    setSelectedAnswer(option);
    if (option === questions[currentQuestion].answer) {
      setScore((prev) => prev + quizData.marks_per_question);
    }
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
        setSelectedAnswer(null);
      } else {
        setIsCompleted(true);
        if (walletAddress) {
          const newAttempts = attempts + 1;
          setAttempts(newAttempts);
          localStorage.setItem(`quizAttempts_${walletAddress}`, newAttempts.toString());
        }
      }
    }, 500);
  };

  const handleAttestationSuccess = (uid) => {
    setAttestationUID(uid);
    updateCourseIdInDatabase(uid);
  };

  const updateCourseIdInDatabase = async (uid) => {
    try {
      // Fetch the user's data
      const response = await fetch(`https://byteapi-two.vercel.app/api/user/${walletAddress}`);
      if (!response.ok) throw new Error("Failed to fetch user data");
      const userData = await response.json();

      // Check if course_id exists and get the previous course data
      const prevCourseId = userData.user.course_id || {};

      // If the course_id doesn't exist yet, initialize it as an empty object
      const updatedCourseId = {
        ...prevCourseId,
        [quizData.course_title]: uid, // Add the new course and attestation UID
      };

      // Update the course_id in the user's record
      const updateResponse = await fetch(`https://byteapi-two.vercel.app/api/api/user/${walletAddress}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          course_id: updatedCourseId, // Update with the new course_id object
        }),
      });

      if (!updateResponse.ok) {
        throw new Error("Failed to update course_id in the database");
      }

      console.log("Course ID updated successfully!");
    } catch (error) {
      console.error("Error updating course_id:", error);
    }
  };

  if (!isOpen) return null;

  // Calculate the passing score (80% of total marks)
  const totalMarks = quizData.total_questions * quizData.marks_per_question;
  const passingScore = 0.8 * totalMarks; 

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.timerContainer}>
          <p className={styles.timer}>
            {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, "0")}
          </p>
        </div>

        {!walletAddress ? (
          <div className={styles.walletContainer}>
            <p>Please connect your wallet to take the quiz.</p>
            <button className={styles.connectButton} onClick={connectWallet}>
              Connect Wallet
            </button>
          </div>
        ) : attempts >= 3 ? (
          <div className={styles.limitContainer}>
            <h3>You have reached the maximum attempt limit.</h3>
            <p>You cannot retake the quiz again.</p>
          </div>
        ) : isCompleted ? (
          <div className={styles.quizCompleted}>
            <h3>Quiz Completed!</h3>
            <p className={styles.finalScore}>
              Final Score: <span>{score}</span> / {totalMarks}
            </p>
            {score >= passingScore ? (
              <>
                <p className={styles.passText}>Congratulations! You passed the quiz.</p>
                <Attest
                  walletAddress={walletAddress}
                  score={score}
                  course={quizData.course_title}
                  issuer={quizData.Issuer}
                  userName={userName}
                  onAttestationSuccess={handleAttestationSuccess}
                />
              </>
            ) : (
              <p className={styles.failText}>You did not pass the quiz. Please try again.</p>
            )}
          </div>
        ) : (
          <>
            <div className={styles.noticeContainer}>
              <p className={styles.noticeText}>
                Please read carefully before answering. You cannot go back once you answer.
              </p>
            </div>

            <h3 className={styles.questionText}>
              {questions[currentQuestion].question}
            </h3>
            <div className={styles.questionCounter}>
              <span>
                {currentQuestion + 1} / {quizData.total_questions}
              </span>
            </div>
            <ul className={styles.optionsList}>
              {questions[currentQuestion].options.map((option, index) => (
                <li
                  key={index}
                  className={`${styles.option} ${
                    selectedAnswer === option ? styles.selected : ""
                  }`}
                  onClick={() => handleAnswerClick(option)}
                >
                  {option}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

export default QuizModal;