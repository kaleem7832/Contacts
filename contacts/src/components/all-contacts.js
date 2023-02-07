import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";

import { useNavigate } from "react-router-dom";

import MaterialReactTable from "material-react-table";

import { Box, Button } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import DeleteIcon from "@mui/icons-material/Delete";

import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import { ExportToCsv } from "export-to-csv"; //or use your library of choice here

import axios from "axios";

const AllContacts = () => {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [rowCount, setRowCount] = useState(0);
  const [refresh, setRefresh] = useState("");

  //Edit component states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [company, setCompany] = useState("");
  const [industry, setIndustry] = useState("");
  const [size, setSize] = useState("");
  const [id, setId] = useState("");
  const [designation, setDesignation] = useState("");

  //table state
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });
  //defining columns outside of the component is fine, is stable
  const columns = useMemo(() => [
    {
      accessorKey: "name",
      header: "Name",
      size: 120,
    },

    {
      accessorKey: "designation",
      header: "Designation",
      size: 120,
    },
    {
      accessorKey: "company",
      header: "Company",
      size: 120,
    },
    {
      accessorKey: "country",
      header: "Country",
      size: 120,
    },
    {
      accessorKey: "industry",
      header: "Industry",
      size: 120,
    },

    {
      accessorKey: "size",
      header: "Company size",
      size: 120,
    },
    {
      accessorKey: "email",
      header: "Email",
      size: 220,
    },
    {
      accessorKey: "phone",
      header: "Pone",
      size: 120,
    },
  ]);

  const csvOptions = {
    fieldSeparator: ",",
    quoteStrings: '"',
    decimalSeparator: ".",
    showLabels: true,
    useBom: true,
    useKeysAsHeaders: false,
    headers: columns.map((c) => c.header),
  };

  const onSubmit = (e) => {
    e.preventDefault();
    axios
      .put("https://contacts-my76.onrender.com/contacts/" + id, {
        name,
        email,
        phone,
        country,
        company,
        industry,
        designation,
        size,
      })
      .then((response) => {
        setSize("");
        setName("");
        setCompany("");
        setCountry("");
        setDesignation("");
        setPhone("");
        setEmail("");
        setId("");
        setRefresh(new Date());
        document.getElementById("myId").close();
        toast("Contact updated");
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
  const csvExporter = new ExportToCsv(csvOptions);
  const closeModal = (e) => {
    e.preventDefault();
    document.getElementById("myId").close();
  };
  //if you want to avoid useEffect, look at the React Query example instead
  useEffect(() => {
    const fetchData = async () => {
      if (!data.length) {
        setIsLoading(true);
      } else {
        setIsRefetching(true);
      }

      const url = new URL(
        "/contacts",
        process.env.NODE_ENV === "production"
          ? "https://contacts-my76.onrender.com"
          : "https://contacts-my76.onrender.com"
      );
      url.searchParams.set(
        "start",
        `${pagination.pageIndex * pagination.pageSize}`
      );
      url.searchParams.set("size", `${pagination.pageSize}`);
      url.searchParams.set("filters", JSON.stringify(columnFilters ?? []));
      url.searchParams.set("globalFilter", globalFilter ?? "");
      url.searchParams.set("sorting", JSON.stringify(sorting ?? []));

      try {
        const response = await fetch(url.href);
        const json = await response.json();
        setData(json.data);
        setRowCount(json.meta.totalRowCount);
      } catch (error) {
        setIsError(true);
        console.error(error);
        return;
      }
      setIsError(false);
      setIsLoading(false);
      setIsRefetching(false);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    columnFilters,
    globalFilter,
    pagination.pageIndex,
    pagination.pageSize,
    sorting,
    refresh,
  ]);

  const handleDeleteRows = (rows) => {
    var cnf = window.confirm("Do you want to delete " + rows.length + " rows?");
    if (cnf) {
      var ids = [];
      rows.map((r) => ids.push(r.id));
      axios
        .delete("https://contacts-my76.onrender.com/contacts", {
          data: {
            ids: ids,
          },
        })
        .then(() => {
          setRefresh(new Date());
          toast(rows.length + " Contact deleted successfuly!");
        });
    }
  };

  const handleExportData = () => {
    var csv = data;
    csv.map((c) => {
      delete c._id;
    });

    csvExporter.generateCsv(csv);
  };

  return (
    <>
      <h3>All Contacts</h3>
      <hr />
      <MaterialReactTable
        columns={columns}
        data={data}
        enableRowSelection
        getRowId={(row) => row._id}
        initialState={{ showColumnFilters: false, density: "compact" }}
        manualFiltering
        manualPagination
        manualSorting
        muiToolbarAlertBannerProps={
          isError
            ? {
                color: "error",
                children: "Error loading data",
              }
            : undefined
        }
        onColumnFiltersChange={setColumnFilters}
        onGlobalFilterChange={setGlobalFilter}
        onPaginationChange={setPagination}
        onSortingChange={setSorting}
        rowCount={rowCount}
        state={{
          columnFilters,
          globalFilter,
          isLoading,
          pagination,
          showAlertBanner: isError,
          showProgressBars: isRefetching,
          sorting,
        }}
        muiTableBodyRowProps={({ row }) => ({
          onClick: (event) => {
            setSize(row._valuesCache.size);
            setName(row._valuesCache.name);
            setIndustry(row._valuesCache.industry);
            setCompany(row._valuesCache.company);
            setCountry(row._valuesCache.country);
            setDesignation(row._valuesCache.designation);
            setEmail(row._valuesCache.email);
            setPhone(row._valuesCache.phone);
            setId(row.id);
            document.getElementById("myId").showModal();
          },
          sx: {
            cursor: "pointer", //you might want to change the cursor too when adding an onClick
          },
        })}
        renderTopToolbarCustomActions={({ table }) => (
          <Box
            sx={{ display: "flex", gap: "1rem", p: "0.5rem", flexWrap: "wrap" }}
          >
            <Button
              color="primary"
              //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
              onClick={handleExportData}
              startIcon={<FileDownloadIcon />}
              variant="contained"
            >
              Export
            </Button>

            <Button
              disabled={
                !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
              }
              //only export selected rows
              onClick={() => handleDeleteRows(table.getSelectedRowModel().rows)}
              startIcon={<DeleteIcon />}
              variant="contained"
            >
              Delete
            </Button>
          </Box>
        )}
      />

      <ToastContainer />

      <dialog className="dailog" id="myId">
        <form onSubmit={onSubmit}>
          <div className="row">
            <h3>Edit Contact</h3>
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
                  className="btn btn-warning  p-3 w-100"
                  value={"Update"}
                />
              </div>
              <div className="form-floating mb-3">
                <button
                  type="submit"
                  className="btn btn-outline-warning p-3 w-100"
                  onClick={closeModal}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </form>
      </dialog>
    </>
  );
};
export default AllContacts;
