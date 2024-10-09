import { TaskProvider } from "./components/TaskProvider";
import Sidebar from "./components/Sidebar.jsx";
import DailyTasks from "./components/DailyTasks.jsx";

export default function App() {
	return (
		<>
			<TaskProvider>
				<Sidebar />
				<div>
					<DailyTasks />
				</div>
			</TaskProvider>
		</>
	);
}
