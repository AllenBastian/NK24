import { useState, useEffect } from "react";
import "./dashstyle.css";
import { Button } from "@material-tailwind/react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import * as htmlToImage from "html-to-image";
import { saveAs } from "file-saver";
import { FaDownload } from "react-icons/fa";
import { MdOutlineEmojiEvents as TrophyIcon } from "react-icons/md";

import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Typography,
} from "@material-tailwind/react";

import {
  collection,
  addDoc,
  doc,
  updateDoc,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore/lite";
import { db } from "../firebase/firebase";
import { FaWhatsapp } from "react-icons/fa";

export default function Dash() {
  const [isCampusAmbassador, setCampusAmbassador] = useState(false);
  const [name, setName] = useState("");
  const [amboId, setAmboId] = useState(null);
  const [open, setOpen] = useState(false);
  const [ref, setRefcode] = useState(0);
  const [regData, setRegData] = useState([]);
  const [Leaderboard, setLeaderboard] = useState([]);

  const [currentUser, setCurrentUser] = useState(null);
  const nav = useNavigate();
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      try {
        const usersRef = collection(db, "users");
        const regRef = collection(db, "Registrations");
        const q = query(usersRef, where("email", "==", user.email));
        const e = query(regRef, where("email", "==", user.email));

        const regSnapshot = await getDocs(e);
        const querySnapshot = await getDocs(q);

        if (!regSnapshot.empty) {
          const regDocData = regSnapshot.docs.map((doc) => doc.data());
          setRegData(regDocData);
        } else {
          //Add alert about No registration document found for the user.
        }

        if (!querySnapshot.empty) {
          const userDocData = querySnapshot.docs[0].data();

          setCampusAmbassador(userDocData.isCA);
          setAmboId(userDocData.CACode);
          setName(userDocData.name);
          setRefcode(userDocData.refcount);
        } else {
          // Add alert No user document found for the user
        }

        const campusAmbRef = collection(db, "campusAmb");
        const sortedQuery = query(campusAmbRef, orderBy("refcount", "desc"));

        try {
          const snapshot = await getDocs(sortedQuery);

          if (!snapshot.empty) {
            const campusAmbData = snapshot.docs.map((doc) => doc.data());
            setLeaderboard(campusAmbData);
          } else {
            //Add alert about No documents found in the campusamb collection."
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleUpdate = () => {
    nav("/update_profile", { state: { update: true } });
  };

  const handleOpen = () => setOpen(!open);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        setCurrentUser(null);
        nav("/");
      })
      .catch((error) => {});
  };

  const caRegister = async () => {
    try {
      await addDoc(collection(db, "campusAmb"), {
        cacode: amboId,
        name: name,
        email: currentUser.email,
        refcount: ref,
      });
    } catch (e) {
      console.error("Error adding document: ", e);
    }
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", currentUser.email));
      const querySnapshot = await getDocs(q);
      const userDocSnapshot = querySnapshot.docs[0];
      const userDocRef = userDocSnapshot.ref;

      await updateDoc(userDocRef, {
        isCA: true,
      });
      setCampusAmbassador(true);
    } catch (error) {
      console.error("Error in caRegister:", error);
    }
  };

  const handleDownload = (index) => {
    htmlToImage
      .toBlob(document.getElementById(`qrCodeContainer${index}`))
      .then(function (blob) {
        if (window.saveAs) {
          window.saveAs(blob, `qrcode${index}.jpg`);
        } else {
          saveAs(blob, `qrcode${index}.jpg`);
        }
      });
  };
  //whatsapp evide
  const shareText = `Dive into the Ciniverse Extravaganza at Nakshatra 2024! 🌌✨ Experience the ultimate blend of technology and culture, where the magic of cinema meets the future of innovation. Don't miss this epic fest! Join us: ${window.location.origin}?refocde=${amboId} #Nakshatra2024 #CiniverseExtravaganza`;
  const encodedShareText = encodeURIComponent(shareText);
  const whatsappLink = `https://wa.me/?text=${encodedShareText}`;

  if (regData && currentUser) {
    return (
      <div className=" min-h-screen  flex flex-col items-center justify-center bg-[url('https://firebasestorage.googleapis.com/v0/b/sampkle.appspot.com/o/Signupbg.jpeg?alt=media&token=94bfbc88-78f6-4c8a-a749-19fcb76fe493')] bg-no-repeat bg-cover bg-fixed bg-center">
        <div className="container mx-auto px-4 lg:px-8 mt-20 ">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 ">
            <div
              className=" p-12 shadow-2xl flex flex-col justify-between  rounded-xl min-h-[300px] w-full"
              style={{ backgroundColor: "rgb(22, 23, 27)" }}
            >
              <div className="text-3xl sm:text-xl md:text-2xl lg:text-3xl font-bold font-pop text-white">
                Welcome,{" "}
                {currentUser
                  ? currentUser.displayName || "User"
                  : "No user logged in"}
              </div>

              <div className="text-20 text-white font-pop mt-2">
                This is the dashboard. You can view the events you have
                registered here and update your current profile.
              </div>
              <Button
                onClick={handleUpdate}
                className="mt-20 lg:w-1/2 font-pop text-xl text-blue-900 hover:bg-white"
              >
                Update Profile
              </Button>
              <Button
                onClick={handleSignOut}
                className="mt-5 lg:w-1/2 font-pop text-xl text-red-800 hover:bg-white"
              >
                LOGOUT
              </Button>
            </div>

            <div
              className="bg-white p-12 shadow-xl flex flex-col rounded-xl min-h-[300px] w-full"
              style={{ backgroundColor: "rgb(22, 23, 27)" }}
            >
              <div className="text-3xl sm:text-xl md:text-2xl lg:text-3xl font-bold font-pop text-white">
                Campus Ambassador
              </div>
              <div className="text-20 font-pop mt-5 text-white">
                Have you dreamed of being a superhero ? Who needs superheroes
                when you can be a campus ambassador. “With great power comes
                great responsibility”. Here’s an opportunity to explore your
                inner influencer. Let’s see who will become the next face of
                Nakshatra
              </div>

              <a
                className="py-4 text-lg font-pop underline text-white hover:text-green-500 cursor-pointer"
                onClick={handleOpen}
              >
                CLICK HERE TO VIEW RULES
              </a>
              <Dialog open={open} handler={handleOpen} className="bg-black-200">
              <DialogHeader className="font-pop text-white">Rules and regulations</DialogHeader>
              <DialogBody className="h-[25rem] overflow-scroll">
    
              <li className="font-pop text-white">
                      Anyone who sign up to our web page /App  can enter the event there is no particular number 
                </li>
              <li className="font-pop text-white mt-2">
                      Each participant will have a unique referral code, and the
                      points won't start accruing until the other participants
                      use the code to register for other events.
                   </li>
                    <br />
                    <li className="font-pop text-white">
                      Higher the registration more the point rewarded!
                    </li>
                    <br />
                    <li className="font-pop text-white">Referral codes generated through either app or website can
                      only be used for event registrations and sign-ups.
                    </li>
                    <br />
                    <li className="font-pop text-white"> If tied, prize money will be shared.</li>
                    <br />
                    <li className="font-pop text-white">
                      The winners should submit their valid college id cards to
                      get the cash prize.
                    </li>{" "}
                    <br />
                    <li className="font-pop text-white">
                      Certificates will be provided to the winners only.
                    </li>{" "}
                    <br />
                    <li className="font-pop text-white">Committee decisions will be final.</li>
                    <br />
                    <li className="font-pop text-white">For further queries contact:</li>
                    <br />
                    <ul>
                      <li className="font-pop text-white text-xl">Head: Ahana Babu | 9895800302</li>
                      <li className="font-pop text-white text-xl">Subhead : Cinta Susan Thomas  | 8590890617 </li>
                      <li className="font-pop text-white text-xl">Subhead : Simi |  7025398459</li>
                    </ul>
                <Typography className="font-normal">
                  <ul className="list-disc pl-5">
                 
                  </ul>
                </Typography>
              </DialogBody>
              <DialogFooter className="space-x-2">
                <Button
                  className="font-pop text-white hover:bg-green-400"
                  variant="text"
                  color="blue-gray"
                  onClick={handleOpen}
                >
                  Confirm
                </Button>
  
              </DialogFooter>
            </Dialog>

              <div>
                {isCampusAmbassador === false ? (
                  <Button
                    onClick={caRegister}
                    className="text-green-600 lg:w-1/2 text-xl mt-15 font-pop hover:bg-white"
                  >
                    Register as Ambassador
                  </Button>
                ) : (
                  <>
                    <div className="text-3xl mt-5 sm:text-xl md:text-2xl lg:text-3xl font-bold font-pop text-white">
                      You are Registered!
                    </div>
                    <div className="text-lg sm:text-lg md:text-xl lg:text-3xl font-bold font-pop  text-green-500">
                      id: {amboId}
                    </div>
                    <a
                      href={whatsappLink}
                      className="mt-5 inline-flex items-center justify-center bg-green-600 text-white font-bold font-pop py-2 px-4 rounded hover:bg-green-300"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaWhatsapp className="mr-2" /> Share
                    </a>
                  </>
                )}
               
              </div>
            </div>
            <div
              className="bg-white p-12 shadow-xl rounded-xl md:col-span-2 min-h-[300px] w-full"
              style={{
                backgroundColor: "rgb(22, 23, 27)",
              }}>
              <div className="text-3xl sm:text-xl md:text-2xl lg:text-3xl font-bold font-pop text-white">
                Registered Events
                {regData.length > 0 ? (
                  <div className="flex flex-wrap gap-5 mt-5">
                    {regData.map((event, index) => (
                      <div
                        key={index}
                        id={`qrCodeContainer${index}`}
                        className="border border-gray-300  p-4 rounded-md mb-4 hover:scale-105 transition duration-200 cursor-pointer flex flex-col  justify-between w-64 h-70"
                      >
                        <h2 className="text-xl font-semibold font-pop">
                          {event.nkid + "-" + event.eventid}
                        </h2>
                        <p className="text-gray-500 text-sm   mt-2 font-pop overflow-hidden whitespace-normal">
                          {event.eventname}
                        </p>
                        <p className="text-gray-500 mb-2 mt-2 text-lg font-pop">
                          Event ID: {event.eventid}
                        </p>
                        <div className="">
                          <QRCodeSVG
                            value={`reg id: ${event.nkid}${event.eventid} \n Event name: ${event.eventname}\nevent ID: ${event.eventid} `}
                            size={100}
                            className="mt-5 w-full mb-2"
                          />
                          <button
                            onClick={() => {
                              handleDownload(index);
                            }}
                          >
                            {" "}
                            <FaDownload />{" "}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="font-pop mt-10 text-red-500 text-2xl">
                    {" "}
                    No events registered!
                  </div>
                )}
              </div>
            </div>
            <div
              className="bg-white p-12 shadow-xl rounded-xl md:col-span-1 min-h-[300px] w-full"
              style={{
                backgroundColor: "rgb(22, 23, 27)",
              }}>

<div className="text-3xl text-white font-pop mt-5  ">
                 Campus Ambassador Leaderboard
                </div>
                {Leaderboard.slice(0, 3).map((event, index) => (
                  <div key={index} className="mt-5 flex items-center">
                    {index === 0 && (
                      <>
                        <TrophyIcon
                          className="text-yellow-500 inline"
                          size={32}
                        />
                        <div className="ml-3">
                          <span className="font-pop text-white">
                            {event.name}
                          </span>
                          <span className="font-pop text-yellow-500">
                            &nbsp;{event.refcount * 100} pts
                          </span>
                        </div>
                      </>
                    )}
                    {index === 1 && (
                      <>
                        <TrophyIcon
                          className="text-gray-400 inline"
                          size={32}
                        />
                        <div className="ml-3">
                          <span className="font-pop text-white">
                            {event.name}
                          </span>
                          <span className="font-pop text-gray-400">
                            &nbsp;{event.refcount * 100} pts
                          </span>
                        </div>
                      </>
                    )}
                    {index === 2 && (
                      <>
                        <TrophyIcon
                          className="text-orange-400 inline"
                          size={32}
                        />
                        <div className="ml-3">
                          <span className="font-pop text-white">
                            {event.name}
                          </span>
                          <span className="font-pop text-orange-400">
                            &nbsp;{event.refcount * 100} pts
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
