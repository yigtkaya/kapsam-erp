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
  role: z.enum(["ADMIN", "ENGINEER", "OPERATOR", "VIEWER"]),
  is_active: z.boolean(),
  profile: z.object({
    employee_id: z.string().min(1, { message: "Çalışan ID gerekli" }),
    phone_number: z.string().min(1, { message: "Telefon numarası gerekli" }),
  }),
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
      username: "",
      role: "VIEWER",
      is_active: true,
      profile: {
        employee_id: "",
        phone_number: "",
      },
    },
  });

  useEffect(() => {
    if (currentUser) {
      form.reset({
        username: currentUser.username,
        role: currentUser.role,
        is_active: currentUser.is_active,
        profile: currentUser.profile
          ? {
              employee_id: currentUser.profile.employee_id,
              phone_number: currentUser.profile.phone_number,
            }
          : undefined,
      });
    }
  }, [currentUser, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await updateUser.mutateAsync({
        id: currentUser?.id,
        username: values.username,
        role: values.role,
        is_active: values.is_active,
        profile: {
          employee_id: values.profile.employee_id,
          phone_number: values.profile.phone_number,
        },
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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

            <div>
              <fieldset className="border rounded p-4 space-y-4">
                <legend className="px-2 text-sm font-semibold">
                  Profil Bilgileri
                </legend>

                <FormField
                  control={form.control}
                  name="profile.employee_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Çalışan ID</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="profile.phone_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefon Numarası</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </fieldset>
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
