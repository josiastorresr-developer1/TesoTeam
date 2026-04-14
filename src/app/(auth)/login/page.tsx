import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm space-y-6 p-8 bg-white rounded-2xl shadow-sm border">
        <div className="text-center space-y-1">
          <div className="flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-white font-bold text-xl">
              R
            </div>
          </div>
          <h1 className="text-xl font-semibold">RickyRiñón</h1>
          <p className="text-sm text-muted-foreground">Ingresa a tu cuenta</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
