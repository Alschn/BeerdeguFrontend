import { Button, type ButtonProps } from "@mantine/core";
import type { ButtonHTMLAttributes } from "react";
import { GoogleIcon } from "./GoogleIcon";

type GoogleButtonProps = Omit<ButtonProps, "leftIcon"> &
  ButtonHTMLAttributes<HTMLButtonElement>;

const GoogleButton = (props: GoogleButtonProps) => {
  return (
    <Button leftIcon={<GoogleIcon />} variant="outline" {...props}>
      Google
    </Button>
  );
};

export default GoogleButton;
