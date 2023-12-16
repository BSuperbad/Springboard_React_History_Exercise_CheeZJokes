import React, {useState, useEffect, useCallback } from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

/** List of jokes. */

const JokeList = ({numJokesToGet = 5})=> {
  const [jokes, setJokes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

/* retrieve jokes from API */
const getJokes = useCallback(async () => {
  try{
    let newJokes = [];
    let seenJokes = new Set();
    while (newJokes.length < numJokesToGet) {
      let res = await axios.get("https://icanhazdadjoke.com", {
          headers: { Accept: "application/json" },
        });
      let {...joke} = res.data;
      if(!seenJokes.has(joke.id)){
        seenJokes.add(joke.id);
        newJokes.push({...joke, votes: 0});
      } else {
        console.log("duplicate found!");
      }
    }
    setJokes(newJokes);
    setIsLoading(false);
  } catch (err) {
    console.error(err);
  }
}, [numJokesToGet]);

/* at mount, get jokes */
  useEffect(()=> {
    getJokes();
  }, [getJokes]);

 /* empty joke list, set to loading state, and then call getJokes */
const generateNewJokes = () => {
  setIsLoading(true);
  getJokes();

};

  /* change vote for this id by delta (+1 or -1) */

  const vote = (id, delta) => {
    setJokes((prevJokes) => 
      prevJokes.map((j) =>
        j.id === id ? { ...j, votes: j.votes + delta }: j
      )
    );
  };

  let sortedJokes = [...jokes].sort((a,b) => b.votes - a.votes);

  /* render: either loading spinner or list of sorted jokes. */

  if(isLoading) {
    return (
      <div className="loading">
        <i className="fas fa-4x fa-spinner fa-spin" />
      </div>
    );
  }

    return (
      <div className="JokeList">
        <button
          className="JokeList-getmore"
          onClick={generateNewJokes}>
          Get New Jokes
        </button>

        {sortedJokes.map((j) => (
          <Joke
            text={j.joke}
            key={j.id}
            id={j.id}
            votes={j.votes}
            vote={vote}
          />
        ))}
      </div>
    );
  }

export default JokeList;
