import { TaskProvider } from "./components/TaskProvider";
import Sidebar from "./components/Sidebar.jsx";
export default function App() {
  return (
    <>
      <TaskProvider>
        <Sidebar />
      </TaskProvider>
    </>
  );
} 
