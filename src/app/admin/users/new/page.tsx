"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useCreateUser } from "@/hooks/useUsers";
import { toast } from "sonner";
import { User, UserRole } from "@/types/user";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "İsim en az 2 karakter olmalıdır.",
  }),
  email: z.string().email({
    message: "Geçerli bir e-posta adresi giriniz.",
  }),
  role: z.enum(["ADMIN", "ENGINEER", "OPERATOR", "VIEWER"]),
});

export default function NewUserPage() {
  const router = useRouter();
  const createUser = useCreateUser();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      role: "VIEWER",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await createUser.mutateAsync({
        ...values,
        id: "temp-" + Date.now(),
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as User);
      toast.success("Kullanıcı başarıyla oluşturuldu");
      router.push("/admin/users");
    } catch (error) {
      toast.error("Kullanıcı oluşturulurken bir hata oluştu");
      console.error(error);
    }
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Yeni Kullanıcı</h2>
      </div>

      <div className="grid gap-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>İsim</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-posta</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rol</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Rol seçin" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                      <SelectItem value="ENGINEER">Mühendis</SelectItem>
                      <SelectItem value="OPERATOR">Operatör</SelectItem>
                      <SelectItem value="VIEWER">İzleyici</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Kullanıcının sistem içindeki rolü
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={createUser.isPending}>
              {createUser.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Oluştur
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
