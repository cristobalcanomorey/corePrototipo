// core/Tokken.ts
import jwt from 'jsonwebtoken';
import type { SignOptions, JwtPayload } from 'jsonwebtoken'
import jwtDecode from 'jwt-decode';

import type { PayloadData } from '@/core/types'

export default class Tokken {
	private static secretKey = 'mi_clave_secreta'; // Usa variables de entorno en producción
	private static algorithm: jwt.Algorithm = 'mi_algoritmo'; // Define el algoritmo de firma

	// Crea el JWT
	public static encode(data: PayloadData, options?: SignOptions): string {
		const payload = {
			data,
			aud: this.getAud(),
		};
		return jwt.sign(payload, this.secretKey, {
			algorithm: this.algorithm,
			...options,
		});
	}

	// Verifica el token y su audiencia
	public static async check(token: string): Promise<void> {
		if (!token) throw new Error('Invalid token supplied.');
		const decoded = jwt.verify(token, this.secretKey, {
			algorithms: [this.algorithm],
		}) as JwtPayload;
		const aud = await this.getAud();
		if (decoded.aud !== aud) {
			throw new Error('Invalid user logged in.');
		}
	}

	// Obtiene el payload completo
	public static getDataToken(token: string): JwtPayload {
		return jwt.verify(token, this.secretKey, {
			algorithms: [this.algorithm],
		}) as JwtPayload;
	}

	// Obtiene solo el campo "data"
	public static getData(token: string): JwtPayload {
		const decoded = jwt.verify(token, this.secretKey, {
			algorithms: [this.algorithm],
		}) as JwtPayload;
		return decoded.data;
	}

	// Genera la firma del cliente (audiencia)
	private static getAud(): Promise<string> {
		const nav = window.navigator;
		const host = window.location.hostname;
		const agent = nav.userAgent || '';
		const aud = `${host}${agent}`;
		return this.sha1(aud);
	}

	// Función de hash sha1
	private static sha1(str: string): Promise<string> {
		const buffer = new TextEncoder().encode(str);
		const hashBuffer = crypto.subtle.digest('SHA-1', buffer);
		return hashBuffer.then((hash) =>
			Array.from(new Uint8Array(hash))
				.map((b) => b.toString(16).padStart(2, '0'))
				.join('')
		);
	}
}
