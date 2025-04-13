'use client';

import { useCheckbox } from '@/hooks/CheckboxContext';
import ManageDropdown from './manage-dropdown';
import DropdownContent from './dropdown-content';
import { Category } from '@/lib/actions/dropdown';

interface DropdownProps {
  categories: Category[];
}

function Dropdown({ categories }: DropdownProps) {
  const { isDropdownCheckboxChecked } = useCheckbox();

  if (!categories) return null;

  return (
    <>
      {isDropdownCheckboxChecked
        ? categories.map(category => (
            <ManageDropdown
              key={category.id}
              category={category.name}
              links={category.links}
              categoryId={category.id}
            />
          ))
        : categories.map(category => (
            <DropdownContent
              key={category.id}
              category={category.name}
              links={category.links}
            />
          ))}
    </>
  );
}

export default Dropdown;
