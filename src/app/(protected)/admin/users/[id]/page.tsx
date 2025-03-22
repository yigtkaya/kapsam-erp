"use client";

import { useUpdateUser, useUser } from "@/hooks/useUsers";
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
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { User } from "@/types/user";
import { toast } from "sonner";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "İsim en az 2 karakter olmalıdır.",
  }),
  email: z.string().email({
    message: "Geçerli bir e-posta adresi giriniz.",
  }),
  role: z.enum(["ADMIN", "ENGINEER", "OPERATOR", "VIEWER"]),
  is_active: z.boolean(),
});

export default function EditUserPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const { data: currentUser, isLoading, error } = useUser(userId);
  const updateUser = useUpdateUser();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: currentUser?.username || "",
      email: currentUser?.email || "",
      role: currentUser?.role || "VIEWER",
      is_active: currentUser?.is_active ?? true,
    },
  });

  useEffect(() => {
    if (currentUser) {
      form.reset({
        username: currentUser.username,
        email: currentUser.email,
        role: currentUser.role,
        is_active: currentUser.is_active,
      });
    }
  }, [currentUser, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await updateUser.mutateAsync({
        id: userId,
        username: values.username,
        email: values.email,
        role: values.role,
        is_active: values.is_active,
      } as User);

      toast.success("Kullanıcı başarıyla güncellendi");
      router.push("/admin/users");
    } catch (error) {
      console.error("Failed to update user:", error);
      toast.error("Kullanıcı güncellenirken bir hata oluştu");
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !currentUser) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Kullanıcı bulunamadı</p>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Kullanıcı Düzenle</h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 gap-8">
            <div className="space-y-6">
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
                      <Input {...field} />
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

              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Aktif</FormLabel>
                      <FormDescription>
                        Kullanıcının hesabının aktif olup olmadığı
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="mt-8">
            <Button type="submit" disabled={updateUser.isPending}>
              {updateUser.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Kaydet
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
