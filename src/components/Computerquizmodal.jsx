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
      "question": "_____ and _____ are the primary components of a computer's central processing unit (CPU).",
      "options": [
        "ALU and Control Unit",
        "CPU and RAM",
        "Motherboard and CPU",
        "Processor and Hard Drive"
      ],
      "answer": "ALU and Control Unit"
    },
    {
      "question": "_____ and _____ are the most common operating systems used on personal computers.",
      "options": [
        "Windows and Linux",
        "Windows and macOS",
        "macOS and Ubuntu",
        "Windows and Android"
      ],
      "answer": "Windows and macOS"
    },
    {
      "question": "_____ and _____ are examples of input devices used in computing.",
      "options": [
        "Keyboard and Mouse",
        "Monitor and Printer",
        "Speaker and Microphone",
        "Monitor and Keyboard"
      ],
      "answer": "Keyboard and Mouse"
    },
    {
      "question": "_____ and _____ are the two main types of memory in a computer system.",
      "options": [
        "RAM and ROM",
        "Cache and ROM",
        "RAM and Hard Disk",
        "ROM and SSD"
      ],
      "answer": "RAM and ROM"
    },
    {
      "question": "_____ and _____ are key differences between a solid-state drive (SSD) and a hard disk drive (HDD).",
      "options": [
        "Speed and Power Consumption",
        "Price and Storage Capacity",
        "Size and Portability",
        "Price and Speed"
      ],
      "answer": "Speed and Power Consumption"
    },
    {
      "question": "_____ and _____ are the most important factors affecting computer performance.",
      "options": [
        "Processor Speed and RAM Size",
        "Hard Drive and GPU",
        "RAM Size and Software Updates",
        "Operating System and Processor Speed"
      ],
      "answer": "Processor Speed and RAM Size"
    },
    {
      "question": "_____ and _____ are the primary tasks performed by an operating system.",
      "options": [
        "Managing Memory and Running Applications",
        "Running Applications and Managing Hardware",
        "Managing Hardware and Software Updates",
        "Running Applications and Networking"
      ],
      "answer": "Managing Memory and Running Applications"
    },
    {
      "question": "_____ and _____ are common types of file systems used in modern computers.",
      "options": [
        "NTFS and FAT32",
        "exFAT and EXT4",
        "NTFS and EXT4",
        "FAT32 and exFAT"
      ],
      "answer": "NTFS and EXT4"
    },
    {
      "question": "_____ and _____ are examples of network protocols used to transmit data over the internet.",
      "options": [
        "HTTP and FTP",
        "TCP and UDP",
        "HTTP and UDP",
        "FTP and SMTP"
      ],
      "answer": "HTTP and FTP"
    },
    {
      "question": "_____ and _____ are typical functions of the control unit in a CPU.",
      "options": [
        "Fetching and Decoding Instructions",
        "Performing Arithmetic Operations and Writing Data",
        "Reading Data and Writing Instructions",
        "Executing Operations and Controlling Input Devices"
      ],
      "answer": "Fetching and Decoding Instructions"
    },
    {
      "question": "_____ and _____ are the main functions of the input and output devices in a computer system.",
      "options": [
        "Accepting Data and Displaying Data",
        "Storing Data and Printing Data",
        "Sending Data and Receiving Data",
        "Providing Data and Controlling Software"
      ],
      "answer": "Accepting Data and Displaying Data"
    },
    {
      "question": "_____ and _____ are critical components of a computer's motherboard.",
      "options": [
        "CPU and RAM",
        "Processor and Hard Drive",
        "RAM and Graphics Card",
        "Chipset and Processor"
      ],
      "answer": "Chipset and Processor"
    },
    {
      "question": "_____ and _____ are examples of types of software used for word processing and document editing.",
      "options": [
        "Word and Excel",
        "Word and Google Docs",
        "Word and Pages",
        "Excel and PowerPoint"
      ],
      "answer": "Word and Google Docs"
    },
    {
      "question": "_____ and _____ are the primary differences between hardware and software.",
      "options": [
        "Physical and Non-Physical",
        "Temporary and Permanent",
        "Expensive and Cheap",
        "External and Internal"
      ],
      "answer": "Physical and Non-Physical"
    },
    {
      "question": "_____ and _____ are the two primary functions of a graphics card (GPU).",
      "options": [
        "Rendering Images and Accelerating Processing",
        "Displaying Images and Storing Data",
        "Processing Data and Printing Documents",
        "Decoding Video and Editing Images"
      ],
      "answer": "Rendering Images and Accelerating Processing"
    },
    {
      "question": "_____ and _____ are the main types of cables used for connecting a computer to external devices.",
      "options": [
        "USB and HDMI",
        "USB and VGA",
        "VGA and HDMI",
        "Ethernet and VGA"
      ],
      "answer": "USB and HDMI"
    },
    {
      "question": "_____ and _____ are common reasons for a computer to slow down over time.",
      "options": [
        "Too many files and outdated software",
        "Low RAM and high CPU usage",
        "Too many applications running and insufficient storage",
        "Low storage and outdated graphics card"
      ],
      "answer": "Too many applications running and insufficient storage"
    },
    {
      "question": "_____ and _____ are examples of storage devices that can be used for backing up data.",
      "options": [
        "USB Flash Drive and External Hard Drive",
        "External SSD and Flash Drive",
        "Cloud Storage and Optical Disks",
        "External Hard Drive and Cloud Storage"
      ],
      "answer": "External Hard Drive and Cloud Storage"
    },
    {
      "question": "_____ and _____ are common network topologies used in local area networks (LANs).",
      "options": [
        "Bus and Star",
        "Star and Mesh",
        "Ring and Tree",
        "Bus and Mesh"
      ],
      "answer": "Bus and Star"
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
  const [quizAttempts, setQuizAttempts] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [timer, setTimer] = useState(10 * 60); // 10 minutes
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const [userName, setUserName] = useState("Unknown User");
  const [attestationUID, setAttestationUID] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    setQuestions(shuffleArray(quizData.questions));
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setIsCompleted(false);
    setTimer(10 * 60);
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
        fetchUserData(accounts[0]); // Fetch user data
      }
    }
  };

  const fetchUserData = async (address) => {
    try {
      const response = await fetch(`https://byteapi-two.vercel.app/api/user/${address}`);
      if (!response.ok) throw new Error("Failed to fetch user data");
      const data = await response.json();
      setUserName(data.user.fullname || "Unknown User");
      setQuizAttempts(data.user.quiz_attempts || 0); // Set quiz attempts from database
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUserName("Unknown User");
      setQuizAttempts(0);
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
      fetchUserData(accounts[0]); // Fetch user data after connecting wallet
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
          updateQuizAttempts(walletAddress);
        }
      }
    }, 500);
  };

  const updateQuizAttempts = async (address) => {
    try {
      const newAttempts = quizAttempts + 1;
      setQuizAttempts(newAttempts); // Update state immediately

      const response = await fetch(`https://byteapi-two.vercel.app/api/api/user/${address}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quiz_attempts: newAttempts }),
      });

      if (!response.ok) throw new Error("Failed to update quiz attempts");
      console.log("Quiz attempts updated successfully!");
    } catch (error) {
      console.error("Error updating quiz attempts:", error);
    }
  };

  const handleAttestationSuccess = (uid) => {
    setAttestationUID(uid);
    updateCourseIdInDatabase(uid);
  };

  const updateCourseIdInDatabase = async (uid) => {
    try {
      const response = await fetch(`https://byteapi-two.vercel.app/api/user/${walletAddress}`);
      if (!response.ok) throw new Error("Failed to fetch user data");
      const userData = await response.json();
      const prevCourseId = userData.user.course_id || {};

      const updatedCourseId = {
        ...prevCourseId,
        [quizData.course_title]: uid,
      };

      const updateResponse = await fetch(`https://byteapi-two.vercel.app/api/api/user/${walletAddress}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ course_id: updatedCourseId }),
      });

      if (!updateResponse.ok) throw new Error("Failed to update course_id");
      console.log("Course ID updated successfully!");
    } catch (error) {
      console.error("Error updating course_id:", error);
    }
  };

  if (!isOpen) return null;

  const progress = ((currentQuestion + 1) / quizData.total_questions) * 100;

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
        ) : quizAttempts >= 3 ? (
          <div className={styles.limitContainer}>
            <h3>You have reached the maximum attempt limit.</h3>
            <p>You cannot retake the quiz again.</p>
          </div>
        ) : isCompleted ? (
          <div className={styles.quizCompleted}>
            <h3>Quiz Completed!</h3>
            <p className={styles.finalScore}>
              Final Score: <span>{score}</span> / {quizData.total_questions * quizData.marks_per_question}
            </p>
            {attestationUID ? (
              <>
                <a
                  href={`https://arbitrum.easscan.org/attestation/view/${attestationUID}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.attestButton}
                >
                  View Attestation
                </a>
                <button className={styles.closeButton} onClick={onClose}>
                  Close
                </button>
              </>
            ) : (
              <>
                <Attest
                  walletAddress={walletAddress}
                  score={score}
                  course={quizData.course_title}
                  issuer={quizData.Issuer}
                  userName={userName}
                  onAttestationSuccess={handleAttestationSuccess}
                />
                <button
                  className={styles.retakeButton}
                  onClick={() => {
                    setQuestions(shuffleArray(quizData.questions));
                    setCurrentQuestion(0);
                    setSelectedAnswer(null);
                    setScore(0);
                    setIsCompleted(false);
                    setTimer(10 * 60);
                  }}
                >
                  Retake Quiz
                </button>
              </>
            )}
          </div>
        ) : (
          <>
          <div className={styles.noticeContainer}>
            <p className={styles.noticeText}>
              Please read carefully before answering. You cannot go back once you answer.
            </p>
          </div>

          {/* Progress Bar */}
          <div className={styles.progressBarContainer}>
            <div
              className={styles.progressBar}
              style={{ width: `${progress}%` }}
            ></div>
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