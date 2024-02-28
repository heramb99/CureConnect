import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";

function PrescribedMedicine() {
  const initialMedicineData = [
    { name: "Valium", price: "50", defaultQuantity: 10, isChecked: true },
    { name: "Aspirin", price: "10", defaultQuantity: 5, isChecked: true },
    { name: "Benadryl", price: "50", defaultQuantity: 6, isChecked: true },
    { name: "Claritin", price: "56", defaultQuantity: 7, isChecked: true },
    { name: "Zyrtec", price: "70", defaultQuantity: 9, isChecked: true },
  ];

  const initialMedicineDataImmutable = [...initialMedicineData];

  const [medicines, setMedicines] = useState(initialMedicineData);
  const [masterCheckboxChecked, setMasterCheckboxChecked] = useState(true);

  const navigate = useNavigate();

  const handleCheckboxChange = (index) => {
    const updatedMedicines = [...medicines];
    updatedMedicines[index].isChecked = !updatedMedicines[index].isChecked;
    setMedicines(updatedMedicines);

    const allChecked = updatedMedicines.every((medicine) => medicine.isChecked);
    setMasterCheckboxChecked(allChecked);
  };

  const handleQuantityChange = (index, newValue) => {
    if (newValue > initialMedicineDataImmutable[index].defaultQuantity) {
      newValue = initialMedicineDataImmutable[index].defaultQuantity;
    }

    const updatedMedicines = [...medicines];
    updatedMedicines[index] = {
      ...updatedMedicines[index],
      defaultQuantity: newValue,
    };
    setMedicines(updatedMedicines);
  };

  const handleMasterCheckboxChange = () => {
    const updatedMedicines = medicines.map((medicine) => ({
      ...medicine,
      isChecked: !masterCheckboxChecked,
    }));
    setMedicines(updatedMedicines);
    setMasterCheckboxChecked(!masterCheckboxChecked);
  };

  const handleSubmit = () => {
    navigate("/orderdetails");
  };



  return (
    <>
      <div className="flex flex-col w-screen h-screen overflow-y-auto items-stretch bg-primaryColor">

        <div className="text-5xl flex justify-center p-4 my-2 font-bold text-secondaryColor">
          Prescribed Medicine
        </div>

        <div className="px-4 my-2">
          <div className="max-w-screen-lg mx-auto flex flex-col sm:flex-row justify-center items-center bg-white sm:justify-around rounded-lg border border-black ">
            <div className="flex text-xl font-semibold p-3 text-center">
              Dr. Shubham Pawar
            </div>
            <div className="flex text-xl font-semibold p-3 text-center">
              7th Ferbruary 2024
            </div>
            <div className="flex text-xl font-semibold p-3 text-center">
              12:30 pm to 1:00 pm
            </div>
          </div>
        </div>

        <div className="px-4 my-2">
          <div className="max-w-screen-lg mx-auto overflow-x-auto flex justify-center border bg-white border-black p-4 rounded-lg">
            <div className="min-w-full">
              <table className="w-full text-center">
                <thead className=" text-white uppercase border bg-secondaryColor">
                  <tr>
                    <th scope="col" className="px-3 py-3">
                      <div>
                        <input
                          id="checkbox-all"
                          type="checkbox"
                          className="px-3 py-3"
                          checked={masterCheckboxChecked}
                          onChange={handleMasterCheckboxChange}
                        />
                      </div>
                    </th>
                    <th scope="col" className="px-3 py-3">
                      Medicine name
                    </th>
                    <th scope="col" className="px-3 py-3">
                      Price (CAD)
                    </th>
                    <th scope="col" className="px-3 py-3">
                      Quantity
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {medicines.map((medicine, index) => (
                    <tr
                      key={index}
                      className={`${
                        medicine.isChecked
                          ? "bg-gray-300"
                          : "bg-white"
                      } hover:bg-gray-500`}
                    >
                      <td className="px-3 py-4">
                        <div className="">
                          <input
                            id={`checkbox-table-${index}`}
                            type="checkbox"
                            className="px-3 py-3"
                            checked={medicine.isChecked}
                            onChange={() => handleCheckboxChange(index)}
                          />
                        </div>
                      </td>
                      <td
                        scope="row"
                        className="px-3 py-4 font-semibold whitespace-nowrap"
                      >
                        {medicine.name}
                      </td>
                      <td className="px-3 py-4 font-semibold">
                        {medicine.price}
                      </td>
                      <td className="px-3 py-4">
                        <div className="flex justify-center">
                          <button
                            className="inline-flex items-center justify-center h-6 w-6 pb-1.5 ms-3 text-xl font-bold bg-black text-white border rounded-full"
                            onClick={() =>
                              handleQuantityChange(
                                index,
                                medicine.defaultQuantity - 1
                              )
                            }
                            disabled={!medicine.isChecked}
                          >
                            -
                          </button>
                          <div className="ms-3">
                            <input
                              type="text"
                              id={`quantity-${index}`}
                              className="bg-white w-14 text-center font-semibold text-black text-sm rounded-lg px-2 py-1"
                              value={medicine.defaultQuantity}
                              readOnly
                            />
                          </div>
                          <button
                            className="inline-flex items-center justify-center h-6 w-6 pb-1.5 ms-3 text-xl font-bold bg-black text-white border rounded-full"
                            onClick={() =>
                              handleQuantityChange(
                                index,
                                medicine.defaultQuantity + 1
                              )
                            }
                            disabled={!medicine.isChecked}
                          >
                            +
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="my-2 mb-10 flex justify-center">
          <button
            className="flex justify-center rounded-full py-2 px-6 text-xl font-semibold text-white bg-secondaryColor shadow-sm"
            onClick={handleSubmit}
          >
            Get a quote
          </button>
        </div>
      </div>
    </>
  );
}
export default PrescribedMedicine;
