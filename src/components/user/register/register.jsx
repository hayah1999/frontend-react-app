import React, { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { register } from "../../../features/auth/authSlice";
import Loader from "../../layout/loader";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="#">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const theme = createTheme();

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    dob: "",
    image: null,
  });

  const { name, username, email, password, phone, address, dob, image } =
    formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isRegisterSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isRegisterSuccess) {
      setTimeout(() => {
        navigate("/login");
      }
      , 3000);
    }

    if(user && !isRegisterSuccess){
      navigate("/profile");
    }
  }, [ user, isError, isRegisterSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    if (e.target.name === "image") {
      setFormData((prevState) => ({
        ...prevState,
        image: e.target.files[0],
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value,
      }));
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!name || !username || !email || !password) {
      alert("Please fill out all required fields");
      return;
    }
    const form_data = new FormData();
    form_data.append("name", name);
    form_data.append("username", username);
    form_data.append("email", email);
    form_data.append("password", password);
    if (phone) {
      form_data.append("phone", phone);
    }
    
    if (address) {
      form_data.append("address", address);
    }
    
    if (dob) {
      form_data.append("dob", dob);
    }
    
    if (image) {
      form_data.append("image", image);
    }

    dispatch(register(form_data));
  };

  return (
    <div style={{ backgroundColor: "#85822E" }}>
      {isLoading ? (
        <Loader />
      ) : (
        <ThemeProvider theme={theme}>
          <Container component="main" maxWidth="sm" sx={{padding: 2}}>
            <CssBaseline />
            <Box
              sx={{
                marginTop: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",

                py: 4, // padding top & bottom
                px: 3, // padding left & right
                borderRadius: "sm",
                boxShadow: "md",
                bgcolor: "#FAFDF6",
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: "#85822E" }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Sign up
              </Typography>
              <Box
                component="form"
                noValidate
                onSubmit={onSubmit}
                sx={{ mt: 3 }}
                encType="multipart/form-data"
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12}>
                    <TextField
                      autoComplete="given-name"
                      name="name"
                      required
                      fullWidth
                      id="name"
                      label="Full Name"
                      autoFocus
                      onChange={onChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <TextField
                      required
                      fullWidth
                      id="username"
                      label="Enter your username"
                      name="username"
                      autoComplete="username"
                      onChange={onChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="email"
                      label="Enter your E-mail"
                      name="email"
                      autoComplete="email"
                      onChange={onChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      name="password"
                      label="Password"
                      type="password"
                      id="password"
                      autoComplete="new-password"
                      onChange={onChange}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      id="dob"
                      label="Date of Birth"
                      type="date"
                      name="dob"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      onChange={onChange}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      id="phone"
                      label="Phone"
                      name="phone"
                      fullWidth
                      onChange={onChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      id="address"
                      label="Address"
                      name="address"
                      fullWidth
                      multiline
                      rows={4}
                      onChange={onChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <label htmlFor="image">
                      <Typography variant="h6" sx={{ marginRight: 4 }}>
                        Upload Image
                      </Typography>
                    </label>
                    <input
                      accept="image/*"
                      id="image"
                      name="image"
                      type="file"
                      onChange={onChange}
                    />
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2, backgroundColor: '#ece87d', color: '#2d2a32', "&:hover":{backgroundColor: '#fffcae'} }}
                >
                  Sign Up
                </Button>
                <Grid container justifyContent="flex-end">
                  <Grid item>
                    <Link onClick={()=>{navigate('/login')}} variant="body2">
                      Already have an account? Sign in
                    </Link>
                  </Grid>
                </Grid>
              </Box>
              <ToastContainer />
              </Box>
              <Copyright sx={{ mt: 5, color:'#FAFDF6' }} />
          </Container>
        </ThemeProvider>
      )}
    </div>
  );
}

export default Register;
