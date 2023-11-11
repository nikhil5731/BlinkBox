"use client";

import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function setEmail() {
  const [email, setEmail] = useState<string | null>("Generate New Emails");
  const [loader, setLoader] = useState(false);
  const [login, setLogin] = useState<string | undefined>("");
  const [domain, setDomain] = useState<string | undefined>("");
  const [inbox, setInbox] = useState([]);
  const [clipboardMsg, setClipboardMsg] = useState("Copy to clipboad");

  const handleRefresh = async () => {
    setLoader(true);
    await axios
      .get(
        `https://www.1secmail.com/api/v1/?action=getMessages&login=${login}&domain=${domain}`
      )
      .then((res) => {
        setInbox(res.data);
      });
    setLoader(false);
  };

  const handleGenerateEmail = async () => {
    setLoader(true);
    await axios
      .get("https://www.1secmail.com/api/v1/?action=genRandomMailbox&count=1")
      .then((res: any) => {
        localStorage.setItem("lastEmail", res.data[0]);
        setEmail(res.data[0]);
        const temp = res.data[0].split("@");
        setLogin(temp[0]);
        setDomain(temp[1]);
        setInbox([]);
      });
    setLoader(false);
  };

  const handleCopyToClipBoard = () => {
    navigator.clipboard
      .writeText(`${email}`)
      .then(() => {
        setClipboardMsg("Copied!");
        setTimeout(() => {
          setClipboardMsg("Copy to clipboad");
        }, 5000);
      })
      .catch(() => alert("Failed to copy"));
  };

  useEffect(() => {
    const prevEmail = localStorage.getItem("lastEmail");
    if (prevEmail == null) {
      return;
    }
    const prevLogin = prevEmail?.split("@")[0];
    const prevDomain = prevEmail?.split("@")[1];
    setEmail(prevEmail);
    setLogin(prevLogin);
    setDomain(prevDomain);
    async function setEmails() {
      console.log(login, domain);
      await axios
        .get(
          `https://www.1secmail.com/api/v1/?action=getMessages&login=${prevLogin}&domain=${prevDomain}`
        )
        .then((res) => {
          setInbox(res.data);
        })
        .catch((err) => {
          throw new Error(`Failed to fetch emails ${err}`);
        });
    }
    setEmails();
  }, []);

  return (
    <div className="mx-10">
      <div className=" flex flex-col justify-center items-center gap-5">
        <div>
          {loader ? (
            <div role="status">
              <svg
                aria-hidden="true"
                className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          ) : (
            <div className="py-3 px-10 bg-gray-800 rounded-2xl select-none">
              {email}
            </div>
          )}
        </div>
        <div className="flex flex-wrap justify-center">
          <button
            onClick={handleGenerateEmail}
            type="button"
            className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
          >
            Generate Email
          </button>
          <button
            onClick={handleRefresh}
            type="button"
            className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
          >
            Refresh Inbox
          </button>
          <button
            onClick={handleCopyToClipBoard}
            type="button"
            className="py-2.5 px-5 w-40 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
          >
            {clipboardMsg}
          </button>
        </div>
      </div>
      <div className="w-full mt-4">
        <div className="w-full p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4 text-2xl">
            <h5 className=" text-3xl font-bold leading-none text-gray-900 dark:text-white underline underline-offset-4">
              Inbox
            </h5>
          </div>
          <div className="flow-root overflow-x-hidden">
            <ul role="list" className="divide-gray-200 dark:divide-gray-700">
              {inbox.map(
                (
                  email: {
                    id: string;
                    from: string;
                    subject: string;
                    date: string;
                  },
                  index
                ) => (
                  <Link href={`/${email.id}`}>
                    <li className="p-1 md:p-5 rounded-2xl sm:pt-4 hover:bg-slate-900 cursor-pointer">
                      <div className="flex items-center ">
                        <div className="flex-1 min-w-0">
                          <p className="md:text-lg font-bold text-gray-900 truncate dark:text-white ">
                            {email.subject}
                          </p>
                          <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                            {email.from}
                          </p>
                        </div>
                        <div className="inline-flex flex-col items-end text-base font-semibold text-gray-900 dark:text-white">
                          <span>{email.date.split(" ")[0]}</span>
                          <span className="text-sm text-gray-500">
                            {email.date.split(" ")[1]}
                          </span>
                        </div>
                      </div>
                      <div className=" bg-gray-700 h-[1px] mt-3" />
                    </li>
                  </Link>
                )
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
