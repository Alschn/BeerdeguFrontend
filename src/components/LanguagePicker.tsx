import { useState } from "react";
import {
  createStyles,
  UnstyledButton,
  Menu,
  Image,
  Group,
} from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
import flags from "~/assets/flags";
import { useDisclosure } from "@mantine/hooks";

const data = [
  { code: "en", label: "English", image: flags.english },
  { code: "pl", label: "Polski", image: flags.polish },
];

const useStyles = createStyles((theme, { opened }: { opened: boolean }) => ({
  control: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: `${theme.spacing.xs}`,
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[6]
        : theme.colors.gray[0],
    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
    },
  },
  label: {
    fontWeight: 500,
    fontSize: theme.fontSizes.sm,
  },
  icon: {
    transition: "transform 150ms ease",
    transform: opened ? "rotate(180deg)" : "rotate(0deg)",
  },
}));

export default function LanguagePicker({ lang }: { lang: string }) {
  const [isOpen, handlers] = useDisclosure(false);
  const { classes } = useStyles({ opened: isOpen });
  const [selected, setSelected] = useState(
    data.find((item) => item.code === lang) || data[0]
  );

  return (
    <Menu
      onOpen={handlers.open}
      onClose={handlers.close}
      radius="md"
      withinPortal
    >
      <Menu.Target>
        <UnstyledButton className={classes.control}>
          <Group spacing="xs">
            <Image src={selected?.image} width={22} height={22} alt="" />
            <IconChevronDown
              size="1rem"
              className={classes.icon}
              stroke={1.5}
            />
          </Group>
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>
        {data.map((item) => (
          <Menu.Item
            icon={<Image src={item?.image} width={18} height={18} alt="" />}
            onClick={() => setSelected(item)}
            key={item.label}
          >
            {item.label}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
}
