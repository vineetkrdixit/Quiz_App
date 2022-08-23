import React, { useEffect, useState } from "react";

import "../Components/Quiz.css";
import axios from "axios";
const Quiz = () => {
  const [quizData, setQuizData] = useState();
  const [processBar, setProcessBar] = useState(5);
  const [startIndex, setStartIndex] = useState(0);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [questionCat, setQuestionCat] = useState("");
  const [questions, setQuestions] = useState("");
  const [option, setOption] = useState();
  const [checkClickAnswer, setCheckClickAnswer] = useState("");
  const [currentScore, setCurrentScore] = useState(0);
  const [highScore, setHighScore] = useState(75);
  const [disableAnswer, setDisableAnswer] = useState(false);
  //   const [corectAnswer, setCorrectAnswer] = useState({
  //     color: "black",
  //     backgroundColor: "#d6d6cd",
  //   });
  const [cAnswer, setCAnswer] = useState();
  const [nextButton, setNextButton] = useState(true);
  const [star, setStar] = useState();

  //Load all the Quiz
  const loadQuiz = async () => {
    console.log(quizData);

    try {
      let data = await axios.get("./questions.json");
      console.log(data);

      if (data) {
        setQuizData(data.data);
        setDataLoaded(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //Creating a Progress Bar
  const settingProcessBar = () => {
    const totalQuestion = quizData.length;
    let process = 100 / totalQuestion;
    console.log(totalQuestion);
    console.log(process);
    setProcessBar(process);
  };

  console.log(processBar);

  //Creating Categories
  const loadCate = () => {
    let categ = decodeURIComponent(quizData[startIndex].category);

    console.log(categ);
    setQuestionCat(categ);
  };

  //   creating stars
  const loadStars = () => {
    let stars = quizData[startIndex].difficulty;
    if (stars == "hard") {
      setStar(3);
    } else if (stars == "medium") {
      setStar(2);
    } else {
      setStar(1);
    }

    console.log(stars);
  };

  //Create Questions
  const generateQuestion = () => {
    const question = quizData[startIndex].question;
    let newQuestion = decodeURIComponent(question);
    setQuestions(newQuestion);
  };

  //Setting Options
  const settingUpOptions = () => {
    const options = [
      quizData[startIndex].correct_answer,
      ...quizData[startIndex].incorrect_answers,
    ];
    let decocedOptions = options.map((op, index) => {
      return decodeURIComponent(op);
    });

    setOption(decocedOptions);
  };

  //Handel Click
  const checkAnswer = (e) => {
    e.preventDefault();
    console.log(e.target.value);
    let correctAnswer = decodeURIComponent(quizData[startIndex].correct_answer);
    setCAnswer(correctAnswer);
    console.log(e.target.name);

    if (e.target.value === correctAnswer) {
      console.log("Correct Answer");
      setCheckClickAnswer("Correct !");
      setCurrentScore(currentScore + 5);
      //   setHighScore(highScore + 5);

      setDisableAnswer(true);
    } else {
      setCheckClickAnswer("Sorry !");
      setDisableAnswer(true);
      //   setCorrectAnswer({
      //     color: "white",
      //     backgroundColor: "#30302e",
      //   });
      console.log("Wrong Answer");
    }
  };

  const nextQuestion = (e) => {
    e.preventDefault();
    setCheckClickAnswer("");
    setStartIndex(startIndex + 1);
    setProcessBar(processBar + 5);
    setDisableAnswer(false);
    // setCorrectAnswer({
    //   color: "black",
    //   backgroundColor: "#d6d6cd",
    // });
  };

  useEffect(() => {
    loadQuiz();
  }, []);

  useEffect(() => {
    loadQuiz();
  }, [startIndex]);

  useEffect(() => {
    if (dataLoaded === true) {
      loadCate();
      generateQuestion();
      settingUpOptions();
      loadStars();
    }
  }, [quizData]);

  useEffect(() => {
    if (dataLoaded === true) {
      settingProcessBar();
    }
  }, []);
  useEffect(() => {
    if (startIndex === 19) {
      setNextButton(false);
    }
  });

  console.log(questionCat);

  if (!dataLoaded) {
    return <h3>Loading...</h3>;
  } else {
    //   if (startIndex > 20) {
    //     return <h3>Loading...</h3>;
    //   } else {
    return (
      <>
        <div className="outer-div">
          <div className="external-processBar">
            <div
              className="processBar"
              style={{ width: `${processBar}%` }}
            ></div>
          </div>
          <div className="container-fluid QuizDiv">
            <div className="col-sm-1"></div>
            <div className="col-sm-4 quizBody">
              <div className="questionNo">
                <h1>Question {startIndex + 1} of 20</h1>
              </div>
              <div>
                <h6 className="Category">{questionCat}</h6>
              </div>
              <div>
                {[...Array(3)].map((val, index) => {
                  return (
                    <i
                      className={index < star ? "fa fa-star" : "fa fa-star-o"}
                      key={index}
                    >
                      &nbsp;
                    </i>
                  );
                })}
              </div>
              <div>
                <div className="question">
                  <h4>{questions}</h4>
                </div>
                <div className="answer">
                  {option &&
                    option.map((value, index) => {
                      return (
                        <button
                          style={{
                            backgroundColor:
                              cAnswer === value ? "black" : "#d6d6cd",
                            color: cAnswer === value ? "white" : "black",
                          }}
                          className="answerBox answer1"
                          key={index}
                          name={value}
                          value={value}
                          onClick={checkAnswer}
                          disabled={disableAnswer}
                        >
                          {value}
                        </button>
                      );
                    })}
                </div>
              </div>
              <div>
                <div className="newQuestion">
                  <h3>{checkClickAnswer}</h3>
                  {nextButton && (
                    <button onClick={nextQuestion}>Next Question</button>
                  )}
                </div>
              </div>
              <div className="scoreBoard">
                <h6>Score:{currentScore}</h6>
                <h6>Max Score:{highScore}</h6>
              </div>
              <div className="resultDiv">
                <div
                  className="highScore"
                  style={{ width: `${highScore}%` }}
                ></div>
                <div
                  className="currentScore"
                  style={{ width: `${currentScore}%` }}
                ></div>
              </div>
            </div>
            <div className="col-sm-7"></div>
          </div>
        </div>
      </>
    );
  }
};

export default Quiz;
