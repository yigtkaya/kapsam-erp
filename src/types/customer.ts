export interface Customer {
  id: number;
  code: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  tax_id?: string;
  notes?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
