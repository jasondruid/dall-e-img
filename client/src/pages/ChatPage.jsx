import React, { useState, useRef, useEffect } from 'react'
import { flushSync } from 'react-dom';
import Robot from '../assets/robot.png';
import User from '../assets/user.svg';
import { toast } from 'react-toastify';
import axios from 'axios'
import HCaptcha from '@hcaptcha/react-hcaptcha';


const ChatPage = () => {
    const [captcha, setCaptcha] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dots, setDots] = useState(".");
    const [lastMessage, setLastMessage] = useState("");
    const textAreaRef = useRef(null);
    const chatRef = useRef(null);

    const handleSubmit = async (e) => {
        if (loading) return toast.warn('Please wait the bot responds', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        })

        e.preventDefault();
        if (textAreaRef.current.value.trim() === "") return (toast.warn('Please insert a message', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        }))

        let currentPrompt = textAreaRef.current.value;
        flushSync(() => {
            setLoading(true);
            setMessages(prev => [...prev, { id: prev.length, user: "Me", text: textAreaRef.current.value }])
        })
        textAreaRef.current.value = "";
        chatRef.current?.scrollTo({ top: 999999, behavior: "smooth" });

        try {
            const response = await axios.post('http://localhost:8080/api/v1/dalle/chat', { prompt: currentPrompt });

            if (response?.data) {
                const letters = response.data.bot.replace(`\n\n`, "").split("");
                setLoading(false);
                for (let i = 0; i < letters.length; i++) {
                    setLastMessage(prev => prev + letters[i]);
                    await new Promise(resolve => setTimeout(resolve, 30));
                }
                chatRef.current?.scrollTo({ top: 999999, behavior: "smooth" });

                setLastMessage("");
                setMessages(prev => [...prev, { id: prev.length, user: "machine", text: response.data.bot.replace(`\n\n`, "") }])
            }
        }
        catch (e) {
            toast.error('There was an error with query, please ask again', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            })
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        let interv;
        if (loading) {
            interv = setInterval(() => {
                setDots(prev => prev === "..." ? "." : prev + ".");
            }, 800);
        }
        else {
            clearInterval(interv);
        }

        return () => {
            clearInterval(interv);
        };
    }, [loading]);

    useEffect(() => {
        let firstPrompt = async () => {
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 2000));
            setLoading(false);
            const phrase = "Hello!, what's on your mind today?";
            const letters = phrase.split("")
            for (let i = 0; i < letters.length; i++) {
                setLastMessage(prev => prev + letters[i]);
                await new Promise(resolve => setTimeout(resolve, 30));
            }
            setLastMessage("");
            setMessages(prev => [...prev, { id: prev.length, user: "machine", text: phrase }])
        }

        firstPrompt();

    }, [])


    if (captcha) return (
        <section className='max-w-7xl mx-auto flex h-full w-full'>
            <div className="flex antialiased w-full text-gray-800 h-full max-h-[100%]">
                <div className="flex flex-row w-full overflow-x-hidden h-full">

                    <div className="flex flex-col flex-auto h-full">
                        <div
                            className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-400 h-full p-4"
                        >
                            <div className="flex flex-col h-full overflow-x-auto mb-4">
                                <div className="flex flex-col h-full">
                                    <div className="grid grid-cols-12 gap-y-2 max-h-[60vh] " ref={chatRef} style={{ overflowY: "auto" }} >
                                        {messages.map(message => message.user === "machine" ? (<div key={message.id} className="col-start-1 col-end-8 p-3 rounded-lg">
                                            <div className="flex flex-row items-center">
                                                <div
                                                    className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0"
                                                >
                                                    <img src={Robot} className="object-contain p-[2px]" />
                                                </div>
                                                <div
                                                    className="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl"
                                                >
                                                    <pre className="whitespace-pre-wrap break-words">{message.text}</pre>
                                                </div>
                                            </div>
                                        </div>) : (<div key={message.id} className="col-start-6 col-end-13 p-3 rounded-lg sidebar">
                                            <div className="flex items-center justify-start flex-row-reverse">
                                                <div
                                                    className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0"
                                                >
                                                    <img src={User} className="object-contain p-[2px]" />
                                                </div>
                                                <div
                                                    className="relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl"
                                                >
                                                    <pre className="whitespace-pre-wrap break-words">{message.text}</pre>
                                                </div>
                                            </div>
                                        </div>))}

                                        {loading && <div className="col-start-1 col-end-8 p-3 rounded-lg sidebar">
                                            <div className="flex flex-row items-center">
                                                <div
                                                    className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0"
                                                >
                                                    <img src={Robot} className="object-contain p-[2px]" />
                                                </div>
                                                <div
                                                    className="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl"
                                                >
                                                    <div>{dots}</div>
                                                </div>
                                            </div>
                                        </div>}
                                        {
                                            lastMessage !== "" && <div className="col-start-1 col-end-8 p-3 rounded-lg">
                                                <div className="flex flex-row items-center">
                                                    <div
                                                        className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0"
                                                    >
                                                        <img src={Robot} className="object-contain p-[2px]" />
                                                    </div>
                                                    <div
                                                        className="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl"
                                                    >
                                                        <pre className="whitespace-pre-wrap break-words">{lastMessage}</pre>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        {/*  <div className="col-start-1 col-end-8 p-3 rounded-lg">
                                            <div className="flex flex-row items-center">
                                                <div
                                                    className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0"
                                                >
                                                    A
                                                </div>
                                                <div
                                                    className="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl"
                                                >
                                                    <div className="flex flex-row items-center">
                                                        <button
                                                            className="flex items-center justify-center bg-indigo-600 hover:bg-indigo-800 rounded-full h-8 w-10"
                                                        >
                                                            <svg
                                                                className="w-6 h-6 text-white"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                <path
                                                                    stroke-linecap="round"
                                                                    stroke-linejoin="round"
                                                                    stroke-width="1.5"
                                                                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                                                                ></path>
                                                                <path
                                                                    stroke-linecap="round"
                                                                    stroke-linejoin="round"
                                                                    stroke-width="1.5"
                                                                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                                ></path>
                                                            </svg>
                                                        </button>
                                                        <div className="flex flex-row items-center space-x-px ml-4">
                                                            <div className="h-2 w-1 bg-gray-500 rounded-lg"></div>
                                                            <div className="h-2 w-1 bg-gray-500 rounded-lg"></div>
                                                            <div className="h-4 w-1 bg-gray-500 rounded-lg"></div>
                                                            <div className="h-8 w-1 bg-gray-500 rounded-lg"></div>
                                                            <div className="h-8 w-1 bg-gray-500 rounded-lg"></div>
                                                            <div className="h-10 w-1 bg-gray-500 rounded-lg"></div>
                                                            <div className="h-10 w-1 bg-gray-500 rounded-lg"></div>
                                                            <div className="h-12 w-1 bg-gray-500 rounded-lg"></div>
                                                            <div className="h-10 w-1 bg-gray-500 rounded-lg"></div>
                                                            <div className="h-6 w-1 bg-gray-500 rounded-lg"></div>
                                                            <div className="h-5 w-1 bg-gray-500 rounded-lg"></div>
                                                            <div className="h-4 w-1 bg-gray-500 rounded-lg"></div>
                                                            <div className="h-3 w-1 bg-gray-500 rounded-lg"></div>
                                                            <div className="h-2 w-1 bg-gray-500 rounded-lg"></div>
                                                            <div className="h-2 w-1 bg-gray-500 rounded-lg"></div>
                                                            <div className="h-2 w-1 bg-gray-500 rounded-lg"></div>
                                                            <div className="h-10 w-1 bg-gray-500 rounded-lg"></div>
                                                            <div className="h-2 w-1 bg-gray-500 rounded-lg"></div>
                                                            <div className="h-10 w-1 bg-gray-500 rounded-lg"></div>
                                                            <div className="h-8 w-1 bg-gray-500 rounded-lg"></div>
                                                            <div className="h-8 w-1 bg-gray-500 rounded-lg"></div>
                                                            <div className="h-1 w-1 bg-gray-500 rounded-lg"></div>
                                                            <div className="h-1 w-1 bg-gray-500 rounded-lg"></div>
                                                            <div className="h-2 w-1 bg-gray-500 rounded-lg"></div>
                                                            <div className="h-8 w-1 bg-gray-500 rounded-lg"></div>
                                                            <div className="h-8 w-1 bg-gray-500 rounded-lg"></div>
                                                            <div className="h-2 w-1 bg-gray-500 rounded-lg"></div>
                                                            <div className="h-2 w-1 bg-gray-500 rounded-lg"></div>
                                                            <div className="h-2 w-1 bg-gray-500 rounded-lg"></div>
                                                            <div className="h-2 w-1 bg-gray-500 rounded-lg"></div>
                                                            <div className="h-4 w-1 bg-gray-500 rounded-lg"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div> */}
                                    </div>
                                </div>
                            </div>
                            <form onSubmit={handleSubmit}
                                className="flex flex-row items-center rounded-xl bg-white w-full pr-4"
                            >
                                <div>
                                </div>
                                <div className="flex-grow">
                                    <div className="relative w-full">
                                        <textarea
                                            required
                                            ref={textAreaRef}
                                            type="text"
                                            className="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-15"
                                        />

                                    </div>
                                </div>
                                <div className="ml-4">
                                    <button
                                        type="submit"
                                        className={`flex items-center justify-center ${loading ? "bg-gray-500 hover:bg-gray-600" : "bg-indigo-500 hover:bg-indigo-600"} rounded-xl text-white px-4 py-1 flex-shrink-0`}
                                    >
                                        <span>{loading ? "Wait..." : "Send"}</span>
                                        <span className="ml-2">
                                            <svg
                                                className="w-4 h-4 transform rotate-45 -mt-px"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                                ></path>
                                            </svg>
                                        </span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section >);

    return <section className='max-w-7xl mx-auto'>
        <div>
            <h1 className='font-extrabold text-[#222328] text-[32px] dark:text-gray-200'>Chat GPT</h1>
            <p className='mt-2 text-[#666e75] text-[16px] max-w-[500px] dark:text-gray-400'>Chat system based on the GPT-3 Artificial Intelligence language model, developed by the OpenAI company</p>
        </div>
        <div>
            <p className='text-[#222328] text-[18px] mt-6 dark:text-gray-300'>To use Chat system please fill the captcha</p>
            <div className='mt-4 flex gap-5'>
                <HCaptcha 
                    sitekey={import.meta.env.VITE_REACT_APP_HCAPTCHA_SITEKEY}
                    onVerify={setCaptcha}
                />
            </div>
        </div>

    </section>
}

export default ChatPage;