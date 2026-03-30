import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { orpc } from "@/lib/orpc";
import type { CreateUserFormOutput } from "./schema";

export function useOnSubmit({ redirect }: { redirect: string }) {
  const router = useRouter();

  return async ({ value }: { value: CreateUserFormOutput }) => {
    try {
      toast("Creando usuario...");
      await orpc.user.create(value);
      toast("Usuario creado, redirigiendo...");
      router.push(redirect);
    } catch {
      toast("Error al crear el usuario");
    }
  };
}
