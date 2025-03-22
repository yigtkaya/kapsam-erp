"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import {
  Calendar as CalendarIcon,
  Loader2,
  Check,
  ChevronsUpDown,
  Clock,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

import { useUsers } from "@/hooks/useUsers";
import { useMachines } from "@/hooks/useManufacturing";
import { useProducts } from "@/hooks/useProducts";
import { User } from "@/types/user";
import { Machine } from "@/types/manufacture";

// Define the form schema with Zod
const formSchema = z.object({
  date: z.date({
    required_error: "Tarih seçiniz",
  }),
  shift: z.string({
    required_error: "Vardiya seçiniz",
  }),
  chiefId: z.string({
    required_error: "Vardiya şefi seçiniz",
  }),
  machineId: z.string({
    required_error: "Makine seçiniz",
  }),
  productId: z.string({
    required_error: "Ürün seçiniz",
  }),
  operationNo: z.string({
    required_error: "Operasyon numarası giriniz",
  }),
  operatorId: z.string({
    required_error: "Operatör seçiniz",
  }),
  machineTime: z.coerce
    .number({
      required_error: "Makine süresi giriniz",
      invalid_type_error: "Geçerli bir sayı giriniz",
    })
    .min(0, "Süre negatif olamaz"),
  settingTime: z.coerce
    .number({
      required_error: "Ayar süresi giriniz",
      invalid_type_error: "Geçerli bir sayı giriniz",
    })
    .min(0, "Süre negatif olamaz"),
  lostTime: z.coerce
    .number({
      required_error: "Kayıp süre giriniz",
      invalid_type_error: "Geçerli bir sayı giriniz",
    })
    .min(0, "Süre negatif olamaz"),
  bindingProductCount: z.coerce
    .number({
      required_error: "Bağlayıcı ürün sayısı giriniz",
      invalid_type_error: "Geçerli bir sayı giriniz",
    })
    .min(0, "Sayı negatif olamaz"),
  solidProductCount: z.coerce
    .number({
      required_error: "Katı ürün sayısı giriniz",
      invalid_type_error: "Geçerli bir sayı giriniz",
    })
    .min(0, "Sayı negatif olamaz"),
  plannedQuantity: z.coerce
    .number({
      required_error: "Planlanan miktar giriniz",
      invalid_type_error: "Geçerli bir sayı giriniz",
    })
    .positive("Miktar pozitif olmalıdır"),
  actualQuantity: z.coerce
    .number({
      required_error: "Gerçekleşen miktar giriniz",
      invalid_type_error: "Geçerli bir sayı giriniz",
    })
    .positive("Miktar pozitif olmalıdır"),
  scrapQuantity: z.coerce
    .number({
      required_error: "Fire miktarı giriniz",
      invalid_type_error: "Geçerli bir sayı giriniz",
    })
    .min(0, "Fire miktarı negatif olamaz"),
  qualityIssues: z.string().optional(),
  abnormalSituations: z.string().optional(),
  workplaceSafetyInfo: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

// Mock data for dropdowns
const SHIFTS = [
  { id: "GUNDUZ", name: "GÜNDÜZ" },
  { id: "GECE", name: "GECE" },
];

export default function DailyProductionReportPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openChief, setOpenChief] = useState(false);
  const [openMachine, setOpenMachine] = useState(false);
  const [openProduct, setOpenProduct] = useState(false);
  const [openOperator, setOpenOperator] = useState(false);
  const [openShift, setOpenShift] = useState(false);
  const [openDate, setOpenDate] = useState(false);

  // Fetch data using hooks
  const { data: users = [], isLoading: isLoadingUsers } = useUsers();
  const { data: machines = [], isLoading: isLoadingMachines } = useMachines();
  const { data: products = [], isLoading: isLoadingProducts } = useProducts();

  // Initialize the form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
      shift: "",
      chiefId: "",
      machineId: "",
      productId: "",
      operationNo: "",
      operatorId: "",
      machineTime: 0,
      settingTime: 0,
      lostTime: 0,
      bindingProductCount: 0,
      solidProductCount: 0,
      plannedQuantity: 0,
      actualQuantity: 0,
      scrapQuantity: 0,
      qualityIssues: "",
      abnormalSituations: "",
      workplaceSafetyInfo: "",
    },
  });

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);

    try {
      // In a real application, you would send this data to your API
      console.log("Form data:", data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Üretim raporu başarıyla kaydedildi");

      // Reset form
      form.reset({
        date: new Date(),
        shift: "",
        chiefId: "",
        machineId: "",
        productId: "",
        operationNo: "",
        operatorId: "",
        machineTime: 0,
        settingTime: 0,
        lostTime: 0,
        bindingProductCount: 0,
        solidProductCount: 0,
        plannedQuantity: 0,
        actualQuantity: 0,
        scrapQuantity: 0,
        qualityIssues: "",
        abnormalSituations: "",
        workplaceSafetyInfo: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Rapor kaydedilirken bir hata oluştu");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      <PageHeader
        title="Günlük Üretim Raporu"
        description="Günlük üretim verilerini girin"
        showBackButton
        onBack={() => router.push("/production")}
      />

      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">
            Günlük Üretim Raporu
          </CardTitle>
          <div className="flex items-center space-x-2">
            <div className="text-sm text-muted-foreground">Tarih:</div>
            <div className="font-medium">
              {format(new Date(), "dd.MM.yy", { locale: tr })}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  {/* Date Field - Improved */}
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col mb-4">
                        <FormLabel>Tarih</FormLabel>
                        <div className="grid gap-2">
                          <Button
                            id="date"
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                            onClick={() => setOpenDate(true)}
                            type="button"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, "dd.MM.yy", { locale: tr })
                            ) : (
                              <span>Tarih seçiniz</span>
                            )}
                          </Button>
                          <Popover open={openDate} onOpenChange={setOpenDate}>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={(date) => {
                                  field.onChange(date);
                                  setOpenDate(false);
                                }}
                                disabled={(date) =>
                                  date > new Date() ||
                                  date < new Date("1900-01-01")
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Shift Field - Improved with Command */}
                  <FormField
                    control={form.control}
                    name="shift"
                    render={({ field }) => (
                      <FormItem className="flex flex-col mb-4">
                        <FormLabel>Vardiya</FormLabel>
                        <Popover open={openShift} onOpenChange={setOpenShift}>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={openShift}
                                className="w-full justify-between"
                              >
                                {field.value
                                  ? SHIFTS.find(
                                      (shift) => shift.id === field.value
                                    )?.name || "Vardiya seçiniz"
                                  : "Vardiya seçiniz"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0">
                            <Command>
                              <CommandInput placeholder="Vardiya ara..." />
                              <CommandList>
                                <CommandEmpty>Vardiya bulunamadı.</CommandEmpty>
                                <CommandGroup>
                                  {SHIFTS.map((shift) => (
                                    <CommandItem
                                      key={shift.id}
                                      value={shift.id}
                                      onSelect={() => {
                                        form.setValue("shift", shift.id);
                                        setOpenShift(false);
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          field.value === shift.id
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      {shift.name}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div>
                  {/* Chief Selection Field - With CommandList */}
                  <FormField
                    control={form.control}
                    name="chiefId"
                    render={({ field }) => (
                      <FormItem className="flex flex-col mb-4">
                        <FormLabel>Üretim Şefi</FormLabel>
                        <Popover open={openChief} onOpenChange={setOpenChief}>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={openChief}
                                className="w-full justify-between"
                                disabled={isLoadingUsers}
                              >
                                {field.value
                                  ? users.find(
                                      (user) => user.id === field.value
                                    )?.username || "Şef seçiniz"
                                  : "Şef seçiniz"}
                                {isLoadingUsers ? (
                                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                                ) : (
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                )}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0">
                            <Command>
                              <CommandInput placeholder="Şef ara..." />
                              <CommandList>
                                <CommandEmpty>Şef bulunamadı.</CommandEmpty>
                                <CommandGroup>
                                  {users.map((user) => (
                                    <CommandItem
                                      key={user.id}
                                      value={user.id}
                                      onSelect={() => {
                                        form.setValue("chiefId", user.id);
                                        setOpenChief(false);
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          field.value === user.id
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      {user.username}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="border rounded-md p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                  {/* Machine Selection Field - With CommandList */}
                  <FormField
                    control={form.control}
                    name="machineId"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Makine</FormLabel>
                        <Popover
                          open={openMachine}
                          onOpenChange={setOpenMachine}
                        >
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={openMachine}
                                className="w-full justify-between"
                                disabled={isLoadingMachines}
                              >
                                {field.value
                                  ? machines.find(
                                      (machine) =>
                                        machine.id.toString() === field.value
                                    )?.machine_code || "Makine seçiniz"
                                  : "Makine seçiniz"}
                                {isLoadingMachines ? (
                                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                                ) : (
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                )}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0">
                            <Command>
                              <CommandInput placeholder="Makine ara..." />
                              <CommandList>
                                <CommandEmpty>Makine bulunamadı.</CommandEmpty>
                                <CommandGroup>
                                  {machines.map((machine) => (
                                    <CommandItem
                                      key={machine.id}
                                      value={machine.id.toString()}
                                      onSelect={() => {
                                        form.setValue(
                                          "machineId",
                                          machine.id.toString()
                                        );
                                        setOpenMachine(false);
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          field.value === machine.id.toString()
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      {machine.machine_code} -{" "}
                                      {machine.machine_type}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Product Selection Field - With CommandList */}
                  <FormField
                    control={form.control}
                    name="productId"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Ürün</FormLabel>
                        <Popover
                          open={openProduct}
                          onOpenChange={setOpenProduct}
                        >
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={openProduct}
                                className="w-full justify-between"
                                disabled={isLoadingProducts}
                              >
                                {field.value
                                  ? products.find(
                                      (product) =>
                                        product.id.toString() === field.value
                                    )?.product_name || "Ürün seçiniz"
                                  : "Ürün seçiniz"}
                                {isLoadingProducts ? (
                                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                                ) : (
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                )}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0">
                            <Command>
                              <CommandInput placeholder="Ürün ara..." />
                              <CommandList>
                                <CommandEmpty>Ürün bulunamadı.</CommandEmpty>
                                <CommandGroup>
                                  {products.map((product) => (
                                    <CommandItem
                                      key={product.id}
                                      value={product.id.toString()}
                                      onSelect={() => {
                                        form.setValue(
                                          "productId",
                                          product.id.toString()
                                        );
                                        setOpenProduct(false);
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          field.value === product.id.toString()
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      {product.product_code} -{" "}
                                      {product.product_name}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Operation No Field */}
                  <FormField
                    control={form.control}
                    name="operationNo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Op. No</FormLabel>
                        <FormControl>
                          <Input placeholder="Operasyon numarası" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Operator Selection Field - With CommandList */}
                  <FormField
                    control={form.control}
                    name="operatorId"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Operatör</FormLabel>
                        <Popover
                          open={openOperator}
                          onOpenChange={setOpenOperator}
                        >
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={openOperator}
                                className="w-full justify-between"
                                disabled={isLoadingUsers}
                              >
                                {field.value
                                  ? users.find(
                                      (user) => user.id === field.value
                                    )?.username || "Operatör seçiniz"
                                  : "Operatör seçiniz"}
                                {isLoadingUsers ? (
                                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                                ) : (
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                )}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0">
                            <Command>
                              <CommandInput placeholder="Operatör ara..." />
                              <CommandList>
                                <CommandEmpty>
                                  Operatör bulunamadı.
                                </CommandEmpty>
                                <CommandGroup>
                                  {users.map((user) => (
                                    <CommandItem
                                      key={user.id}
                                      value={user.id}
                                      onSelect={() => {
                                        form.setValue("operatorId", user.id);
                                        setOpenOperator(false);
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          field.value === user.id
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      {user.username}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Machine Time Field */}
                  <FormField
                    control={form.control}
                    name="machineTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Makine Zamanı (sn)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e.target.valueAsNumber);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Setting Time Field */}
                  <FormField
                    control={form.control}
                    name="settingTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ayar Zamanı (sn)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e.target.valueAsNumber);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Planned Quantity Field */}
                <FormField
                  control={form.control}
                  name="plannedQuantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Planlanan Miktar</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e.target.valueAsNumber);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Actual Quantity Field */}
                <FormField
                  control={form.control}
                  name="actualQuantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gerçekleşen Miktar</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e.target.valueAsNumber);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Scrap Quantity Field */}
                <FormField
                  control={form.control}
                  name="scrapQuantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fire Miktarı</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e.target.valueAsNumber);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Quality Issues Field */}
              <FormField
                control={form.control}
                name="qualityIssues"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kalite problemleri:</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Kalite ile ilgili problemleri buraya giriniz..."
                        className="resize-none h-20"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Abnormal Situations Field */}
              <FormField
                control={form.control}
                name="abnormalSituations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Anormal durumlar:</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Anormal durumları buraya giriniz..."
                        className="resize-none h-20"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Workplace Safety Info Field */}
              <FormField
                control={form.control}
                name="workplaceSafetyInfo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      İSG bilgisi (iş kazası, ramak kala vb.):
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="İş sağlığı ve güvenliği ile ilgili bilgileri buraya giriniz..."
                        className="resize-none h-20"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Form Actions */}
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/production")}
                  disabled={isSubmitting}
                >
                  İptal
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Raporu Kaydet
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
