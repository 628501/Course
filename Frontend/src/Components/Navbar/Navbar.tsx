import React from "react";
import { styled } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Typography from "@mui/material/Typography";
import SearchIcon from "@mui/icons-material/Search";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { Link, useNavigate, useParams } from "react-router-dom";
import LoginIcon from "@mui/icons-material/Login";
import Tooltip from "@mui/material/Tooltip";
import { useLogoutMutation } from "../../Slices/StudentSlice";
import {
  useGetSuggestionsQuery,
} from "../../Slices/CourseSlice";
import { toast } from "react-toastify";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import NotFound from "../NotFound/NotFound";

interface Suggestion {
  id: number;
  name: string;
}

const SearchContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  maxWidth: "600px",
  display: "flex",
  justifyContent: "center",
  padding: theme.spacing(0, 2),
  margin: "0 auto",
  [theme.breakpoints.down("md")]: {
    maxWidth: "300px",
  },
  [theme.breakpoints.down("sm")]: {
    maxWidth: "200px",
  },
  [theme.breakpoints.down("xs")]: {
    maxWidth: "100px",
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  width: "100%",
  borderRadius: "50px",
  overflow: "hidden",
  "& .MuiOutlinedInput-root": {
    borderRadius: "50px",
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: theme.palette.text.primary,
      borderWidth: "1px",
      borderRadius: "50px",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: theme.palette.text,
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: theme.palette.text,
    },
  },
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    fontSize: "0.875rem",
  },
  [theme.breakpoints.down("xs")]: {
    "& .MuiInputBase-input": {
      padding: theme.spacing(0.5, 1, 0.5, 0),
    },
  },
}));

const Navbar: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [inputValue, setInputValue] = React.useState<string>("");
  const [logout] = useLogoutMutation();
  const navigate = useNavigate();
  const { searchTerm } = useParams<{ searchTerm?: string }>();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const { data: suggestions = [], isFetching } = useGetSuggestionsQuery(
    searchQuery,
    {
      skip: searchQuery.length < 2,
    }
  );

  const getUser = () => {
    const userStr = localStorage.getItem("student");
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        console.error("Error parsing user:", error);
        return null;
      }
    }
    return null;
  };

  const user = getUser();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      localStorage.removeItem("student");
      setAnchorEl(null);
      toast.success("Logout Successfully");
    } catch (err) {
      console.error("Logout failed:", err);
      toast.error("Logout Failed");
    }
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  React.useEffect(() => {
    if (searchTerm) {
      setSearchQuery(searchTerm ?? "");
      setInputValue(searchTerm ?? "");
    }
  }, [searchTerm]);

  const handleSearch = (
    event: React.SyntheticEvent,
    value: Suggestion | null,
    reason: string
  ) => {
    const searchValue = value ? value.name : searchQuery;
    if (searchValue) {
      navigate(`/search/${searchValue}`);
    } else {
      navigate("/");
    }
  };

  return (
    <div>
      <Box sx={{ flexGrow: 1, position: "relative", zIndex: 2 }}>
        <AppBar
          position="fixed"
          sx={{
            backgroundColor: "white",
            color: "black",
            padding: "0 16px",
            height: "80px",
          }}
        >
          <Toolbar
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              height: "100%",
              padding: "0 16px",
            }}
          >
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ fontWeight: 600 }}
            >
              <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
                Mindvista
              </Link>
            </Typography>

            <SearchContainer>
              <Autocomplete
                sx={{ width: "200%" }}
                freeSolo
                options={inputValue ? suggestions : []}
                getOptionLabel={(option: string | Suggestion) =>
                  typeof option === "string" ? option : option.name
                }
                renderInput={(params) => (
                  <StyledTextField
                    {...params}
                    placeholder="Search for anything"
                    variant="outlined"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSearch(e, null, "blur");
                        setInputValue("");
                      }
                    }}
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <React.Fragment>
                          <SearchIcon />
                          {params.InputProps.startAdornment}
                        </React.Fragment>
                      ),
                    }}
                  />
                )}
                onInputChange={(event, newInputValue) => {
                  setInputValue(newInputValue || "");
                  setSearchQuery(newInputValue || "");
                  if (!newInputValue) {
                    navigate("/");
                  }
                }}
                onChange={(event, value, reason) =>
                  handleSearch(event, value as Suggestion | null, reason)
                }
                loading={isFetching}
                noOptionsText={
                  searchQuery && suggestions.length === 0 ? (
                    <NotFound linkText="Home Page" />
                  ) : undefined
                }
              />
            </SearchContainer>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >

                <Link to="/enrolled-courses" style={{ textDecoration: "none" }}>
                  <Typography
                    sx={{
                      "&:hover": {
                        color: "purple",
                      },
                    }}
                  >
                    My Learning
                  </Typography>
                </Link>

              {user?.name ? (
                <div>
                  <Tooltip title={user.name} arrow>
                    <IconButton
                      size="large"
                      aria-label="account of current user"
                      aria-controls="menu-appbar"
                      aria-haspopup="true"
                      onClick={handleMenu}
                      color="inherit"
                    >
                      <AccountCircle />
                    </IconButton>
                  </Tooltip>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
                    <MenuItem onClick={handleLogout}>Log Out</MenuItem>
                  </Menu>
                </div>
              ) : (
                <Tooltip title="Login" arrow>
                  <IconButton
                    color="inherit"
                    onClick={() => navigate("/login")}
                  >
                    <LoginIcon />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </Toolbar>
        </AppBar>
      </Box>

    </div>
  );
};

export default Navbar;