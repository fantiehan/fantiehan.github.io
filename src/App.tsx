import { useEffect, useState } from "react";
import { HashRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Home from "./pages/Home";
import Publications from "./pages/Publications";
import CV from "./pages/CV";
import Notes from "./pages/Notes";
import Note from "./pages/Note";
import Background from "./components/Background";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import ScrollPencil from "./components/ScrollPencil";
import TopPencil from "./components/TopPencil";

// The first page the visitor lands on arrives as it is; only pages reached by navigating develop in.
let hasNavigated = false;

function PageSheet({ children }: { children: React.ReactNode }) {
  const [className] = useState(hasNavigated ? "page-develop" : undefined);
  useEffect(() => {
    hasNavigated = true;
  }, []);
  return <div className={className}>{children}</div>;
}

function AnimatedRoutes() {
  const location = useLocation();
  const reduceMotion = useReducedMotion();

  return (
    // The old page's ink lifts quickly, then the new one develops from the top down (`.page-develop`).
    // Scroll to the top only once the old page has faded out and before the new one mounts, so the
    // new page measures itself (for example the Home signature) from the top.
    <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo({ top: 0, behavior: "instant" })}>
      <motion.div
        key={location.pathname}
        exit={reduceMotion ? undefined : { opacity: 0 }}
        transition={{ duration: 0.16, ease: "easeOut" }}
      >
        <PageSheet>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/publications" element={<Publications />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/notes/:slug" element={<Note />} />
            <Route path="/cv" element={<CV />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </PageSheet>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <Router>
      <Background />
      <div className="min-h-dvh text-[var(--ink)]">
        <NavBar />
        <main>
          <AnimatedRoutes />
        </main>
        <Footer />
        <ScrollPencil />
        <TopPencil />
      </div>
    </Router>
  );
}
