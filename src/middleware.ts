export default function middleware(req: Request, res: Response, next: () => void) {
  console.log('Middleware executed');
  
} 