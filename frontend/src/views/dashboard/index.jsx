import { useEffect} from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";

// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
    const navigate = useNavigate();
  const auth = useSelector(state=>state.auth);

  useEffect(() => {
    if(!(auth?.isAuthenticated))navigate("/login");
    else navigate("/courses")

  }, []);

  return (
    <div>Welcome</div>
  );
};

export default Dashboard;
