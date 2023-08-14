import { createStyles, type ButtonProps, UnstyledButton } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  control: {
    fontWeight: 500,
    display: "block",
    width: "100%",
    height: 48,
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
    fontSize: theme.fontSizes.md,
    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[7]
          : theme.colors.gray[0],
      color: theme.colorScheme === "dark" ? theme.white : theme.black,
    },
  },
}));

interface ControlButtonProps extends ButtonProps {
  onClick?: () => void;
}

const ControlButton = (props: ControlButtonProps) => {
  const { classes } = useStyles();

  return (
    <UnstyledButton className={classes.control} {...props}>
      {props.children}
    </UnstyledButton>
  );
};

export default ControlButton;
