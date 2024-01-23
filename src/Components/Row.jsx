import axios from "axios";
import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { MdArrowBackIosNew } from "react-icons/md";
import { BiFirstPage } from "react-icons/bi";
import { GrNext } from "react-icons/gr";
import { MdLastPage } from "react-icons/md";

const Row = () => {
  const [data, setData] = useState([]);
  const [newSelecRows, setNewSelecRows] = useState([]); //for single checkbox
  const [selecAll, setSelecAll] = useState([]); // for selectall checkbox
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});

  const rowsperPage = 10;

  useEffect(() => {
    try {
      let api =
        "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json";
      axios.get(api).then((response) => {
        setData(response.data);
        setSelecAll(response.data);
      });
    } catch (e) {
      console.log(e);
    }
  }, []);

  const selectedRoes = (id) => {
    const updatedRows = newSelecRows.includes(id)
      ? newSelecRows.filter((rowId) => rowId !== id)
      : [...newSelecRows, id];
    setNewSelecRows(updatedRows);
  };

  const selectAll = () => {
    const allRows = selecAll.map((row) => row.id);
    setNewSelecRows(newSelecRows.length === allRows.length ? [] : allRows);
  };

  //   console.log(data);

  const pagination = () => {
    const startindex = (currentPage - 1) * rowsperPage;
    const endindex = startindex + rowsperPage;
    return data.slice(startindex, endindex);
  };

  const handleSearch = () => {
    const searchTermLower = searchTerm.toLowerCase();
    if (searchTermLower === "") {
      setData(selecAll);
    } else {
      const filtered = data.filter(
        (row) =>
          row.name.toLowerCase().includes(searchTermLower) ||
          row.email.toLowerCase().includes(searchTermLower) ||
          row.role.toLowerCase().includes(searchTermLower)
      );
      setData(filtered);
      setCurrentPage(1);
    }
  };

  const handleDelete = () => {
    const updatedData = data.filter((row) => !newSelecRows.includes(row.id));
    setData(updatedData);
    setNewSelecRows([]);
    setSelecAll(updatedData);
  };

  const pageChange = (pagenumber) => {
    setCurrentPage(pagenumber);
  };

  const pageCount = () => Math.ceil(data.length / rowsperPage);

  const handleEdit = (id, field) => {
    setIsEditing(true);
    setEditedData({
      id,
      field,
      value: data.find((row) => row.id === id)[field],
    });
  };

  const handleSave = (id, field) => {
    const updatedData = data.map((row) => {
      if (row.id === id) {
        return { ...row, [field]: editedData.value };
      }
      return row;
    });
    setData(updatedData);
    setSelecAll(updatedData);
    setIsEditing(false);
    setEditedData({});
  };

  return (
    <div>
      <div>
        {/* Searchbar */}
        <div className="flex w-full p-5">
          <form
            className="w-full"
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
          >
            <input
              className="w-full border-2 border-gray-400 p-1"
              type="text"
              placeholder="Search by name, email or role"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
        </div>
      </div>

      {/* Rows */}

      <div className="w-full p-5">
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow className="font-bold">
                <TableCell>
                  <input
                    type="checkbox"
                    checked={
                      newSelecRows.length === selecAll.length &&
                      selecAll.length !== 0
                    }
                    onChange={() => selectAll()}
                  />
                </TableCell>
                <TableCell align="left">
                  <span className="font-bold">Name</span>
                </TableCell>
                <TableCell align="left">
                  <span className="font-bold">Email</span>
                </TableCell>
                <TableCell align="left">
                  <span className="font-bold">Role</span>
                </TableCell>
                <TableCell align="left">
                  <span className="font-bold">Action</span>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pagination().map((row) => (
                <TableRow
                  key={row.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  className={newSelecRows.includes(row.id) ? "bg-gray-300" : ""}
                >
                  <TableCell component="th" scope="row">
                    <input
                      type="checkbox"
                      checked={newSelecRows.includes(row.id)}
                      onChange={() => selectedRoes(row.id)}
                    />
                  </TableCell>
                  <TableCell align="left">
                    {isEditing &&
                    editedData.id === row.id &&
                    editedData.field === "name" ? (
                      <input
                        type="text"
                        value={editedData.value}
                        onChange={(e) =>
                          setEditedData({
                            ...editedData,
                            value: e.target.value,
                          })
                        }
                        onBlur={() => handleSave(row.id, "name")}
                        autoFocus
                      />
                    ) : (
                      <span
                        onClick={() => !isEditing && handleEdit(row.id, "name")}
                        className={
                          isEditing ? "cursor-not-allowed" : "cursor-pointer"
                        }
                      >
                        {row.name}
                      </span>
                    )}
                  </TableCell>
                  <TableCell align="left">
                    {isEditing &&
                    editedData.id === row.id &&
                    editedData.field === "email" ? (
                      <input
                        type="text"
                        value={editedData.value}
                        onChange={(e) =>
                          setEditedData({
                            ...editedData,
                            value: e.target.value,
                          })
                        }
                        onBlur={() => handleSave(row.id, "email")}
                        autoFocus
                      />
                    ) : (
                      <span
                        onClick={() =>
                          !isEditing && handleEdit(row.id, "email")
                        }
                        className={
                          isEditing ? "cursor-not-allowed" : "cursor-pointer"
                        }
                      >
                        {row.email}
                      </span>
                    )}
                  </TableCell>
                  <TableCell align="left">
                    {isEditing &&
                    editedData.id === row.id &&
                    editedData.field === "role" ? (
                      <input
                        type="text"
                        value={editedData.value}
                        onChange={(e) =>
                          setEditedData({
                            ...editedData,
                            value: e.target.value,
                          })
                        }
                        onBlur={() => handleSave(row.id, "role")}
                        autoFocus
                      />
                    ) : (
                      <span
                        onClick={() => !isEditing && handleEdit(row.id, "role")}
                        className={
                          isEditing ? "cursor-not-allowed" : "cursor-pointer"
                        }
                      >
                        {row.role}
                      </span>
                    )}
                  </TableCell>
                  <TableCell align="left">
                    <span className="flex gap-5">
                      <FaRegEdit className="size-5 cursor-pointer edit" />
                      <MdDeleteOutline
                        className="text-red-600 size-5 cursor-pointer delete"
                        onClick={() => handleDelete(row.id)}
                        disabled={currentPage === 1}
                      />
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <div className="mt-4 flex items-center text-center justify-center">
        <div>
          <button
            className="p-2 border cursor-pointer rounded-full first-page"
            onClick={() => pageChange(1)}
          >
            <BiFirstPage />
          </button>
          <button
            className="p-2 ml-2 border rounded-full cursor-pointer previous-page"
            onClick={() => pageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <MdArrowBackIosNew />
          </button>
        </div>
        <div>
          {[...Array(pageCount())].map((_, index) => (
            <button
              key={index}
              className={`rounded-full overflow-hidden cursor-pointer p-2 mx-3 border ${
                currentPage === index + 1 ? "bg-blue-400" : ""
              }`}
              onClick={() => pageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
        <div>
          <button
            className="p-2 border rounded-full cursor-pointer next-page"
            onClick={() => pageChange(currentPage + 1)}
            disabled={currentPage === pageCount()}
          >
            <GrNext />
          </button>
          <button
            className="p-2 ml-2 border rounded-full cursor-pointer last-page"
            onClick={() => pageChange(pageCount())}
            disabled={currentPage === pageCount()}
          >
            <MdLastPage />
          </button>
        </div>
      </div>
      <div className="mt-4 relative">
        <button
          className="p-2 border bg-red-500 text-white rounded-full cursor-pointer absolute bottom-3"
          onClick={handleDelete}
          disabled={newSelecRows.length === 0}
        >
          Delete Selected
        </button>
      </div>
    </div>
  );
};

export default Row;
