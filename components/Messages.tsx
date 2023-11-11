"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Messages({ id }: { id: string }) {
  const router = useRouter();
  const [login, setLogin] = useState("");
  const [domain, setDomain] = useState("");
  const [message, setMessage] = useState({
    id: id,
    from: "",
    subject: "",
    date: "",
    attachments: [],
    body: "",
    textBody: "",
    htmlBody: "",
  });

  const getMessage = async (login: string, domain: string) => {
    await axios
      .get(
        `https://www.1secmail.com/api/v1/?action=readMessage&login=${login}&domain=${domain}&id=${id}`
      )
      .then((res) => {
        console.log(res.data);
        setMessage(res.data);
      });
  };

  useEffect(() => {
    const email: string[] | undefined = localStorage
      .getItem("lastEmail")
      ?.split("@");
    if (!email) {
      return;
    }
    setLogin(email[0]);
    setDomain(email[1]);
    getMessage(email[0], email[1]);
  }, []);
  return (
    <div className="m-10 mt-0 md:pt-0 md:p-10 rounded-xl">
      <button
        onClick={() => {
          router.push("/");
        }}
        type="button"
        className="py-2.5 px-5 me-2 mb-5 text-lg font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
      >
        Go Back
      </button>

      {/* {message} */}
      <div className="flex flex-col">
        <span className="font-bold text-2xl">{message.subject}</span>
        <span className="italic">Sent By: {message.from}</span>
        <span className="italic">On: {message.date}</span>
      </div>
      <div
        dangerouslySetInnerHTML={{ __html: message.body }}
        className=""
      ></div>
      <div>
        {message.attachments?.map(
          (file: { filename: string; contentType: string; size: number }) => (
            <div className="max-w-fit p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {file.filename}
              </h5>
              <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                fileType: {file.contentType.split("/")[1]}
              </p>
              <a
                href={`https://www.1secmail.com/api/v1/?action=download&login=${login}&domain=${domain}&id=${id}&file=${file.filename}`}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Downlaod
                <svg
                  className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M1 5h12m0 0L9 1m4 4L9 9"
                  />
                </svg>
              </a>
            </div>
          )
        )}
      </div>
    </div>
  );
}
