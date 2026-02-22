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
import { z } from "zod";
import { useForm, zodResolver } from "@mantine/form";
import { useDebouncedValue } from "@mantine/hooks";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
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

const purchaseAddSchema = z.object({
  beer: z.number({ coerce: true }).min(1),
  packaging: z.string().min(1),
  price: z.number().min(0),
  volume_ml: z.number().min(1),
  purchased_at: z.date().transform((date) => date.toISOString().slice(0, 10)),
});

const PurchaseAddModal = ({
  opened,
  onClose,
  onSubmit,
  isLoading = false,
}: PurchaseAddModalProps) => {
  const dateNowRef = useRef(new Date());
  const [beerSearch, setBeerSearch] = useState("");
  const [debouncedBeerSearch] = useDebouncedValue(beerSearch, 500);

  const beersQuery = useBeersPage({
    params: {
      search: debouncedBeerSearch,
      page_size: 50,
      ordering: "-created_at",
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

  const form = useForm<CreatePurchaseForm>({
    initialValues: {
      beer: null,
      packaging: null,
      price: "",
      volume_ml: "",
      purchased_at: dateNowRef.current,
    },
    validate: zodResolver(purchaseAddSchema),
  });

  const handleSubmit = (values: CreatePurchaseForm) => {
    const parsed = purchaseAddSchema.safeParse(values);
    if (!parsed.success) return;
    onSubmit(parsed.data);
  };

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
            {...form.getInputProps("beer")}
            data={beerOptions}
            searchValue={beerSearch}
            onSearchChange={setBeerSearch}
            name="beer"
            label="Beer"
            placeholder="Select beer..."
            nothingFound="No beers found"
            itemComponent={BeerSelectItem}
            rightSection={
              beersQuery.isLoading ? <Loader size="xs" /> : undefined
            }
            filter={() => true}
            searchable
            clearable
            required
            withinPortal
          />
          <Select
            {...form.getInputProps("packaging")}
            data={packagingOptions}
            name="packaging"
            label="Packaging"
            placeholder="Select packaging..."
            searchable
            clearable
            required
            withinPortal
          />
          <NumberInput
            {...form.getInputProps("price")}
            name="price"
            label="Price [PLN]"
            placeholder="Beer price in Polish Zloty"
            min={0}
            max={1000}
            required
          />
          <NumberInput
            {...form.getInputProps("volume_ml")}
            name="volume_ml"
            label="Volume [ml]"
            placeholder="Beer volume in ml"
            min={0}
            max={1_000_000}
            required
          />
          <DateInput
            {...form.getInputProps("purchased_at")}
            name="purchased_at"
            label="Purchased at"
            placeholder="Purchased at"
            defaultValue={dateNowRef.current}
            maxDate={dateNowRef.current}
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
            <Button type="submit" loading={isLoading}>
              Submit
            </Button>
          </Flex>
        </Stack>
      </form>
    </Modal>
  );
};

export default PurchaseAddModal;
