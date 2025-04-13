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
} from "@mui/material";
import { Search, Login } from "@mui/icons-material";
import jobsData from "./jobs.json";

function App() {
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const isMobile = useMediaQuery("(max-width:600px)");
  const jobsPerPage = 5;
  const maxDescriptionLines = 3;

  useEffect(() => {
    setJobs(jobsData);
  }, []);

  const jobCardWidth = 360;

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

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <Toolbar>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 0, mr: 3, fontSize: "1rem" }}
            >
              Job Routing
            </Typography>
            <TextField
              size="small"
              placeholder="Search"
              sx={{
                flexGrow: 1,
                maxWidth: 400,
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
            <Button
              color="inherit"
              startIcon={<Login />}
              sx={{ ml: 2, textTransform: "uppercase", fontSize: "0.875rem" }}
            >
              Sign in
            </Button>
          </Toolbar>
        </AppBar>

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
      </Box>
    </ThemeProvider>
  );
}

export default App;
