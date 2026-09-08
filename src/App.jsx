import Documents from "./pages/Documents";
import Cases from "./pages/cases";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DocumentDetail from "./pages/DocumentDetail";
import Login from "./pages/login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Search from "./pages/search";
function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/" element={<Login />} />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
    path="/cases"
    element={
        <ProtectedRoute>
            <Cases />
        </ProtectedRoute>
    }
/>
<Route
    path="/documents"
    element={
        <ProtectedRoute>
            <Documents />
        </ProtectedRoute>
    }
/><Route
    path="/documents/:id"
    element={
        <ProtectedRoute>
            <DocumentDetail />
        </ProtectedRoute>
    }
/><Route
    path="/search"
    element={
        <ProtectedRoute>
            <Search />
        </ProtectedRoute>
    }
/>

            </Routes>
        </BrowserRouter>
    );
}

export default App;