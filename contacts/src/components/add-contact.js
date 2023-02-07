import { useState } from "react";

import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import { useHistory } from "react-router-dom";

import axios from "axios";

const AddContact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [company, setCompany] = useState("");
  const [size, setSize] = useState("");
  const [industry, setIndustry] = useState("");
  const [designation, setDesignation] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    axios
      .post("https://contacts-my76.onrender.com/contacts", {
        name,
        email,
        phone,
        country,
        company,
        designation,
        size,
        industry,
      })
      .then((response) => {
        setSize("");
        setName("");
        setCompany("");
        setCountry("");
        setDesignation("");
        setPhone("");
        setEmail("");
        setIndustry("");
        toast("Contact added");
      })
      .catch(function (error) {
        console.log("error", error);
        toast.error("There was error adding the contact", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      });
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="row">
        <h3>Add Contact</h3>
        <hr />

        <div className="col-md-6">
          <div className="form-floating mb-3 ">
            <input
              type="text"
              className="form-control"
              id="name"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <label htmlFor="name">Name</label>
          </div>
          <div className="form-floating mb-3 ">
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="email">Email address</label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              id="phone"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <label htmlFor="phone">Phone</label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              id="size"
              placeholder="Size"
              value={size}
              onChange={(e) => setSize(e.target.value)}
            />
            <label htmlFor="size">Size</label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              id="industry"
              placeholder="Industry"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
            />
            <label htmlFor="industry">Industry</label>
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              id="designation"
              placeholder="Designation"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
            />
            <label htmlFor="designation">Designation</label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              id="company"
              placeholder="Company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
            <label htmlFor="company">Company</label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              id="country"
              placeholder="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
            <label htmlFor="country">Country</label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="submit"
              className="btn btn-warning w-100 p-3"
              value={"Add Contact"}
            />
          </div>
        </div>
        <ToastContainer />
      </div>
    </form>
  );
};

export default AddContact;
