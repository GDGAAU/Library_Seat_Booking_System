import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  Avatar,
  IconButton,
  AppBar,
  Toolbar,
  useTheme,
  Badge,
  InputBase,
  alpha,
  CircularProgress,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Notifications as NotificationsIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Apartment as BuildingIcon,
  Grid3x3 as ZoneIcon,
  EventSeat as SeatIcon,
  SupervisorAccount as AdminIcon,
} from "@mui/icons-material";
import { db } from "../../firebase/firebase"; // Make sure to create this config file
import { collection, getDocs } from "firebase/firestore";
import FloorManagement from "./FloorManagement";
import ZoneManagement from "./ZoneManagement";
import SeatManagement from "./SeatManagement";
import AdminManagement from "./AdminManagement";
import ProfileSettings from "./ProfileSettings";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState(0);
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [summaryData, setSummaryData] = useState({
    totalFloors: 0,
    totalZones: 0,
    totalSeats: 0,
    availableSeats: 0,
    occupancyRate: "0%",
  });
  const [showProfileSettings, setShowProfileSettings] = useState(false);

  useEffect(() => {
    // Fetch data from Firebase when component mounts
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch floors data
        const floorsSnapshot = await getDocs(collection(db, "floors"));
        const totalFloors = floorsSnapshot.size;

        // Fetch zones data
        const zonesSnapshot = await getDocs(collection(db, "zones"));
        const totalZones = zonesSnapshot.size;

        // Fetch seats data
        const seatsSnapshot = await getDocs(collection(db, "seats"));
        const seats = seatsSnapshot.docs.map((doc) => doc.data());
        const totalSeats = seats.length;
        const availableSeats = seats.filter((seat) => !seat.isOccupied).length;

        // Calculate occupancy rate
        const occupancyRate =
          totalSeats > 0
            ? Math.round(((totalSeats - availableSeats) / totalSeats) * 100)
            : 0;

        // Update state with fetched data
        setSummaryData({
          totalFloors,
          totalZones,
          totalSeats,
          availableSeats,
          occupancyRate: `${occupancyRate}%`,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setShowProfileSettings(false);
  };

  const handleProfileClick = () => {
    setShowProfileSettings(true);
    setActiveTab(-1); // Set to invalid tab index to show none are selected
  };

  // Get the appropriate component based on active tab
  const getActiveComponent = () => {
    if (showProfileSettings) {
      return <ProfileSettings />;
    }

    switch (activeTab) {
      case 0:
        return <FloorManagement />;
      case 1:
        return <ZoneManagement />;
      case 2:
        return <SeatManagement />;
      case 3:
        return <AdminManagement />;
      default:
        return <FloorManagement />;
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        bgcolor: "#f5f5f5",
      }}
    >
      <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            color="inherit"
            sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}
          >
            <DashboardIcon sx={{ mr: 1 }} />
            Seat Booking System
          </Typography>

          {/* Search */}
          <Box
            sx={{
              position: "relative",
              borderRadius: 1,
              bgcolor: alpha(theme.palette.common.black, 0.05),
              "&:hover": { bgcolor: alpha(theme.palette.common.black, 0.1) },
              mr: 2,
              width: "300px",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                display: "flex",
                alignItems: "center",
                pl: 1,
                pointerEvents: "none",
                height: "100%",
              }}
            >
              <SearchIcon />
            </Box>
            <InputBase
              placeholder="Search…"
              sx={{ pl: 5, pr: 1, py: 1, width: "100%" }}
            />
          </Box>

          <IconButton color="inherit">
            <Badge badgeContent={4} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton color="inherit" sx={{ ml: 1 }}>
            <SettingsIcon />
          </IconButton>
          <IconButton
            color="inherit"
            sx={{ ml: 1 }}
            onClick={handleProfileClick}
          >
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: theme.palette.primary.main,
              }}
            >
              <PersonIcon fontSize="small" />
            </Avatar>
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4, flexGrow: 1 }}>
        {/* Page Title */}
        <Typography
          variant="h4"
          component="h1"
          sx={{ mb: 4, fontWeight: "bold" }}
        >
          {showProfileSettings
            ? "Profile Settings"
            : "Seat Booking Admin Dashboard"}
        </Typography>

        {!showProfileSettings && (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {loading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                  py: 8,
                }}
              >
                <CircularProgress />
              </Box>
            ) : (
              <>
                <Grid item xs={12} sm={6} md={3}>
                  <Card
                    elevation={2}
                    sx={{
                      height: "100%",
                      borderRadius: 2,
                      transition: "transform 0.2s",
                      "&:hover": { transform: "translateY(-5px)" },
                    }}
                  >
                    <CardContent
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        p: 3,
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 2 }}
                      >
                        <Avatar
                          sx={{ bgcolor: theme.palette.primary.light, mr: 2 }}
                        >
                          <BuildingIcon />
                        </Avatar>
                        <Typography variant="h6" color="textSecondary">
                          Floors
                        </Typography>
                      </Box>
                      <Typography
                        variant="h3"
                        component="div"
                        sx={{ fontWeight: "bold" }}
                      >
                        {summaryData.totalFloors}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ mt: 1 }}
                      >
                        Total floors in the building
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Card
                    elevation={2}
                    sx={{
                      height: "100%",
                      borderRadius: 2,
                      transition: "transform 0.2s",
                      "&:hover": { transform: "translateY(-5px)" },
                    }}
                  >
                    <CardContent
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        p: 3,
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 2 }}
                      >
                        <Avatar
                          sx={{ bgcolor: theme.palette.secondary.light, mr: 2 }}
                        >
                          <ZoneIcon />
                        </Avatar>
                        <Typography variant="h6" color="textSecondary">
                          Zones
                        </Typography>
                      </Box>
                      <Typography
                        variant="h3"
                        component="div"
                        sx={{ fontWeight: "bold" }}
                      >
                        {summaryData.totalZones}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ mt: 1 }}
                      >
                        Total zones across all floors
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Card
                    elevation={2}
                    sx={{
                      height: "100%",
                      borderRadius: 2,
                      transition: "transform 0.2s",
                      "&:hover": { transform: "translateY(-5px)" },
                    }}
                  >
                    <CardContent
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        p: 3,
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 2 }}
                      >
                        <Avatar
                          sx={{ bgcolor: theme.palette.error.light, mr: 2 }}
                        >
                          <SeatIcon />
                        </Avatar>
                        <Typography variant="h6" color="textSecondary">
                          Seats
                        </Typography>
                      </Box>
                      <Typography
                        variant="h3"
                        component="div"
                        sx={{ fontWeight: "bold" }}
                      >
                        {summaryData.totalSeats}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ mt: 1 }}
                      >
                        {summaryData.availableSeats} seats available
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Card
                    elevation={2}
                    sx={{
                      height: "100%",
                      borderRadius: 2,
                      transition: "transform 0.2s",
                      "&:hover": { transform: "translateY(-5px)" },
                    }}
                  >
                    <CardContent
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        p: 3,
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 2 }}
                      >
                        <Avatar
                          sx={{ bgcolor: theme.palette.success.light, mr: 2 }}
                        >
                          <AdminIcon />
                        </Avatar>
                        <Typography variant="h6" color="textSecondary">
                          Occupancy
                        </Typography>
                      </Box>
                      <Typography
                        variant="h3"
                        component="div"
                        sx={{ fontWeight: "bold" }}
                      >
                        {summaryData.occupancyRate}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ mt: 1 }}
                      >
                        Current occupancy rate
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </>
            )}
          </Grid>
        )}

        {!showProfileSettings && (
          /* Tabs Navigation */
          <Paper
            elevation={3}
            sx={{ borderRadius: 2, overflow: "hidden", mb: 4 }}
          >
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
              sx={{
                "& .MuiTab-root": {
                  py: 2,
                  fontSize: "1rem",
                  fontWeight: "medium",
                  transition: "all 0.2s",
                  "&:hover": {
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                  },
                },
              }}
            >
              <Tab
                label="Floors"
                icon={<BuildingIcon />}
                iconPosition="start"
              />
              <Tab label="Zones" icon={<ZoneIcon />} iconPosition="start" />
              <Tab label="Seats" icon={<SeatIcon />} iconPosition="start" />
              <Tab label="Admins" icon={<AdminIcon />} iconPosition="start" />
            </Tabs>
          </Paper>
        )}

        {/* Content Area */}
        <Paper elevation={2} sx={{ p: 3, borderRadius: 2, minHeight: "400px" }}>
          {getActiveComponent()}
        </Paper>
      </Container>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: "auto",
          bgcolor: "background.paper",
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Container maxWidth="xl">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} Seat Booking Admin Dashboard
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
