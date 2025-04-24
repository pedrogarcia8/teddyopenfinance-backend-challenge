import * as jwt from 'jsonwebtoken';

export default function JwtTokenGenerator(email: string, id: string): string {
  const secretKey = process.env.JWT_SECRET as string;
  const token = jwt.sign({ email, id }, secretKey, { expiresIn: '1h' });
  return token;
}
