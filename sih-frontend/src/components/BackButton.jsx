import { useNavigate } from "react-router-dom";

function BackButton({ to, label = "Back" }) {
    const navigate = useNavigate();

    return (
        <button onClick={() => navigate(to)}>
            ← {label}
        </button>
    );
}

export default BackButton;