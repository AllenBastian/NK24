import React from "react";
import { useNavigate } from "react-router-dom";
function EventsPage() {
  const nav = useNavigate();

  const handleNavigation = (page) => {
    nav(page);
  };
  return (
    <div className="bg-cover bg-fixed bg-no-repeat h-auto min-h-screen bg-[url('https://firebasestorage.googleapis.com/v0/b/sampkle.appspot.com/o/Signupbg.jpeg?alt=media&token=94bfbc88-78f6-4c8a-a749-19fcb76fe493')] w-full px-5 ">
      <div className="justify-evenly align-middle flex w-2/3 sm:w-1/3 mx-auto">
        <h1 className="text-white font-neu text-7xl sm:text-8xl mt-24">E</h1>
        <h1 className="text-white font-neu text-7xl sm:text-8xl mt-24">V</h1>
        <h1 className="text-white font-neu text-7xl sm:text-8xl mt-24">E</h1>
        <h1 className="text-white font-neu text-7xl sm:text-8xl mt-24">N</h1>
        <h1 className="text-white font-neu text-7xl sm:text-8xl mt-24">T</h1>
        <h1 className="text-white font-neu text-7xl sm:text-8xl mt-24">S </h1>
      </div>
      <div className="flex flex-col items-center justify-center lg:flex-row mt-16 align-middle lg:justify-around h-1/3">
        <div
          className="w-9/12 lg:w-1/3 mx-auto sm:mx-0 mb-14 sm:mb-10 outline-4  border-white"
          onClick={() => {
            handleNavigation("cultural");
          }}
        >
          <div className=" hover:scale-110 transition duration-200 cursor-pointer rounded-2xl">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/nakshatra-9c45c.appspot.com/o/EventImages%2FTechnical%20Events%2Fftechcorrected.jpg?alt=media&token=5ebeb06a-ae10-4005-939c-717a16c06ec3"
              alt="event"
              className="rounded-2xl"
            />
          </div>
        </div>
        <div
          className="w-9/12 lg:w-1/3 mx-auto sm:mx-0 mb-14 sm:mb-10 outline-4  border-white"
          onClick={() => {
            handleNavigation("technical");
          }}
        >
          <div className=" hover:scale-110 transition duration-200 cursor-pointer rounded-2xl">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/nakshatra-9c45c.appspot.com/o/EventImages%2FTechnical%20Events%2Ftech%201.jpg?alt=media&token=0b468554-982a-4021-9287-4eb9c1e15cae"
              alt="event"
              className="rounded-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventsPage;