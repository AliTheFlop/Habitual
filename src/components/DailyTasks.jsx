import useFetch from "../hooks/useFetch";

let errorData = {
	name: "No Data!",
};

// let sampleData = {
//     name: "Do the dishes",
//     weight: 3,
// }

export default function DailyTasks() {
	const { data, isFetching, error } = useFetch(
		"http://localhost:3000/api/tasks/weekly",
		"get",
		null
	);

	return (
		<>
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
		</>
	);
}
