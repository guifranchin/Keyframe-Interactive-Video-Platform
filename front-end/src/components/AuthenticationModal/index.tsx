import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  useTheme,
  useMediaQuery,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import validator from "validator";
import { Login, Register } from "../../services/auth";
import { useLoading } from "../../context/loading_context";
import { useSnack } from "../../context/snack_context";
import { useUserData } from "../../context/user_data_context";
import { GetLoggedUserData } from "../../services/user";

interface Props {
  open: boolean;
  setOpen(v: boolean): void;
  doneCallback(): void;
}

export const AuthenticationModal = ({ open, setOpen, doneCallback }: Props) => {
  const [isLogin, setIsLogin] = useState(true);
  const [registerStep, setRegisterStep] = useState(1);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState<File>();
  const [base64Avatar, setBase64Avatar] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [errorName, setErrorName] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const loading = useLoading();
  const snack = useSnack();
  const { userData, setUserData } = useUserData();
  const baseUrl = process.env.REACT_APP_MEDIA_ENDPOINT;
  const fileRef = useRef<HTMLInputElement>(null);

  const handleClose = () => {
    setOpen(false);
  };

  const validateLogin = () => {
    let hasError = false;
    if (!validator.isEmail(email)) {
      setErrorEmail("Email inválido");
      hasError = true;
    }
    if (!password || password.length < 3 || password.length > 50) {
      setErrorPassword("Senha inválida");
      hasError = true;
    }
    if (!isLogin && (!name || name.length < 3 || name.length > 50)) {
      setErrorName("Nome inválido");
      hasError = true;
    }
    return hasError;
  };

  const validateImage = () => {
    let hasError = false

    if(!avatar)
      return hasError

    if(avatar.type !== "image/png" && avatar.type !== "image/jpeg" && avatar.type !== "image/gif"){
      snack.error("The file need to be .jpg or .png")
      hasError = true
    }
    if(avatar.size > 5000000){
      snack.error("The file have to be at max 5mb")
      hasError = true
    }

    return hasError
  }

  const doLogin = async () => {
    try {
      if (validateLogin()) return;

      loading.show();
      await Login(email, password);
      window.location.reload()
    } catch (error) {
      snack.error("Usuário ou senha inválidos");
    }
    loading.hide();
  };

  const doRegister = async () => {
    try {
      if (validateImage()) return;

      loading.show();
      await Register({email, password, name, avatar});
      window.location.reload()
    } catch (error) {
      snack.error("Erro ao cadastrar usuário");
    }
    loading.hide();
  };

  function encodeImageFileAsURL(element: File) {
    var file = element
    var reader = new FileReader();
    reader.onloadend = function() {
      if(typeof reader.result === 'string')
        setBase64Avatar(reader.result)
    }
    reader.readAsDataURL(file);
  }

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      fullScreen={fullScreen}
      sx={{}}
    >
      <DialogTitle sx={{ textAlign: "center" }}>
        {isLogin ? "Login" : "Registro"}
      </DialogTitle>

      {(isLogin || (!isLogin && registerStep === 1)) && (
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            p: "20px",
            width: "400px",
          }}
        >
          <TextField
            label="Email"
            placeholder="Digite seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={Boolean(errorEmail)}
            helperText={errorEmail}
            onClick={() => setErrorEmail("")}
          />
          {!isLogin && (
            <TextField
              label="Nome"
              placeholder="Digite seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={Boolean(errorName)}
              helperText={errorName}
              sx={{ mt: "10px" }}
              onClick={() => setErrorName("")}
            />
          )}
          <TextField
            label="Senha"
            placeholder="Digite sua senha"
            sx={{ mt: "10px" }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={Boolean(errorPassword)}
            helperText={errorPassword}
            type="password"
            onClick={() => setErrorPassword("")}
          />

          {isLogin ? (
            <Typography sx={{ mt: "5px" }}>
              Não possui conta?{" "}
              <Box
                component="span"
                sx={{
                  color: "#1976d2",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
                onClick={() => setIsLogin(false)}
              >
                Registre-se
              </Box>
            </Typography>
          ) : (
            <Typography sx={{ mt: "5px" }}>
              Não possui conta?{" "}
              <Box
                component="span"
                sx={{
                  color: "#1976d2",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
                onClick={() => setIsLogin(true)}
              >
                Login
              </Box>
            </Typography>
          )}
        </DialogContent>
      )}

      {!isLogin && registerStep === 2 && (
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            p: "20px",
            width: "400px",
            alignItems: "center",
          }}
        >
          <Box
            component="img"
            sx={{
              width: "200px",
              height: "200px",
              borderRadius: "50%",
              "&:hover": {
                opacity: "0.7",
              },
              cursor: "pointer",
            }}
            src={base64Avatar ? base64Avatar : `${baseUrl}/default_avatar.jpg`}
            onClick={() => fileRef.current?.click()}
          />
          <input
            type="file"
            style={{ display: "none" }}
            ref={fileRef}
            accept="image/png, image/jpeg, image/gif"
            onChange={(e) => {
              const file =  e.target.files ? e.target.files[0] : null;
              if (file) {
                encodeImageFileAsURL(file)
                setAvatar(file);
              }
              
            }}
          />
        </DialogContent>
      )}

      <DialogActions sx={{ display: "flex", justifyContent: "space-between" }}>
        <Button
          autoFocus
          onClick={() => {
            if (isLogin) handleClose();
            else {
              if (registerStep === 1) handleClose();
              else setRegisterStep(1);
            }
          }}
        >
          Voltar
        </Button>
        <Button
          onClick={() => {
            if (isLogin) doLogin();
            else {
              if (registerStep === 1 && !validateLogin()) setRegisterStep(2);
              if (registerStep === 2) doRegister();
            }
          }}
          autoFocus
        >
          {isLogin ? "Login" : "Registro"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
