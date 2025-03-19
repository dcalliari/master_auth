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

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

rl.question("Digite seu e-mail: ", (email) => {
    rl.question("Digite sua senha: ", (password) => {
        authenticateUserWithSRP(email, password).finally(() => rl.close());
    });
});