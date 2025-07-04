import React from "react";
import { Box, Typography, Toolbar } from "@mui/material";
import '../styles/Home.css'
const nomeLogado = sessionStorage.getItem("nome");
  const grupoLogado = sessionStorage.getItem("grupo");

const Home = () => {
    return (
        <Box className="Home-Box" sx={{ backgroundColor: 'white', padding: 1, borderRadius: 3, mt: 2 }}>

            <Toolbar sx={{ backgroundColor: '#E0E0E0', padding: 1, borderRadius: 2, mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" color="black">Home</Typography>
            </Toolbar>

            <Box sx={{ backgroundColor: '#E0E0E0', padding: 2, borderRadius: 3, mb: 2 }}>

                <Typography variant="body1" color="textPrimary">
                    Bem-vindo ao aplicativo Comandas!
                </Typography>

                <Typography variant="body1" color="textSecondary">
                    Explore as funcionalidades e aproveite sua experiência.
                </Typography>

                <Typography variant="body1" color="textSecondary" sx={{ mt: 2 }}>
                    Usuário logado: <strong>{nomeLogado || "Desconhecido"}</strong>
                </Typography>

                <Typography variant="body1" color="textSecondary">
                    Grupo: <strong>{grupoLogado || "Não informado"}</strong>
                </Typography>

                <Typography variant="body1" color="textDisabled">
                    {`Data atual: ${new Date().toLocaleDateString()}`}
                </Typography>
            </Box>

        </Box>
    );
};

export default Home;