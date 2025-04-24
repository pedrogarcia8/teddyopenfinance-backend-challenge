import * as jwt from 'jsonwebtoken';

export default function JwtTokenGenerator(email: string): string {
  const secretKey = process.env.JWT_SECRET as string;
  const token = jwt.sign({ email }, secretKey, { expiresIn: '1h' });
  return token;
}
