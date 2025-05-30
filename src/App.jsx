import React from "react"
import clsx from 'clsx';
import Confetti from 'react-confetti'
import { languages } from "./languages"
import { getFarewellText, getRandomWord } from "./utils";

export default function AssemblyEndgame() {

  const [currentWord, setCurrentWord] = React.useState(() => getRandomWord())
  const [guessedLetters, setGuessedLetters] = React.useState([])

  const alphabet = 'abcdefghijklmnopqrstuvwxyz'

  const wrongGuessedCount = 
    guessedLetters.filter(letter => !currentWord.includes(letter)).length
  const isGameWon = 
    currentWord.split("").every(letter => guessedLetters.includes(letter))
  const isGameLost = wrongGuessedCount >= languages.length - 1
  const isGameOver = isGameWon || isGameLost
  const lastGuessedLetter = guessedLetters[guessedLetters.length - 1]
  const isLastGuessIncorrect = lastGuessedLetter && !currentWord.includes(lastGuessedLetter) 

  function startNewGame() {
    setCurrentWord(getRandomWord())
    setGuessedLetters([])
  }

  const languageElements = languages.map((lang, index) => {
    const className = clsx('chip', {
      'lost': wrongGuessedCount > index
    })
    const styles = {
      backgroundColor: lang.backgroundColor,
      color: lang.color
    }
    return (
      <span 
        className={className}
        style={styles}
        key={lang.name}
      >
        {lang.name}
      </span>
    )
  })

  const letterElements = currentWord.split("").map((letter, index) => {
    const shouldRevealLetter = isGameLost || guessedLetters.includes(letter)
    const letterClassName = clsx(
      isGameLost && !guessedLetters.includes(letter) && "missed-letter"
    )
    return (
      <span 
        key={index}
        className={letterClassName}
      >
        {shouldRevealLetter ? letter.toUpperCase() : ""}
      </span>
    )
  })

  const keybordElements = alphabet.split("").map((letter, index) => {
    const isGuessed = guessedLetters.includes(letter)
    const isCorrect  = isGuessed && currentWord.includes(letter)
    const isWrong = isGuessed && !currentWord.includes(letter)
    const className = clsx({
      correct: isCorrect,
      wrong: isWrong
    })
    return (
      <button
        key={index}
        disabled={isGameOver}
        aria-disabled={guessedLetters.includes(letter)}
        aria-label={`Letter ${letter}`}
        className={className}
        onClick={() => addGuessedLetter(letter)}
      >
          {letter.toUpperCase()}
      </button>
    )
  })

  function addGuessedLetter(letter) {
    setGuessedLetters(prevLetters => {
      return prevLetters.includes(letter) ? prevLetters : [...prevLetters, letter]
    })
  }

  const  gameStatusClass = clsx("game-status", {
    won: isGameWon,
    lost: isGameLost,
    farewell: !isGameOver && isLastGuessIncorrect
  })

  function renderGameStatus() {
    if (!isGameOver && isLastGuessIncorrect) {
      return <p className="farewell-message">{getFarewellText(languages[wrongGuessedCount - 1].name)}</p>
    }
    if (isGameWon) {
      return (
        <>
          <h2>You win!</h2>
          <p>Well done! 🎉</p>
        </>
      )
    } 
    if (isGameLost) {
      return (
        <>
          <h2>Game over!</h2>
          <p>You lose! Better start learning Assembly 😭</p>
        </>
      )
    }
    return null
  }

  return (
    <main>
      {
        isGameWon && <Confetti
          recycle={false}
          numberOfPieces={1000}
        />
      }
      <header>
        <h1>Assembly: Endgame</h1>
        <p>Guess the word in under 8 attempts to keep the programming world safe from Assembly!</p>
      </header>

      <section aria-live="polite" role="status" className={gameStatusClass}>
        {renderGameStatus()}
      </section>

      <section className="language-chips">
        {languageElements}
      </section>

      <section className="word">
        {letterElements}
      </section>

      <section className="keybord">
        {keybordElements}
      </section>

      {isGameOver && <button className="new-game" onClick={startNewGame}>New Game</button>}

    </main>
  )
}
