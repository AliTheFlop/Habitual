import { useEffect, useState } from "react";
import axios from "axios";

export default function useFetch(url, method, requestData) {
  const [data, setData] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsFetching(true);
      try {
        let response;
        switch (method) {
          // GET
          case "get":
            response = await axios.get(url);
            setData(response.data);
            console.log("Data returned from: ", url);
            break;
          //  POST
          case "post":
            response = await axios.post(url, requestData);
            console.log("Data Sent To: ", url);
            setData({ name: "Posting Data!" });
            break;
          // PUT
          case "put":
            response = await axios.put(url, requestData);
            console.log("Data Sent To: ", url);
            setData({ name: "Putting Data!" });
            break;
          // PATCH
          case "patch":
            response = await axios.patch(url, requestData);
            console.log("Data Sent To: ", url);
            setData({ name: "Patching Data!" });
            break;
          // DELETE
          case "delete":
            response = await axios.delete(url);
            console.log("Data Deleted: ", url);
            setData({ name: "Deleting Data!" });
            break;
          default:
            setError({ Error: `Unsupported Method: ${method}` });
        }
      } catch (e) {
        setError({ Error: e });
      } finally {
        setIsFetching(false);
      }
    };

    fetchData();
  }, [url, method, requestData]);

  return { data, isFetching, error };
}
