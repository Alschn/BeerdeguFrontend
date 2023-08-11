import { TextInput, type TextInputProps } from "@mantine/core";
import { IconSearch, type TablerIconsProps } from "@tabler/icons-react";

type SearchInputProps = Omit<TextInputProps, "icon"> & {
  iconProps?: TablerIconsProps;
};

export default function SearchInput({
  value,
  onChange,
  iconProps,
  ...rest
}: SearchInputProps) {
  return (
    <TextInput
      name="search"
      label="Search"
      placeholder="Search..."
      value={value}
      onChange={onChange}
      w={{ base: 200, lg: 300 }}
      icon={<IconSearch size="1rem" {...iconProps} />}
      {...rest}
    />
  );
}
