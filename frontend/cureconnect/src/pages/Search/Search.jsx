import React, { useState,useEffect } from "react";
import PatientNavbar from "../../Components/PatientNavbar";
import PatientFooter from "../../Components/PatientFooter";
import { ApiRequest } from "../../helpers/apiRequest";
import {useNavigate} from "react-router-dom";
export const Search = () => {

 const API_URL=import.meta.env.VITE_API_PATH;

  const [doctorDetails,setDoctorDetails] = useState([])
  const [arrDoctors,setArrDoctors] = useState([])
  const navigate = useNavigate();

  const handleFilterChange = (event) => {
    var gender = event.target.value;
    if(gender==="Male" || gender ==="Female") {
      console.log(gender);
      setDoctorDetails(arrDoctors.filter(x=>x.gender===gender));
  }
  else {
    setDoctorDetails(arrDoctors);
  }
  };

  useEffect(() => {
     ApiRequest.fetch({
      url: API_URL+"/api/v1/doctor/getAllApprovedDoctors",
      method: "GET",
     }).then((res) => {
        console.log("doctors::",res);
    //   setDoctors(res);
      setDoctorDetails(res);
      setArrDoctors(res);
     })
  },[])

  const handleExperienceFilterChange = (event) => {
    var experience = Number(event.target.value);
    var expArr = arrDoctors.filter(x=>x.experience>=experience);
    if(expArr.length===0) {
      toast.error("No matching doctors found");
    }

      setDoctorDetails(arrDoctors.filter(x=>x.experience>=experience));
  };

  const handleWordSearch=(event)=>{
    var word = event.target.value;
    console.log("Array",arrDoctors);
    setDoctorDetails(arrDoctors.filter(x=>x.userName.toLowerCase().includes(word.toLowerCase()) || x.specialization.toLowerCase().includes(word.toLowerCase())));
  }

  const handleBookAppointment = (item) => {
    const doctorId=item.id
    navigate(`/patient/appointment`, { state: { doctorId } });
  }


  return (
    <div className="overflow-hidden">
      <div className="flex flex-col">
        <PatientNavbar location={"search"} />
        <div className="min-h-screen flex flex-col items-center bg-backgroundColor overflow-y-auto">
          <div className="w-3/5 flex flex-col align-center items-center">
            <div className=" w-full  mx-auto flex flex-col sm:flex-row justify-between items-center my-2 mt-6 gap-4 ">
              <div className="text-xl md:text-2xl font-bold">
                Search Doctors
              </div>
            </div>
            <div className="w-full md:text-lg items-center bg-secondaryColor rounded-md text-white p-2 ">
              <input
                type="text"
                placeholder="Search by Name and Speciality"
                className=" bg-secondaryColor w-full px-1 outine-none focus:outline-none"
                onChange={handleWordSearch}
              />
            </div>
            <div className="w-full mx-auto flex flex-col sm:flex-row justify-between items-center my-2 mt-6 gap-4 ">
              <div className="flex flex-col w-full basis-1/2">
                <label
                  htmlFor="type"
                  className="block text-sm px-1 font-bold  basis-1/2"
                >
                  Select Gender
                </label>
                <div className="mb-5 mt-1 border-2 border-secondaryColor rounded-lg">
                  <select
                    className="text-secondaryColor placeholder-gray-600 w-full text-base transition duration-200 ease-in-out border-transparent rounded-lg focus:outline-none focus:ring-4 focus:ring-primaryColor px-4 py-1.5"
                    defaultValue={""}
                    name="type"
                    id="type"
                    onChange={handleFilterChange}
                    
                  >
                    <option value={""} >
                      {""}
                      -- Select Gender --{" "}
                    </option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col w-full basis-1/2">
                <label
                  htmlFor="type"
                  className="block text-sm px-1 font-bold  basis-1/2"
                >
                  Experience Level
                </label>
                <div className="mb-5 mt-1 border-2 border-secondaryColor rounded-lg">
                  <select
                    className="text-secondaryColor placeholder-gray-600 w-full text-base transition duration-200 ease-in-out border-transparent rounded-lg focus:outline-none focus:ring-4 focus:ring-primaryColor px-4 py-1.5"
                    defaultValue={""}
                    name="type"
                    id="type"
                    onChange={handleExperienceFilterChange}
                  >
                    <option value={""}>
                      {""}
                      -- select an option --{" "}
                    </option>
                    <option value="5">5+ Years</option>
                    <option value="10">10+ Years</option>
                    <option value="15">15+ Years</option>
                  </select>
                </div>
              </div>
            </div>
            <div className=" w-4/5  flex flex-col">
              {doctorDetails.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="flex flex-col md:flex-row w-full mb-5 rounded-lg bg-whiteColor border border-secondaryColor p-4 hover:scale-105 transition duration-200"
                  >
                    <div className="border-2 border-primaryColor rounded-md overflow-hidden">
                      <img
                        src={item.profileUrl}
                        className=" w-40 h-40 rounded-md object-cover"
                      />
                      </div>
                    <div className="w-full mx-4 flex flex-col md:flex-row justify-between">
                      <div className="flex flex-col">
                        <div className="text-2xl font-semibold text-secondaryColor mb-5">{"Dr."+item.userName}</div>
                        <div className="text-base ">
                          {item.specialization}
                        </div>
                        <div className="text-base mb-5">{"Experience: "+item.experience+" Years"	}</div>
                        <div className="text-md ">{item.educationDetails}</div>
                      </div>
                      <div className="flex h-full items-center">
                      <button 
                      onClick={() => handleBookAppointment(item)}
                      className="text-base h-fit bg-secondaryColor text-white px-4 py-2 rounded-md">
                        Book Appointment
                      </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <PatientFooter />
    </div>
  );
};
export default Search;
