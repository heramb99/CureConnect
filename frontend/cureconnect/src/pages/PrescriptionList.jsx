import React from "react";
import { useNavigate } from "react-router-dom";
import { FaFileDownload } from "react-icons/fa";
import { useEffect, useState } from "react";

function PrescriptionList() {
  const pastPrescriptionData = [
    {
      name: "Dr. Shubham Pawar",
      date: "2012-04-23",
      slot: "12:30 pm to 1:00 pm",
      file: "",
    },
    {
      name: "Dr. Aniket Mhatre",
      date: "2012-04-23",
      slot: "12:30 pm to 1:00 pm",
      file: "",
    },
    {
      name: "Dr. Parth Karkhanis",
      date: "2012-04-23",
      slot: "12:30 pm to 1:00 pm",
      file: "",
    },
    {
      name: "Dr. Heramb Kulkarni",
      date: "2012-04-23",
      slot: "12:30 pm to 1:00 pm",
      file: "",
    },
    {
      name: "Dr. Shubham Pawar",
      date: "2012-04-23",
      slot: "12:30 pm to 1:00 pm",
      file: "",
    },
    {
      name: "Dr. Shubham Pawar",
      date: "2012-04-23",
      slot: "12:30 pm to 1:00 pm",
      file: "",
    },
  ];

  const navigate = useNavigate();

  const handleBuy = () => {
    navigate("/prescribedmedicine");
  };

  const handleDownload = () => {};

  useEffect(() => {
    setFilteredData(pastPrescriptionData);
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const handleFilter = () => {
    const filtered = pastPrescriptionData.filter((prescription) =>
      prescription.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <>
      <div className="flex flex-col w-screen h-screen overflow-y-scroll items-stretch bg-primaryColor">
        <div className="text-5xl flex justify-center p-4 my-2 font-bold text-secondaryColor">
          Past Appointments
        </div>

          <div className="flex flex-row m-2 justify-center items-center">
            <div className="flex grow max-w-[800px] bg-white p-3 rounded-tl-lg border border-black border-r-0 rounded-bl-lg">
              <input
                type="text"
                placeholder="Search by name"
                value={searchTerm}
                onChange={handleChange}
                className="px-4 py-2 border-2 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-inset rounded-lg grow text-base"
              />
            </div>
            <div className="p-3 bg-white rounded-tr-lg border border-black border-l-0 rounded-br-lg">
              <button
                onClick={handleFilter}
                className="px-4 py-2 bg-secondary shadow-sm hover:bg-black border-2 text-white rounded-lg text-base bg-secondaryColor"
              >
                Filter
              </button>
            </div>
          </div>

        <div className="px-4 mt-2 mb-10">
          <div className="max-w-screen-lg mx-auto overflow-x-auto flex justify-center border bg-white border-black p-4 rounded-lg">
            <div className="min-w-full">
              <table className="w-full text-base text-center">
                <thead className="text-base text-white uppercase border bg-secondaryColor">
                  <tr>
                    <th scope="col" className="px-3 py-3">
                      Doctor Name
                    </th>
                    <th scope="col" className="px-3 py-3">
                      Date
                    </th>
                    <th scope="col" className="px-3 py-3">
                      Slot
                    </th>
                    <th scope="col" className="px-3 py-3">
                      Download
                    </th>
                    <th scope="col" className="px-3 py-3">
                      Buy Medicine
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((prescription, index) => (
                    <tr key={index} className={"bg-gray-300 hover:bg-gray-500"}>
                      <td scope="row" className="px-3 py-4 font-bold text-base">
                        {prescription.name}
                      </td>
                      <td className="px-3 py-4 font-semibold">
                        {prescription.date}
                      </td>
                      <td className="px-3 py-4 font-semibold">
                        {prescription.slot}
                      </td>
                      <td className="px-3 py-4">
                        <button onClick={handleDownload} className="text-2xl">
                          <FaFileDownload />
                        </button>
                      </td>
                      <td className="px-3 py-4">
                        <button
                          onClick={handleBuy}
                          className="rounded-full py-2 px-6 text-base font-semibold text-white bg-secondaryColor"
                        >
                          Buy
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PrescriptionList;
