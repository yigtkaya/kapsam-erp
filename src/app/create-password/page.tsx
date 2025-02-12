import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createPassword } from "./action";
import router from "next/router";
import { toast } from "sonner";

interface CreatePasswordPageProps {
  params: {
    uid: string;
    token: string;
  };
}

export default function CreatePasswordPage({
  params,
}: CreatePasswordPageProps) {
  const formSchema = z.object({
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  });
  // create zod form with password and confirm password
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const response = await createPassword(
      params.uid,
      params.token,
      data.password
    );
    if (response.success) {
      toast.success("Şifre başarıyla oluşturuldu");
      router.push("/login");
    }

    if (response.error) {
      toast.error(response.error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Şifre</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}
