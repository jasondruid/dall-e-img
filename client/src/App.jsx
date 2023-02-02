import React, { useState } from 'react'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import { logo, menu, close } from './assets';
import { CreatePost, Home } from './pages';
import { useSelector, useDispatch } from 'react-redux'
import { increment, setPhoto } from './store/themeSlice';
import ChatPage from './pages/ChatPage';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';


export const navLinks = [
  {
    id: "home",
    title: "Home",
  },
  {
    id: "features",
    title: "Features",
  },
  {
    id: "product",
    title: "Product",
  },
  {
    id: "clients",
    title: "Clients",
  },
];


const App = () => {
  const count = useSelector((state) => state.theme.theme);
  const currentImage = useSelector((state) => state.theme.photo);
  const dispatch = useDispatch();
  const checked = count === "dark";
  const classDarkLogo = checked ? 'svg-edit' : '';
  const showOnTop = currentImage === "" ? { display: "flex", flexWrap: "wrap", height: "100%" } : { overflow: "hidden", width: "100%", maxHeight: "100vh" }
  const [toggle, setToggle] = useState(false);


  const handleToggle = (e) => {

    dispatch(increment());
  };


  return (
    <>
      <ToastContainer />
      <div className={`${count}`} style={showOnTop}>
        <div style={{ height: "100%", width: "100%", zIndex: 999, position: "absolute", alignItems: "center", justifyContent: "center", display: currentImage === "" ? "none" : "flex" }} className="backdrop-blur-sm bg-white/30" onClick={() => { dispatch(setPhoto("")) }}>
          <div style={{ height: "100%", width: "100%", position: "relative", padding: "3%", display: "flex" }} >
            <img src={currentImage} className="my-auto mx-auto rounded-xl" style={{ maxHeight: "100%", maxWidth: "100%" }} />
            {/*             <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-4 px-8 rounded right-5 bottom-0 absolute">
              Download
            </button> */}
          </div>
        </div>
        <BrowserRouter>
          <header className='w-full sticky top-0 z-30 flex dark:bg-gray-800 bg-white justify-between items-center  sm:px-8 px-4 py-4 border-b border-b-[#e6ebf4] dark:border-b-gray-800'>
            <Link to="/" >
              <img src={logo} alt="logo" className={`w-28 object-contain ${classDarkLogo}`} />
            </Link>
            <div>
              <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                <input type="checkbox" name="toggle" id="toggle" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" onChange={handleToggle} checked={checked} />
                <label htmlFor="toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
              </div>
              <label htmlFor="toggle" className="text-sm text-gray-700 sm:mr-3 mr-1 dark:text-white">Dark mode</label>
              <Link to="/create-post" className='font-inter font-medium bg-[#6469ff] text-white px-4 py-2 rounded-md hidden sm:inline'>
                Create
              </Link>
              <Link to="/chat" className='font-inter font-medium text-white bg-slate-400 ml-2 px-4 py-2 rounded-md hidden sm:inline'>
                Chat
              </Link>
              <img className='w-[28px] h-[28px] object-contain ml-3 mr-1 inline sm:hidden' onClick={() => setToggle(prev => !prev)} alt="menu" src={toggle ? close : menu} />

              <div></div>
              <div className={`${toggle ? 'flex' : "hidden"} p-6 bg-black-gradient absolute top-20 right-0 mx-4 my-2 min-w[140px] rounded-xl sidebar`}>
                <ul className='list-none flex flex-col justify-end items-center flex-1'>
                    <Link to="/chat" className='font-poppins font-normal cursor-pointer text-[16px] mb-4 text-white' onClick={()=>{setToggle(false)}}>
                      Chat
                    </Link>
                    <Link to="/create-post" className='font-poppins font-normal cursor-pointer text-[16px] mr-0 text-white' onClick={()=>{setToggle(false)}}>
                      Create Image
                    </Link>
                </ul>
              </div>
            </div>

          </header>
          <main className='sm:p-8 px-4 py-8 w-full bg-[#f9fafe] min-h-[calc(100vh-73px)]  dark:bg-gray-900 '>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/create-post" element={<CreatePost />} />
              <Route path="/chat" element={<ChatPage />} />
            </Routes>
          </main>
        </BrowserRouter>
      </div>
    </>

  )
}

export default App