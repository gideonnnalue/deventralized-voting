import { useState, useEffect } from "react";
import { Button, Card, card, ProgressBar } from "react-bootstrap";

const Votes = ({ contract }) => {
  const gateway = "https://gateway.pinata.cloud/";
  const [votes, setVotes] = useState([]);

  const setVotesData = async (votes) => {
    const promises = [];
    const newVotes = [];
    for (const vote of votes) {
      const { owner, voteId, createdAt, endTime } = vote.args;
      const promise = contract.getVote(voteId).then(async (voteData) => {
        const uri = voteData[0];
        if (!uri) return;

        const currentVotes = voteData[2];
        const currentVotesNumbers = currentVotes.map((val) => val.toNumber());
        const newVote = {
          id: voteId.toNumber(),
          owner,
          createdAt: createdAt.toNumber(),
          endTime: endTime.toNumber(),
          totalVotes: currentVotesNumbers.reduce(
            (sum, value) => sum + value,
            0
          ),
          votes: currentVotesNumbers,
        };

        try {
          await fetch(gateway + uri)
            .then((result) => result.json())
            .then((data) => {
              newVote.description = data.description;
              newVote.options = data.option;
              newVotes.push(newVote);
            });
        } catch (e) {}
      });
      promises.push(promise);
    }
    await Promise.all(promises);
    setVotes(newVotes);
  };

  const votePressed = async (id, optionIndex) => {
    await contract
      .vote(id, optionIndex)
      .then(() => alert("Success"))
      .catch((error) => alert(error.message));
  };

  useEffect(() => {
    if (!contract) return;
    const filter = contract.filters.VoteCreated();
    contract
      .queryFilter(filter)
      .then((result) => {
        setVotesData(result);
      })
      .catch((error) => console.log(error));
  }, [contract]);

  return (
    <div>
      {votes?.map((vote) => (
        <Card key={vote?.id} className="my-2">
          <Card.Header>{vote?.description}</Card.Header>
          <Card.Body>
            {vote?.options?.map((option, i) => (
              <div className="mt-1" key={Math.random() + i}>
                <p>
                  {option}:{" "}
                  {(vote.votes[i] / Math.max(1, vote.totalVotes)) * 100}%
                </p>
                <div className="d-flex w-100 align-items-center">
                  <ProgressBar
                    now={(vote.votes[i] / Math.max(1, vote.totalVotes)) * 100}
                    label={`${vote.votes[i]}`}
                    className="w-100 me-2"
                  />
                  <Button
                    onClick={() => votePressed(vote.id, i)}
                    variant="dark"
                  >
                    Vote
                  </Button>
                </div>
              </div>
            ))}
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default Votes;
