import { type FileInputProps, Group, Center, rem, Avatar } from "@mantine/core";
import { IconPhoto } from "@tabler/icons-react";

export function FileInputValue({ file }: { file: File }) {
  return (
    <Center
      inline
      sx={(theme) => ({
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.colors.dark[7]
            : theme.colors.gray[1],
        fontSize: theme.fontSizes.xs,
        padding: `${rem(3)} ${rem(7)}`,
        borderRadius: theme.radius.sm,
      })}
    >
      <IconPhoto size={rem(14)} style={{ marginRight: rem(5) }} />
      <span
        style={{
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          overflow: "hidden",
          maxWidth: rem(200),
          display: "inline-block",
        }}
      >
        {file.name}
      </span>
    </Center>
  );
}

export function FileInputPreview({ file }: { file: File }) {
  const imageUrl = URL.createObjectURL(file);

  return (
    <Center
      inline
      sx={(theme) => ({
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.colors.dark[7]
            : theme.colors.gray[1],
        fontSize: theme.fontSizes.xs,
        padding: `${rem(3)} ${rem(7)}`,
        borderRadius: theme.radius.sm,
        height: rem(48),
        gap: rem(4),
      })}
    >
      <Avatar src={imageUrl} alt={file.name}>
        <IconPhoto />
      </Avatar>
      <span
        style={{
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          overflow: "hidden",
          maxWidth: rem(200),
          display: "inline-block",
        }}
      >
        {file.name}
      </span>
    </Center>
  );
}

export const FileInputValueComponent: FileInputProps["valueComponent"] = ({
  value,
}) => {
  if (!value) return null;

  if (Array.isArray(value)) {
    return (
      <Group spacing="sm" py="xs">
        {value.map((file, index) => (
          <FileInputValue file={file} key={index} />
        ))}
      </Group>
    );
  }

  return <FileInputValue file={value} />;
};

export const FileInputPreviewValueComponent: FileInputProps["valueComponent"] =
  ({ value }) => {
    if (!value) return null;

    if (Array.isArray(value)) {
      return (
        <Group spacing="sm" py="xs">
          {value.map((file) => (
            <FileInputPreview
              file={file}
              key={`file-input-preview-${file.name}`}
            />
          ))}
        </Group>
      );
    }

    return <FileInputPreview file={value} />;
  };
