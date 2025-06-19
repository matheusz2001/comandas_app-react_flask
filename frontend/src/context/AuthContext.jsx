import React, { createContext, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loginLocal, loginFuncionario } from "../services/funcionarioService";

// Criação do contexto
const AuthContext = createContext();

// Provedor do contexto
export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(() =>
        sessionStorage.getItem("loginRealizado") === "true"
    );

    // useNavigate é um hook do React Router que permite programaticamente navegar entre rotas
    const navigate = useNavigate();

    const grupoMap = {
        "1": "Administrador",
        "2": "Atendente de Balcão",
        "3": "Atendente de Caixão"
    };


    // Função para login
    const login = async (username, password) => {
        try {
            let data;

            if (username.startsWith("@")) {
                data = await loginLocal(username, password);
                console.log("Resposta login local:", data);

                sessionStorage.setItem("nome", "Usuário Local");

                const grupoNome = grupoMap[data.grupo] || "Administrador";
                sessionStorage.setItem("grupo", grupoNome);

                toast.success(`Login local realizado com sucesso!`);

            } else {
                data = await loginFuncionario(username, password);
                console.log("Resposta login externo:", data);

                sessionStorage.setItem("nome", data.nome || "Usuário");
                const grupoNome = grupoMap[data.grupo] || "Grupo desconhecido";
                sessionStorage.setItem("grupo", grupoNome);
                console.log(data.nome, data.grupo);
                toast.success(`Login API realizado com sucesso!`);
            }

            setIsAuthenticated(true);
            sessionStorage.setItem("loginRealizado", "true");
            navigate("/home");
        } catch (err) {
            toast.error(err.response?.data?.error || "Usuário ou senha inválidos!");
        }
    };

    // Função para logout
    const logout = () => {
        setIsAuthenticated(false);
        sessionStorage.removeItem("loginRealizado");
        toast.info("Logout realizado com sucesso!");
        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook para usar o contexto
export const useAuth = () => useContext(AuthContext);