"use client";

import {
  Button,
  Flex,
  Loader,
  Modal,
  type ModalProps,
  NumberInput,
  ScrollArea,
  Select,
  Stack,
  Text,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useDebouncedValue } from "@mantine/hooks";
import { useLayoutEffect, useMemo, useState } from "react";
import { type CreatePurchasePayload } from "~/api/purchases";
import { BeerPackagings } from "~/api/types";
import { useBeersPage } from "~/hooks/api/beers";
import BeerSelectItem from "../ratings/BeerSelectItem";

interface PurchaseAddModalProps extends Omit<ModalProps, "onSubmit"> {
  onSubmit: (data: CreatePurchasePayload) => void;
  isLoading?: boolean;
}

type CreatePurchaseForm = {
  beer: string | null;
  packaging: string | null;
  price: number | "";
  volume_ml: number | "";
  purchased_at: Date | null;
};

const packagingOptions = Object.values(BeerPackagings).map((v) => ({
  value: v,
  label: v.at(0)!.toUpperCase() + v.slice(1).toLowerCase(),
}));

const PurchaseAddModal = ({
  opened,
  onClose,
  onSubmit,
  isLoading = false,
}: PurchaseAddModalProps) => {
  const [beerSearch, setBeerSearch] = useState("");
  const [debouncedBeerSearch] = useDebouncedValue(beerSearch, 500);

  const beersQuery = useBeersPage({
    params: {
      search: debouncedBeerSearch,
      page_size: 50,
    },
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: opened,
  });

  const beerOptions = useMemo(() => {
    if (!beersQuery.data) return [];
    return beersQuery.data.results.map((beer) => ({
      value: String(beer.id),
      label: beer.name,
      description: beer.brewery.name,
      badge: beer.style.name,
      image: beer.image,
    }));
  }, [beersQuery.data]);

  const now = new Date();

  const form = useForm<CreatePurchaseForm>({
    initialValues: {
      beer: null,
      packaging: null,
      price: "",
      volume_ml: "",
      purchased_at: now,
    },
  });

  const handleSubmit = (values: CreatePurchaseForm) => {
    const { beer, packaging, price, volume_ml, purchased_at } = values;

    if (
      !beer ||
      !packaging ||
      price === "" ||
      volume_ml === "" ||
      !purchased_at
    )
      return;

    onSubmit({
      beer: Number(beer),
      packaging: packaging,
      price: price,
      volume_ml: volume_ml,
      // YYYY-MM-DD
      purchased_at: new Date(purchased_at).toISOString().slice(0, 10),
    });
  };

  const hasEmptyFields = useMemo(() => {
    return Object.values(form.values).some((v) => v === null || v === "");
  }, [form.values]);

  useLayoutEffect(() => {
    if (opened) return;
    // slow down clearing form to prevent animation glitches
    setTimeout(() => {
      form.reset();
      setBeerSearch("");
    }, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened]);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size="lg"
      title={<Text size="xl" fw={700}>{`Add New Purchase`}</Text>}
      scrollAreaComponent={ScrollArea.Autosize}
      closeOnClickOutside={false}
      closeOnEscape={false}
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <Select
            name="beer"
            label="Beer"
            placeholder="Select beer..."
            nothingFound="No beers found"
            itemComponent={BeerSelectItem}
            rightSection={
              beersQuery.isLoading ? <Loader size="xs" /> : undefined
            }
            data={beerOptions}
            searchValue={beerSearch}
            onSearchChange={setBeerSearch}
            value={form.values.beer}
            onChange={(value) => form.setFieldValue("beer", value)}
            filter={() => true}
            searchable
            clearable
            required
            withinPortal
          />
          <Select
            name="packaging"
            label="Packaging"
            placeholder="Select packaging..."
            data={packagingOptions}
            value={form.values.packaging}
            onChange={(value) => form.setFieldValue("packaging", value)}
            searchable
            clearable
            required
            withinPortal
          />
          <NumberInput
            name="price"
            label="Price [PLN]"
            placeholder="Beer price in Polish Zloty"
            min={0}
            max={1000}
            value={form.values.price}
            onChange={(value) => form.setFieldValue("price", value)}
            required
          />
          <NumberInput
            name="volume_ml"
            label="Volume [ml]"
            placeholder="Beer volume in ml"
            min={0}
            max={1_000_000}
            value={form.values.volume_ml}
            onChange={(value) => form.setFieldValue("volume_ml", value)}
            required
          />
          <DateInput
            name="purchased_at"
            label="Purchased at"
            placeholder="Purchased at"
            value={form.values.purchased_at}
            onChange={(value) => form.setFieldValue("purchased_at", value)}
            defaultValue={now}
            maxDate={now}
            clearable
            required
          />
          <Flex align="center" justify="space-between">
            <Button
              variant="outline"
              color="red"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" loading={isLoading} disabled={hasEmptyFields}>
              Submit
            </Button>
          </Flex>
        </Stack>
      </form>
    </Modal>
  );
};

export default PurchaseAddModal;
