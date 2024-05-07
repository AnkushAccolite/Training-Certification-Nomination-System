import { useEffect} from 'react';
import { useNavigate } from "react-router-dom";


// material-ui
// import Grid from '@mui/material/Grid';

// project imports
// import EarningCard from './EarningCard';
// import PopularCard from './PopularCard';
// import TotalOrderLineChartCard from './TotalOrderLineChartCard';
// import TotalIncomeDarkCard from './TotalIncomeDarkCard';
// import TotalIncomeLightCard from './TotalIncomeLightCard';
// import TotalGrowthBarChart from './TotalGrowthBarChart';

// import { gridSpacing } from 'store/constant';

// assets
// import StorefrontTwoToneIcon from '@mui/icons-material/StorefrontTwoTone';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
  // const [isLoading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    // setLoading(false);
    navigate("/courses")

  }, []);

  return (
    <div>Welcome</div>
  );
};

export default Dashboard;
