import { Route, Routes } from "react-router-dom";

import NavBar from "./pages/NavBar/NavBar";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import Book from "./pages/Book/Book";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import Account from "./pages/Account/Account";
import Settings from "./pages/Settings/Settings";
import NotFound from "./pages/NotFound/NotFound";
import PostBook from "./pages/PostBook/PostBook";

const App = () => {
  return (
    <main>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/account" element={<Account />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/book/:id" element={<Book />} />
        <Route path="/post-book" element={<PostBook />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>
  );
};

export default App;
