import React from 'react';
import ResultCard from './ui/ResultCard';
import HorizontalSwipeList from './ui/HorizontalSwipeList';

interface RoundResult {
  userID: string;
  score: number;
}


type ResultsList = {
  results: DeepReadonly<RoundResult[]>;
};

const ResultsList: React.FC<ResultsList> = ({ results }) => {
  return (
    <div className="mx-auto max-h-full flex flex-col">
      <HorizontalSwipeList>
        {results.map((result, i) => (
          <ResultCard key={i} results={[
              {
                nominationID: result.userID,
                nominationText: "Some text here",
                score: result.score,
              },
            ]} />
        ))}
      </HorizontalSwipeList>
    </div>
  );
};

export default ResultsList;
