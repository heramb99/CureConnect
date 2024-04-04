import axios from "axios";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { updateInventoryAPI } from "../../service/inventoryService";

function PaymentSuccessful() {
  const location = useLocation();
  const { medicines } = location.state;
  const navigate = useNavigate();

  console.log(medicines);

  useEffect(() => {

    const buyedMedicines = medicines.map((medicine) => {
      return {
        name: medicine.medicineName,
        quantity: medicine.quantity
      }
    })

    console.log(buyedMedicines);

    updateInventoryAPI(
        buyedMedicines
    ).then((response) => {
        if (response.status === 200) {
          setTimeout(() => {
            navigate("/");
          }, 3000);
        } else {
          console.log("error while updating inventory");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className="w-screen h-screen flex flex-col bg-backgroundColor justify-center items-center">
      <div className="text-3xl font-bold">Payment Successful</div>
      <div className="text-3xl font-bold">
        Redirecting to Prescription List in 3 seconds
      </div>
    </div>
  );
}

export default PaymentSuccessful;
