# Field Configuration Structure - Summary

## Overview
All form field definitions have been refactored into separate `fields.ts` files to eliminate duplication between add and edit pages.

## Folder Structure

```
src/app/
├── residential/
│   ├── fields.ts          ← Field definitions shared by add & edit
│   ├── add-new/
│   │   └── page.tsx       ← Imports from fields.ts
│   └── edit-residential/
│       └── page.tsx       ← Imports from fields.ts
│
├── employee/
│   ├── fields.ts
│   ├── add-employee/
│   │   └── page.tsx
│   └── edit-employee/
│       └── page.tsx
│
├── bank-account/
│   ├── fields.ts
│   ├── add-bank/
│   │   └── page.tsx
│   └── edit-bank/
│       └── page.tsx
│
├── vehicle/
│   ├── fields.ts
│   ├── add-vehicle/
│   │   └── page.tsx
│   └── edit-vehicle/
│       └── page.tsx
│
├── visitors/
│   ├── fields.ts
│   ├── add-visitor/
│   │   └── page.tsx
│   └── edit-visitor/
│       └── page.tsx
│
├── zone/
│   ├── fields.ts
│   ├── add-zone/
│   │   └── page.tsx
│   └── edit-zone/
│       └── page.tsx
│
├── phase/
│   ├── fields.ts
│   ├── add-phase/
│   │   └── page.tsx
│   └── edit-phase/
│       └── page.tsx
│
├── package-type/
│   ├── fields.ts
│   ├── add-package/
│   │   └── page.tsx
│   └── edit-package/
│       └── page.tsx
│
├── cp-agent/
│   ├── fields.ts
│   ├── add-cp/
│   │   └── page.tsx
│   └── edit-cp/
│       └── page.tsx
│
├── vendor-supplier/
│   ├── fields.ts
│   ├── add-vendor/
│   │   └── page.tsx
│   └── edit-vendor/
│       └── page.tsx
│
├── workers/
│   ├── fields.ts
│   ├── add-worker/
│   │   └── page.tsx
│   └── edit-worker/
│       └── page.tsx
│
└── luggage/
    ├── fields.ts
    ├── add-luggage/
    │   └── page.tsx
    └── edit-luggage/
        └── page.tsx
```

## What's in Each `fields.ts` File

```typescript
// src/app/[entity]/fields.ts
import { ProfileField, ProfileFormData } from '../../components/forms/CommonEntityForm';

// Exported field definitions
export const [entityName]Fields: ProfileField[] = [
  // Field definitions here
];

// Mock data for edit/testing
export const mock[EntityName]Data: ProfileFormData = {
  // Mock data here
};
```

## Usage Examples

### Add Page
```typescript
'use client';
import CommonEntityForm, { ProfileFormData } from '../../../components/forms/CommonEntityForm';
import { residentialFields } from '../fields';

export default function AddNewResidential() {
  const handleSave = (data: ProfileFormData) => {
    console.log('Saved:', data);
  };
  
  return (
    <CommonEntityForm
      title="Please provide details below!"
      onSave={handleSave}
      fields={residentialFields}
    />
  );
}
```

### Edit Page
```typescript
'use client';
import CommonEntityForm, { ProfileFormData } from '../../../components/forms/CommonEntityForm';
import { residentialFields, mockResidentialData } from '../fields';

export default function EditResidential() {
  const handleSave = (data: ProfileFormData) => {
    console.log('Updated:', data);
  };
  
  return (
    <CommonEntityForm
      title="Please update details below!"
      onSave={handleSave}
      fields={residentialFields}
      initialValues={mockResidentialData}
    />
  );
}
```

## Benefits

✅ **Single Source of Truth** - Field definitions exist in one place  
✅ **Easy to Maintain** - Update fields once, applies to add & edit  
✅ **Consistent UI** - Same fields configuration for both pages  
✅ **Less Duplication** - No repeated field definitions  
✅ **Scalable** - Easy to add new fields across all pages  

## Refactored Entities

- [x] Residential
- [x] Employee
- [x] Bank Account
- [x] Vehicle
- [x] Visitors
- [x] Zone
- [x] Phase
- [x] Package Type
- [x] CP Agent
- [x] Vendor/Supplier
- [x] Workers
- [x] Luggage

## Next Steps for Edit Pages

1. Check edit pages for other entities (edit-zone, edit-phase, etc.)
2. If they have field definitions, update them to import from `fields.ts`
3. Update mock data in field files if edit pages had different data

## Example: Adding a New Field

To add a new field to residential:

```typescript
// src/app/residential/fields.ts
export const residentialFields: ProfileField[] = [
  // ... existing fields
  { 
    name: 'newField', 
    label: 'New Field Label', 
    type: 'text', 
    required: true, 
    placeholder: 'Enter value' 
  },
];
```

Both add and edit pages will automatically include this field!
