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
import { User } from "@/types/user";

const formSchema = z
  .object({
    username: z.string().min(2, {
      message: "İsim en az 2 karakter olmalıdır.",
    }),
    email: z.string().email({
      message: "Geçerli bir e-posta adresi giriniz.",
    }),
    password: z.string().min(8, {
      message: "Şifre en az 8 karakter olmalıdır.",
    }),
    confirm_password: z.string().min(8, {
      message: "Şifre doğrulaması en az 8 karakter olmalıdır.",
    }),
    role: z.enum(["ADMIN", "ENGINEER", "OPERATOR", "VIEWER"]),
    is_active: z.boolean(),
    profile: z.object({
      employee_id: z.string().min(1, { message: "Çalışan ID gerekli" }),
      phone_number: z.string().min(1, { message: "Telefon numarası gerekli" }),
    }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Şifreler eşleşmiyor.",
    path: ["confirm_password"],
  });

export default function NewUserPage() {
  const router = useRouter();
  const createUser = useCreateUser();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirm_password: "",
      role: "VIEWER",
      is_active: true,
      profile: {
        employee_id: "",
        phone_number: "",
      },
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const payload = {
        ...values,
        id: "temp-" + Date.now(),
        is_active: values.is_active,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      await createUser.mutateAsync(payload as unknown as User);
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

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: User Details */}
            <div className="space-y-6">
              {/* Username Field */}
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

              {/* Email Field */}
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

              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Şifre</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Confirm Password Field */}
              <FormField
                control={form.control}
                name="confirm_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Şifre Doğrulama</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Role Field */}
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

              {/* isActive Field */}
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
                      <Input
                        type="checkbox"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        className="w-4 h-4"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Right Column: Profile Details */}
            <div>
              <fieldset className="border rounded p-4 space-y-4">
                <legend className="px-2 text-sm font-semibold">
                  Profil Bilgileri
                </legend>

                {/* Employee ID Field */}
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

                {/* Phone Number Field */}
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
            <Button type="submit" disabled={createUser.isPending}>
              {createUser.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Oluştur
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
