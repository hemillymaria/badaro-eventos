import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from "../../../../database/config";
import UserDB from "@/database/wrappers/user";
const { admin } = require('../../../../database/admin');
const authAdmin = admin.auth();

interface Credentials {
	email: string;
	password: string;
}

interface FirebaseUser {
	uid: string;
	displayName: string | null;
	email: string | null;
	photoURL: string | null;
}

function convertFirebaseUserToNextAuthUser(firebaseUser: FirebaseUser) {
	const nextAuthUser = {
		id: firebaseUser.uid,
		name: firebaseUser.displayName,
		email: firebaseUser.email,
		photoURL: firebaseUser.photoURL
	};
	return nextAuthUser;
}

const handler = NextAuth({
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: { label: "email", type: "text" },
				password: { label: "password", type: "password" },
			},
			async authorize(credentials, req) {
				console.log(credentials, ' credenciais aqui')
				const { email, password } = credentials as Credentials
				console.log(email, ' TA AQAUI')
				try {
					const { user } = await signInWithEmailAndPassword(auth, email, password);
					if (!user) return null;
					const nextAuthUser = convertFirebaseUserToNextAuthUser(user);
					return nextAuthUser;
				} catch (error) {
					console.error(error);
					return null;
				}
			}
		})
	],
	session: {
		secret: 'segredo4321', //process.env.NEXTAUTH_SECRET,
		jwt: true,
    maxAge: 30 * 24 * 60 * 60, 
  },


	callbacks: {
		async signIn({ user, account, profile }: any) {
			try {
				// Verificar se o usuário já existe no Firebase Authentication
				console.log('CAI AQUI')
				const userRecord = await authAdmin.getUserByEmail(user.email);
				if (userRecord) {
					// console.log('Usuário já existe no Firebase Authentication');
					return true;
				} else {
					return false;
				}
			} catch (error) {
				console.error('Ocorreu um erro ao verificar ou criar a conta:', error);
				return false;
			}
		},
		async session({ session, token, user }: any) {
			session.token = token;

			return session
		},
		async jwt({ token, user, profile, account }: any) {
			if (user) {
				try {
					const userDoc = await new UserDB().get(user.id);

					if (userDoc) {
						token.user = userDoc;
						user = userDoc;
					}
				} catch (error) {
					console.error('Erro ao obter os dados do usuário do Firestore:', error);
				}
				token = { ...token, ...user }
			}
			return token
		},

	},
	pages: {
		signIn: "/login",
		error: "/",
		// error: "/auth-pages/sign-up",
	},

})
export const authOptions = {

}


export { handler as GET, handler as POST }
