import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { render } from "react-dom";
import { AgGridReact } from "ag-grid-react";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import axios from "axios";

const AllContacts = () => {
  const gridRef = useRef(); // Optional - for accessing Grid's API
  const [rowData, setRowData] = useState(); // Set rowData to Array of Objects, one Object per Row

  // Each Column Definition results in one Column.
  const [columnDefs, setColumnDefs] = useState([
    { field: "name", filter: true },
    { field: "designation" },
    { field: "email", filter: true },
    { field: "country" },
    { field: "company" },
    { field: "city" },
    { field: "phone" },
  ]);

  // DefaultColDef sets props common to all Columns
  const defaultColDef = useMemo(() => ({
    sortable: true,
  }));

  // Example of consuming Grid Event
  const cellClickedListener = useCallback((event) => {
    console.log("cellClicked", event);
  }, []);

  // Example using Grid's API
  const buttonListener = useCallback((e) => {
    gridRef.current.api.deselectAll();
  }, []);

  // Example load data from sever
  useEffect(() => {
    axios
      .get("http://localhost:4000/contacts")
      .then((rowData) => setRowData(rowData.data));
  }, []);

  return (
    <>
      <h3>All Contacts</h3>
      <hr />
      <div className="ag-theme-alpine" style={{ height: 330 }}>
        <AgGridReact
          className="ag-theme-alpine"
          animateRows="true"
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          enableRangeSelection="true"
          rowData={rowData}
          rowSelection="multiple"
          suppressRowClickSelection="true"
        />
      </div>
    </>
  );
};
export default AllContacts;
