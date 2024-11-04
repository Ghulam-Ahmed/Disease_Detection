import { BrowserRouter, Routes, Route } from "react-router-dom";
import LogInForm from "./Components/Login/login";
import Nav from "./Components/Navbar/Nav";
import Sign from "./Components/SignUp/signup";
import Upload from "./Components/UploadImg/upload";
import PComponent from "./Components/SignUp/P_Component";
import BotButton from "./Components/Chatbot/BotButton";
import ChatPage from "./Components/Chatbot/ChatPage";
import EmailVerify from "./Components/VerifyEmail/EmailVarify";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <BotButton />
      <Routes>
        <Route
          path="/"
          element={<Nav title1="Work" title2="Upload X-Ray" title3="Login" />}
        />
        <Route element={<PComponent />}>
          <Route path="/upload" element={<Upload />} />
        </Route>
        <Route path="/signup" element={<Sign />} />
        <Route path="/login" element={<LogInForm />} />
        <Route path="/register/:id/verify/:token" element={<EmailVerify />} />
        <Route path="/chatpage" element={<ChatPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
