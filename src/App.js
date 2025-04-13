import { useState, useEffect } from "react";
import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  CssBaseline,
  Grid,
  InputAdornment,
  Pagination,
  TextField,
  ThemeProvider,
  Toolbar,
  Typography,
  createTheme,
  useMediaQuery,
  IconButton,
  Collapse,
  Paper,
  Modal,
  Alert,
} from "@mui/material";
import { Search, FilterList, Clear } from "@mui/icons-material";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import jobsData from "./jobs.json";

const DEMO_USERNAME = "minh demo";
const DEMO_PASSWORD = "welcomeminh";

const getLastUsedCredentials = () => ({
  username: localStorage.getItem("lastUsername") || DEMO_USERNAME,
  password: localStorage.getItem("lastPassword") || DEMO_PASSWORD
});

function App() {
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [skillsQuery, setSkillsQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showJobModal, setShowJobModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(localStorage.getItem("username") || "");
  const [returnToJobAfterLogin, setReturnToJobAfterLogin] = useState(null);
  const isMobile = useMediaQuery("(max-width:600px)");
  const jobsPerPage = 5;
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setJobs(jobsData);
    const query = searchParams.get("q") || "";
    const locationParam = searchParams.get("location") || "";
    const skills = searchParams.get("skills") || "";
    setSearchQuery(query);
    setLocationQuery(locationParam);
    setSkillsQuery(skills);

    if (location.pathname === "/login") {
      setShowLoginModal(true);
      const lastCreds = getLastUsedCredentials();
      setUsername(lastCreds.username);
      setPassword(lastCreds.password);
    }

    const storedAuth = localStorage.getItem("isAuthenticated");
    if (storedAuth === "true") {
      setIsAuthenticated(true);
    }
  }, [location.pathname, searchParams]);

  const theme = createTheme({
    palette: {
      mode: "dark",
      primary: {
        main: "#f4b400",
      },
      background: {
        default: "#121212",
        paper: "#1e1e1e",
      },
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: "#1e1e1e",
            display: "flex",
            flexDirection: "column",
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: "#1e1e1e",
            boxShadow: "none",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
          },
        },
      },
      MuiContainer: {
        styleOverrides: {
          root: {
            "&.MuiContainer-maxWidthLg": {
              maxWidth: "1100px",
            },
          },
        },
      },
    },
  });

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const updateSearchParams = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (locationQuery) params.set("location", locationQuery);
    if (skillsQuery) params.set("skills", skillsQuery);
    setSearchParams(params);
  };

  useEffect(() => {
    updateSearchParams();
  }, [searchQuery, locationQuery, skillsQuery, setSearchParams, updateSearchParams]);

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      !searchQuery ||
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLocation =
      !locationQuery ||
      job.city.toLowerCase().includes(locationQuery.toLowerCase());

    const matchesSkills =
      !skillsQuery ||
      job.skills.some((skill) =>
        skill.toLowerCase().includes(skillsQuery.toLowerCase())
      );

    return matchesSearch && matchesLocation && matchesSkills;
  });

  const startIndex = (page - 1) * jobsPerPage;
  const displayedJobs = filteredJobs.slice(
    startIndex,
    startIndex + jobsPerPage
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
        <AppBar
          position="sticky"
          sx={{ bgcolor: "#242424", boxShadow: "none" }}
        >
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
            <Typography
              variant="h6"
              component="div"
              sx={{ fontSize: "1rem", whiteSpace: 'nowrap' }}
            >
              Job Routing
            </Typography>

            <Box sx={{ 
              flex: 1,
              maxWidth: '500px',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <TextField
                size="small"
                placeholder="Search"
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "rgba(255,255,255,0.1)",
                  },
                }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: "rgba(255,255,255,0.7)" }} />
                    </InputAdornment>
                  ),
                }}
              />
              <IconButton
                color="inherit"
                onClick={() => setShowFilters(!showFilters)}
                sx={{
                  bgcolor: showFilters ? "rgba(255,255,255,0.1)" : "transparent",
                  flexShrink: 0
                }}
              >
                <FilterList />
              </IconButton>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
              {isAuthenticated ? (
                <>
                  <Typography
                    variant="body2"
                    sx={{ 
                      color: 'rgba(255,255,255,0.7)',
                      fontSize: '0.875rem',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {currentUser}
                  </Typography>
                  <Button
                    color="inherit"
                    onClick={() => {
                      setIsAuthenticated(false);
                      setCurrentUser("");
                      localStorage.removeItem("isAuthenticated");
                      localStorage.removeItem("username");
                      navigate("/");
                    }}
                    sx={{ 
                      fontSize: "0.875rem",
                      whiteSpace: 'nowrap',
                      minWidth: 'auto'
                    }}
                  >
                    Sign out
                  </Button>
                </>
              ) : (
                <Button
                  color="inherit"
                  onClick={() => {
                    setShowLoginModal(true);
                    navigate("/login");
                  }}
                  sx={{ 
                    fontSize: "0.875rem",
                    whiteSpace: 'nowrap',
                    minWidth: 'auto'
                  }}
                >
                  Sign in
                </Button>
              )}
            </Box>
          </Toolbar>
        </AppBar>
        <Collapse in={showFilters}>
          <Paper
            sx={{
              bgcolor: "#242424",
              borderTop: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 0,
              px: 2,
              py: 1.5,
            }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6}>
                <TextField
                  size="small"
                  fullWidth
                  placeholder="Filter by location"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  InputProps={{
                    endAdornment: locationQuery && (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => setLocationQuery("")}
                        >
                          <Clear />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  size="small"
                  fullWidth
                  placeholder="Filter by skills"
                  value={skillsQuery}
                  onChange={(e) => setSkillsQuery(e.target.value)}
                  InputProps={{
                    endAdornment: skillsQuery && (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => setSkillsQuery("")}
                        >
                          <Clear />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </Paper>
        </Collapse>

        <Container
          sx={{
            py: 2,
            px: 3,
            maxWidth: "1200px !important",
            mx: "auto",
          }}
        >
          <Grid container spacing={2} justifyContent="center">
            {displayedJobs.map((job) => (
              <Grid
                item
                key={job.id}
                xs={12}
                sm={4}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <Card
                  sx={{
                    bgcolor: "#1e1e1e",
                    boxShadow: "none",
                    borderRadius: 1,
                    height: "250px",
                    width: "360px",
                    border: "1px solid rgba(255,255,255,0.1)",
                    display: "flex",
                    flexDirection: "column",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                      borderColor: "primary.main",
                    },
                  }}
                  onClick={() => {
                    if (isAuthenticated) {
                      setSelectedJob(job);
                      setShowJobModal(true);
                    } else {
                      setReturnToJobAfterLogin(job);
                      setShowLoginModal(true);
                      navigate("/login");
                    }
                  }}
                >
                  <CardContent
                    sx={{
                      p: 2,
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ 
                        fontSize: "0.95rem", 
                        fontWeight: 500, 
                        mb: 1,
                        pb: 1,
                        borderBottom: '1px solid rgba(255,255,255,0.1)'
                      }}
                    >
                      {job.title}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        flexWrap: "wrap",
                        mb: 1
                      }}
                    >
                      {job.skills.slice(0, 4).map((skill, index) => (
                        <Chip
                          key={index}
                          label={skill}
                          size="small"
                          sx={{
                            bgcolor: "#d32f2f",
                            color: "#ffffff",
                            border: "none",
                            borderRadius: 0.5,
                            height: "20px",
                            "& .MuiChip-label": {
                              px: 1,
                              fontSize: "0.7rem",
                              lineHeight: 1,
                              fontWeight: 500,
                            },
                          }}
                        />
                      ))}
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "rgba(255,255,255,0.5)",
                        fontSize: "0.85rem",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        lineHeight: 1.5,
                      }}
                    >
                      {job.description}
                    </Typography>
                    <Button
                      variant="contained"
                      sx={{
                        textTransform: "uppercase",
                        bgcolor: "#f4b400",
                        px: 2,
                        py: 0.5,
                        fontSize: "0.7rem",
                        fontWeight: "bold",
                        minWidth: 0,
                        boxShadow: "none",
                        mt: "auto",
                        alignSelf: "center",
                        "&:hover": {
                          bgcolor: "#f4b400",
                          boxShadow: "none",
                        },
                      }}
                    >
                      Learn More
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}

            {displayedJobs.length % 3 !== 0 &&
              Array.from({ length: 3 - (displayedJobs.length % 3) }).map(
                (_, idx) => (
                  <Grid
                    item
                    key={`placeholder-${idx}`}
                    xs={12}
                    sm={4}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      visibility: "hidden",
                    }}
                  >
                    <Box sx={{ width: "360px", height: "200px" }} />
                  </Grid>
                )
              )}
          </Grid>

          <Box sx={{ display: "flex", justifyContent: "center", mt: 3, mb: 2 }}>
            <Pagination
              count={Math.ceil(filteredJobs.length / jobsPerPage)}
              page={page}
              onChange={handlePageChange}
              sx={{
                "& .MuiPaginationItem-root": {
                  color: "#fff",
                  "&.Mui-selected": {
                    bgcolor: "#f4b400",
                  },
                },
              }}
              size={isMobile ? "small" : "medium"}
            />
          </Box>
        </Container>

        {/* Login Modal */}
        <Modal
          open={showLoginModal}
          onClose={() => {
            setShowLoginModal(false);
            setError("");
            const lastCreds = getLastUsedCredentials();
            setUsername(lastCreds.username);
            setPassword(lastCreds.password);
            if (location.pathname === "/login") {
              navigate(-1);
            }
          }}
          aria-labelledby="login-modal"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: { xs: "90%", sm: 400 },
              bgcolor: "background.paper",
              borderRadius: 1,
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography variant="h6" component="h2" gutterBottom>
              Sign In
            </Typography>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <TextField
              fullWidth
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              margin="normal"
              defaultValue={DEMO_USERNAME}
              placeholder="Username: minh demo"
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              defaultValue={DEMO_PASSWORD}
              placeholder="Password: welcomeminh"
            />
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3 }}
              onClick={() => {
                if (username.trim() && password.trim()) {
                  // Save the credentials for next login
                  localStorage.setItem("lastUsername", username.trim());
                  localStorage.setItem("lastPassword", password.trim());
                  const trimmedUsername = username.trim();
                  setIsAuthenticated(true);
                  setCurrentUser(trimmedUsername);
                  localStorage.setItem("isAuthenticated", "true");
                  localStorage.setItem("username", trimmedUsername);
                  setShowLoginModal(false);
                  setError("");
                  setUsername("");
                  setPassword("");
                  if (returnToJobAfterLogin) {
                    setSelectedJob(returnToJobAfterLogin);
                    setShowJobModal(true);
                    setReturnToJobAfterLogin(null);
                    navigate(-1);
                  } else {
                    navigate("/");
                  }
                } else {
                  setError("Please enter both username and password");
                }
              }}
            >
              Sign In
            </Button>
          </Box>
        </Modal>

        <Modal
          open={showJobModal}
          onClose={() => setShowJobModal(false)}
          aria-labelledby="job-modal"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: { xs: "90%", sm: 600 },
              maxHeight: "90vh",
              overflow: "auto",
              bgcolor: "background.paper",
              borderRadius: 1,
              boxShadow: 24,
              p: 4,
            }}
          >
            {selectedJob && (
              <>
                <Typography variant="h5" component="h2" gutterBottom>
                  {selectedJob.title}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    📍 {selectedJob.city} {selectedJob.remote && "(Remote Available)"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    💰 ${selectedJob.salaryLow.toLocaleString()} - ${selectedJob.salaryHigh.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    ⭐ {selectedJob.yrsXPExpected} years experience required
                  </Typography>
                </Box>
                <Typography variant="body1">
                  {selectedJob.description}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Required Skills:
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    {selectedJob.skills.map((skill, index) => (
                      <Chip
                        key={index}
                        label={skill}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Box>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3 }}
                  onClick={() => setShowJobModal(false)}
                >
                  Close
                </Button>
              </>
            )}
          </Box>
        </Modal>
      </Box>
    </ThemeProvider>
  );
}

export default App;
