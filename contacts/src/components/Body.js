import AddContact from "./add-contact";
import AllContacts from "./all-contacts";
import ImportContacts from "./import-contacts";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./Header";

const Body = () => {
  return (
    <Router>
      <Header />
      <div className="body">
        <div className="container">
          <div>
            <Routes>
              <Route exact path="/" element={<AllContacts />} />

              <Route path="/add" element={<AddContact />} />

              <Route path="/import" element={<ImportContacts />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default Body;
