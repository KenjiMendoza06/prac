import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.scss"
import Homepage from "./scenes/home";
import Layout from "./scenes/layout";
import Dashboard from "./scenes/dashboard";
import CreateUsers from "./scenes/admin/create";
export default function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route>
      <Route path="/" element={<Homepage />} />
        <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin/create" element={<CreateUsers />} />
        </Route>
      </Route>
    </Routes>
    </BrowserRouter>
  )
}