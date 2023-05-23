import { useState } from "react";
import { Button, Form } from "react-bootstrap";

const CreateVotes = ({ contract }) => {
  const [uri, setUri] = useState("");
  const [options, setOptions] = useState(2);
  const [endDate, setEndDate] = useState("");

  const createVote = () => {
    if (!contract) {
      alert("Please connect to Metamask.");
      return;
    }
    contract
      .createVote(uri, new Date(endDate).getTime(), options)
      .then(() => alert("Success"))
      .catch((error) => alert(error.message));
  };
  return (
    <Form className="m-2">
      <h2 className="d-flex justify-content-center">Create Vote</h2>
      <Form.Group className="m-2">
        <Form.Label htmlFor="uri">IPFS URI</Form.Label>
        <Form.Control
          type="text"
          name="uri"
          placeholder="IPFS URI"
          value={uri}
          onChange={(e) => setUri(e.target.value)}
        />
      </Form.Group>
      <Form.Group className="m-2">
        <Form.Label htmlFor="options">Number of Options</Form.Label>
        <Form.Control
          type="number"
          name="options"
          min={2}
          max={2}
          value={options}
          onChange={(e) => setOptions(e.target.value)}
        />
      </Form.Group>
      <Form.Group className="m-2">
        <Form.Label htmlFor="endDate">End Date</Form.Label>
        <Form.Control
          type="date"
          name="endDate"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </Form.Group>
      <Form.Group className="m-2 mt-4">
        <Button variant="success" onClick={createVote}>
          {" "}
          Create
        </Button>
      </Form.Group>
    </Form>
  );
};

export default CreateVotes;
