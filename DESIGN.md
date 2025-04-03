# Design Guidelines for Kapsam ERP Frontend

This document outlines the design guidelines and UI standards for the Kapsam ERP Frontend project.

## UI Components

### Buttons

Button components are used throughout the application for various actions. We use a consistent styling approach to ensure clarity and hierarchy of actions.

#### Button Variants

| Variant        | Purpose           | Styling                                      | Example Use Cases                 |
| -------------- | ----------------- | -------------------------------------------- | --------------------------------- |
| `primary-blue` | Primary actions   | Dark blue background (`#0A215C`), white text | Create, Save, Add New, Submit     |
| `default`      | Standard actions  | Based on primary theme color                 | Regular actions, Proceed          |
| `secondary`    | Secondary actions | Light background, darker text                | View, Filter, Sort                |
| `destructive`  | Harmful actions   | Red background, white text                   | Delete, Remove, Cancel            |
| `outline`      | Subtle actions    | Transparent with border                      | Cancel, Back, Alternative options |
| `ghost`        | Minimal emphasis  | No background until hover                    | Less important actions            |
| `link`         | Navigation links  | Text only with underline on hover            | Navigation, "Learn more"          |

```tsx
// Primary action button example
<Button variant="primary-blue">
  <Plus className="h-4 w-4" />
  Add New Item
</Button>

// Secondary action button example
<Button variant="secondary">
  Filter Results
</Button>

// Destructive action button example
<Button variant="destructive">
  Delete Item
</Button>
```

#### Button Sizes

| Size      | Height    | Padding   | Use Case                                     |
| --------- | --------- | --------- | -------------------------------------------- |
| `default` | h-10      | px-4 py-2 | General use throughout the app               |
| `sm`      | h-9       | px-3      | Compact UI areas, inline with other elements |
| `lg`      | h-11      | px-8      | Important actions, call to action            |
| `icon`    | h-10 w-10 | -         | Icon-only buttons                            |

```tsx
// Default size (standard usage)
<Button variant="primary-blue">Save Changes</Button>

// Small size
<Button variant="secondary" size="sm">View Details</Button>

// Large size
<Button variant="primary-blue" size="lg">Create Order</Button>

// Icon button
<Button variant="outline" size="icon">
  <Edit className="h-4 w-4" />
</Button>
```

### Tables and Data Display

Tables should have a clear visual hierarchy to improve readability and user experience.

#### Table Headers

- Use a medium gray background (`bg-gray-100`) for the header row to visually separate it from the data
- Add a subtle border (`border-b border-gray-200`) to clearly define the header section
- Apply `font-semibold` to all header text for better visual distinction
- Use `text-gray-800` for header text to increase contrast and readability
- Add padding (`py-3`) to give the headers more presence
- Center-align headers when the content is also centered

```tsx
<TableHeader className="bg-gray-100">
  {table.getHeaderGroups().map((headerGroup) => (
    <TableRow key={headerGroup.id} className="border-b border-gray-200">
      {headerGroup.headers.map((header) => (
        <TableHead
          key={header.id}
          className="font-semibold text-gray-800 bg-gray-100 py-3"
        >
          {header.isPlaceholder
            ? null
            : flexRender(header.column.columnDef.header, header.getContext())}
        </TableHead>
      ))}
    </TableRow>
  ))}
</TableHeader>
```

#### Smooth UI Transitions

To prevent UI jitter when users interact with tables:

1. **Use client-side sorting and filtering**:
   - Apply transitions to table elements with appropriate duration values:
   ```tsx
   // Apply these classes to table elements
   "transition-all duration-200 ease-in-out";
   ```
2. **Maintain local state separate from URL state**:

   - Implement local state that updates immediately on user interaction
   - Use debounced URL updates to maintain shareable links

   ```tsx
   // Page component
   const [localQuery, setLocalQuery] = useState(searchParams.get("q") || "");

   const handleSearchChange = (value: string) => {
     // Update local state immediately for smooth UI
     setLocalQuery(value);

     // Debounce URL update
     startTransition(() => {
       router.push(`${pathname}?${createQueryString({ q: value })}`);
     });
   };
   ```

3. **Apply consistent dimensions**:

   - Set explicit height for loading placeholders to match actual data
   - Use fixed column widths where possible to prevent layout shifts

4. **Add loading indicators**:
   - Use skeleton loaders that match the dimensions of the actual content
   - Apply subtle animations to loading states

#### Sortable Table Headers

All data tables should use sortable column headers instead of separate sort dropdowns:

- Use a ghost button as the header to make it interactive with proper hover states
- Include sort direction indicators (up/down arrows) to show the current sort state
- Show the default `ArrowUpDown` icon with reduced opacity to indicate sortable columns
- Implement client-side sorting when working with local data
- For server-side data, pass the sort information to the API

```tsx
// Column definition with sortable header
{
  accessorKey: "product_name",
  header: ({ column }) => {
    return (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="w-full font-semibold text-gray-800"
      >
        Product Name
        {column.getIsSorted() === "asc" ? (
          <ArrowUp className="ml-2 h-4 w-4" />
        ) : column.getIsSorted() === "desc" ? (
          <ArrowDown className="ml-2 h-4 w-4" />
        ) : (
          <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
        )}
      </Button>
    );
  },
  cell: ({ row }) => (
    <div className="text-center">{row.original.product_name}</div>
  ),
}
```

#### DataTable Configuration

When using the DataTable component, enable sorting in the React Table instance:

```tsx
const [sorting, setSorting] = useState<SortingState>([]);

const table = useReactTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(), // Enable client-side sorting
  state: {
    sorting, // Controlled sorting state
  },
  onSortingChange: setSorting, // Update sorting state
});
```

#### Column Definitions

When defining table columns, maintain consistent styling:

```tsx
{
  accessorKey: "product_name",
  header: () => (
    <div className="text-center font-semibold text-gray-800">
      Product Name
    </div>
  ),
  cell: ({ row }) => (
    <div className="text-center">
      {row.original.product_name}
    </div>
  ),
}
```

#### Page Headers

For page headers, follow these standards:

- Use `text-gray-800` for the main heading text to ensure proper contrast
- Apply `text-gray-600` for description text to maintain hierarchy while ensuring readability
- Keep `font-semibold` for the main title to highlight its importance

### Form Layout Standards

When designing forms:

1. Place all filters in a single row when possible, using flex-wrap to handle smaller screens
2. Maintain consistent spacing (gap-4) between filter elements
3. Use appropriate widths for inputs and selects to maintain visual hierarchy
4. For responsive designs, use `flex-wrap` to stack elements on smaller screens

```tsx
<div className="flex flex-wrap items-center gap-4">
  <Input
    placeholder="Search..."
    className="max-w-sm"
  />
  <Select>
    <SelectTrigger className="max-w-[200px]">
      <SelectValue placeholder="Status" />
    </SelectTrigger>
    <SelectContent>
      <!-- Options here -->
    </SelectContent>
  </Select>
  <!-- Additional filters -->
</div>
```

## General UI Principles

1. **Consistency**: Maintain consistent spacing, typography, and color usage
2. **Hierarchy**: Establish clear visual hierarchy with appropriate sizing and color contrast
3. **Feedback**: Provide clear feedback for user actions through visual cues
4. **Accessibility**: Ensure all UI elements are accessible with appropriate contrast and keyboard navigation
5. **Responsive Design**: Design for various screen sizes with responsive layouts

## Color Usage

- Dark blue (`#0A215C`) - Primary action buttons, primary emphasis elements
- Grayscale - UI structure, typography, borders
  - `text-gray-800` - Headers, important text
  - `text-gray-600` - Secondary text, descriptions
  - `bg-gray-100` - Table header backgrounds
  - `border-gray-200` - Table borders and dividers
- Accent colors - Used sparingly for visual interest or status indication
- Status colors:
  - Green: Success, active, positive status
  - Red: Error, destructive, negative status
  - Yellow: Warning, pending, in progress
  - Blue: Information, neutral status
