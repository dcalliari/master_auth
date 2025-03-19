import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";
import { AuthenticationDetails, CognitoUser, CognitoUserPool } from "amazon-cognito-identity-js";
import dotenv from "dotenv";
import readline from "readline";

dotenv.config();

const REGION = process.env.AWS_REGION as string;
const CLIENT_ID = process.env.COGNITO_CLIENT_ID as string;
const USER_POOL_ID = process.env.COGNITO_USER_POOL_ID as string;

if (!REGION || !CLIENT_ID || !USER_POOL_ID) {
    console.error("Erro: Variáveis de ambiente não configuradas corretamente.");
    process.exit(1);
}

const client = new CognitoIdentityProviderClient({ region: REGION });

async function authenticateUserWithSRP(email: string, password: string): Promise<void> {
    try {
        const poolData = {
            UserPoolId: USER_POOL_ID,
            ClientId: CLIENT_ID,
        };

        const userPool = new CognitoUserPool(poolData);
        const userData = {
            Username: email,
            Pool: userPool,
        };

        const cognitoUser = new CognitoUser(userData);
        const authenticationDetails = new AuthenticationDetails({
            Username: email,
            Password: password,
        });

        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: (result) => {
                console.log("✅ Login bem-sucedido!");
                console.log("🔑 Access Token:", result.getAccessToken().getJwtToken());
                console.log("🆔 ID Token:", result.getIdToken().getJwtToken());
            },
            onFailure: (err) => {
                console.error("❌ Erro de autenticação:", err.message || JSON.stringify(err));
            },
        });
    } catch (error: any) {
        console.error("❌ Erro ao autenticar:", error.message);
    }
}

async function forgotPassword(email: string): Promise<void> {
    try {
        const poolData = {
            UserPoolId: USER_POOL_ID,
            ClientId: CLIENT_ID,
        };

        const userPool = new CognitoUserPool(poolData);
        const userData = {
            Username: email,
            Pool: userPool,
        };

        const cognitoUser = new CognitoUser(userData);

        cognitoUser.forgotPassword({
            onSuccess: (data) => {
                console.log("✅ Código de redefinição de senha enviado com sucesso!");
                console.log("📧 Verifique seu e-mail para o código de redefinição.");
            },
            onFailure: (err) => {
                console.error("❌ Erro ao solicitar redefinição de senha:", err.message || JSON.stringify(err));
            },
        });
    } catch (error: any) {
        console.error("❌ Erro ao processar a solicitação de redefinição de senha:", error.message);
    }
}

async function resetPassword(email: string, verificationCode: string, newPassword: string): Promise<void> {
    try {
        const poolData = {
            UserPoolId: USER_POOL_ID,
            ClientId: CLIENT_ID,
        };

        const userPool = new CognitoUserPool(poolData);
        const userData = {
            Username: email,
            Pool: userPool,
        };

        const cognitoUser = new CognitoUser(userData);

        cognitoUser.confirmPassword(verificationCode, newPassword, {
            onSuccess: () => {
                console.log("✅ Senha redefinida com sucesso!");
            },
            onFailure: (err) => {
                console.error("❌ Erro ao redefinir a senha:", err.message || JSON.stringify(err));
            },
        });
    } catch (error: any) {
        console.error("❌ Erro ao processar a redefinição de senha:", error.message);
    }
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

rl.question("Escolha uma opção (1: Login, 2: Esqueceu sua senha, 3: Redefinir senha): ", (option) => {
    if (option === "1") {
        rl.question("Digite seu e-mail: ", (email) => {
            rl.question("Digite sua senha: ", (password) => {
                authenticateUserWithSRP(email, password).finally(() => rl.close());
            });
        });
    } else if (option === "2") {
        rl.question("Digite seu e-mail para redefinir a senha: ", (email) => {
            forgotPassword(email).finally(() => rl.close());
        });
    } else if (option === "3") {
        rl.question("Digite seu e-mail: ", (email) => {
            rl.question("Digite o código de verificação recebido no e-mail: ", (verificationCode) => {
                rl.question("Digite sua nova senha: ", (newPassword) => {
                    resetPassword(email, verificationCode, newPassword).finally(() => rl.close());
                });
            });
        });
    } else {
        console.log("Opção inválida.");
        rl.close();
    }
});