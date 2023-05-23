import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import CreateVotes from "./Components/CreateVotes";
import Votes from "./Components/Votes";
import Navbar from "./Components/Navbar";

import { connect, getContract } from "./contract";

import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [contract, setContract] = useState(null);
  const [connected, setConnected] = useState(false);
  const [isMember, setIsMember] = useState(false);

  const handleInit = () => {
    setConnected(true);
    getContract().then(({ contract, signer }) => {
      setContract(contract);

      if (contract) {
        signer.getAddress().then((address) => {
          contract.members(address).then((result) => setIsMember(result));
        });
      }
    });
  };

  const connectWallet = async () => {
    const { contract } = connect();
    setContract(contract);
    if (contract) {
      setConnected(true);
    }
  };

  const becomeMember = async () => {
    if (!contract) {
      alert("Please connect to metamask");
      return;
    }

    await contract
      .join()
      .then(() => {
        alert("Joined");
        setIsMember(true);
      })
      .catch((error) => alert(error.message));
  };

  useEffect(() => {
    window.ethereum.request({ method: "eth_accounts" }).then((accounts) => {
      if (accounts.length > 0) {
        handleInit();
      } else setConnected(false);
    });
  }, []);
  return (
    <Router>
      <Navbar
        connect={connectWallet}
        connected={connected}
        becomeMember={becomeMember}
        isMember={isMember}
      />
      <div className="container">
        <Routes>
          <Route path="create-vote" element={<CreateVotes />} />
          <Route path="votes" element={<Votes />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
