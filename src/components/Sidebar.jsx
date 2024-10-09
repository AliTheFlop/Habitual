import { useContext } from "react";
import { MainContext } from "./TaskProvider";
import PlaceholderPFP from "../assets/PlaceholderPFP.jpg";
import useFetch from "../hooks/useFetch";

let errorData = {
  name: "No Data!",
};

/*

TESTED:
  Daily: GET GET-SPECIFIC POST PUT PATCH DELETE
  WEEKLY: GET GET-SPECIFIC POST PUT PATCH DELETE

*/

export default function Sidebar() {
  const { userInfo } = useContext(MainContext);
  const { data, isFetching, error } = useFetch(
    "http://localhost:3000/api/tasks/weekly/6705fce24df5ab32310ffc14",
    "delete",
    null
  );

  return (
    <>
      <div className="w-1/5 outline flex flex-col h-full">
        <div className="flex flex-col items-center">
          <img
            src={PlaceholderPFP}
            alt="User profile picture"
            width="50px"
            height="50px"
            className="py-3"
          />
          <h1>{userInfo.name}</h1>
        </div>
        <div>
          {/*
            Code below: If there's an error, put the error message.
            Else CONTINUE and check if it's still fetching, if so put Loading... 
            Else check if the data is an array, if so map it Else put the data 
          */}
          {error ? (
            <p>
              {error.code}: {error.message}
            </p>
          ) : isFetching ? (
            <p>Loading...</p>
          ) : Array.isArray(data) ? (
            data.map((item) => <p key={item._id}>{item.name}</p>)
          ) : (
            <p>{data ? data.name : errorData.name}</p>
          )}
        </div>
      </div>
    </>
  );
}
