"use client";

import { Grid } from "@mantine/core";
import AccountDetailsCard from "./AccountDetailsCard";
import ChangePasswordCard from "./ChangePasswordCard";

export default function AccountPage() {
  return (
    <Grid>
      <Grid.Col span={12} sm={6}>
        <AccountDetailsCard />
      </Grid.Col>
      <Grid.Col span={12} sm={6}>
        <ChangePasswordCard />
      </Grid.Col>
    </Grid>
  );
}
