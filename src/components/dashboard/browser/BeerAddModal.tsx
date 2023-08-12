import {
  Button,
  Divider,
  FileInput,
  Group,
  Modal,
  MultiSelect,
  NumberInput,
  ScrollArea,
  Select,
  Stack,
  Text,
  TextInput,
  Textarea,
  rem,
  type ModalProps,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDebouncedValue } from "@mantine/hooks";
import { IconUpload } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { getBeerStyles, type BeerStylesParams } from "~/api/beer_styles";
import type { BeerCreatePayload } from "~/api/beers";
import { getBreweries, type BreweriesParams } from "~/api/breweries";
import { getHops, type HopsParams } from "~/api/hops";
import { FileInputPreviewValueComponent } from "~/components/FileInputValue";
import { fileToBase64 } from "~/utils/files";

interface BeerAddModalProps extends Omit<ModalProps, "onSubmit"> {
  onSubmit: (data: BeerCreatePayload) => void;
  isLoading: boolean;
}

type BeerAddForm = {
  name: string;
  brewery: string | null;
  style: string | null;
  percentage: "" | number;
  volume_ml: "" | number;
  hop_rate: "" | number;
  extract: "" | number;
  IBU: "" | number;
  image: File | null;
  description: string;
  hops: string[];
};

export default function BeerAddModal({
  opened,
  onClose,
  onSubmit,
  isLoading,
  ...rest
}: BeerAddModalProps) {
  const form = useForm<BeerAddForm>({
    initialValues: {
      name: "",
      brewery: "",
      style: "",
      percentage: "",
      volume_ml: "",
      hop_rate: "",
      extract: "",
      IBU: "",
      image: null,
      description: "",
      hops: [],
    },
  });

  const [breweriesSearch, setBreweriesSearch] = useState("");
  const [beerStylesSearch, setBeerStylesSearch] = useState("");
  const [hopsSearch, setHopsSearch] = useState("");

  const [debouncedBreweriesSearch] = useDebouncedValue(breweriesSearch, 500);
  const [debouncedBeerStylesSearch] = useDebouncedValue(beerStylesSearch, 500);
  const [debouncedHopsSearch] = useDebouncedValue(hopsSearch, 500);

  const { data: dataBreweries, isLoading: isLoadingBreweries } = useQuery({
    queryKey: [
      "breweries",
      { search: debouncedBreweriesSearch } satisfies BreweriesParams,
    ] as const,
    queryFn: async ({ pageParam = 1, queryKey }) => {
      const res = await getBreweries({
        page: pageParam as number,
        ...queryKey[1],
      });
      return res.data;
    },
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: opened
  });

  const { data: dataBeerStyles, isLoading: isLoadingBeerStyles } = useQuery({
    queryKey: [
      "beer_styles",
      { name__icontains: debouncedBeerStylesSearch } satisfies BeerStylesParams,
    ] as const,
    queryFn: async ({ pageParam = 1, queryKey }) => {
      const res = await getBeerStyles({
        page: pageParam as number,
        ...queryKey[1],
      });
      return res.data;
    },
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: opened
  });

  const { data: dataHops, isLoading: isLoadingHops } = useQuery({
    queryKey: [
      "hops",
      { name__icontains: debouncedHopsSearch } satisfies HopsParams,
    ] as const,
    queryFn: async ({ pageParam = 1, queryKey }) => {
      const res = await getHops({
        page: pageParam as number,
        ...queryKey[1],
      });
      return res.data;
    },
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: opened
  });

  const breweriesOptions = useMemo(() => {
    return (
      dataBreweries?.results.map((brewery) => ({
        value: String(brewery.id),
        label: brewery.name,
      })) || []
    );
  }, [dataBreweries]);

  const beerStylesOptions = useMemo(() => {
    return (
      dataBeerStyles?.results.map((style) => ({
        value: String(style.id),
        label: style.name,
      })) || []
    );
  }, [dataBeerStyles]);

  const hopsOptions = useMemo(() => {
    return (
      dataHops?.results.map((hop) => ({
        value: String(hop.id),
        label: hop.name,
      })) || []
    );
  }, [dataHops]);

  const handleSubmit = async (values: BeerAddForm) => {
    const imageBase64 = values.image ? await fileToBase64(values.image) : null;
    const payload = {
      name: values.name,
      brewery: Number(values.brewery),
      style: Number(values.style),
      percentage: Number(values.percentage),
      volume_ml: Number(values.volume_ml),
      hop_rate: !!values.hop_rate ? Number(values.hop_rate) : null,
      extract: !!values.extract ? Number(values.extract) : null,
      IBU: !!values.IBU ? Number(values.IBU) : null,
      image: imageBase64,
      description: values.description,
      hops: values.hops.map(Number),
    } satisfies BeerCreatePayload;
    onSubmit(payload);
  };

  useEffect(() => {
    if (!opened) {
      form.reset();
      setBreweriesSearch("");
      setBeerStylesSearch("");
      setHopsSearch("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened]);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size="lg"
      title={<Text size="xl" fw={700}>{`Add beer`}</Text>}
      scrollAreaComponent={ScrollArea.Autosize}
      closeOnClickOutside={false}
      closeOnEscape={false}
      {...rest}
    >
      <form onSubmit={form.onSubmit((values) => void handleSubmit(values))}>
        <Divider label="General information" labelPosition="center" />
        <Stack mb={16}>
          <TextInput
            name="name"
            label="Name"
            placeholder="Enter beer name"
            value={form.values.name}
            onChange={(event) =>
              form.setFieldValue("name", event.currentTarget.value)
            }
            maxLength={60}
            required
          />
          <Select
            data={breweriesOptions}
            name="brewery"
            label="Brewery"
            placeholder="Select brewery"
            nothingFound="No breweries found"
            limit={30}
            value={form.values.brewery}
            onChange={(value) => form.setFieldValue("brewery", value)}
            searchValue={breweriesSearch}
            onSearchChange={setBreweriesSearch}
            disabled={isLoadingBreweries}
            searchable
            clearable
          />
          <Select
            data={beerStylesOptions}
            name="beer_style"
            label="Beer style"
            placeholder="Select beer style"
            nothingFound="No beer styles found"
            limit={30}
            value={form.values.style}
            onChange={(value) => form.setFieldValue("style", value)}
            searchValue={beerStylesSearch}
            onSearchChange={setBeerStylesSearch}
            disabled={isLoadingBeerStyles}
            searchable
            clearable
          />
          <MultiSelect
            data={hopsOptions}
            name="hops"
            label="Hops"
            placeholder="Select hops"
            nothingFound="No hops found"
            limit={30}
            value={form.values.hops}
            onChange={(values) => form.setFieldValue("hops", values)}
            searchValue={hopsSearch}
            onSearchChange={setHopsSearch}
            disabled={isLoadingHops}
            searchable
            clearable
          />
          <Divider label="Description" labelPosition="center" />
          <FileInput
            name="image"
            label="Image"
            placeholder="Upload image"
            valueComponent={FileInputPreviewValueComponent}
            icon={<IconUpload size={rem(14)} />}
            value={form.values.image}
            onChange={(file) => form.setFieldValue("image", file)}
            clearable
          />
          <Textarea
            name="description"
            label="Description"
            placeholder="Enter beer's description e.g. from bottle's label or website"
            value={form.values.description}
            onChange={(event) =>
              form.setFieldValue("description", event.currentTarget.value)
            }
            required
          />
          <Divider label="Parameters" labelPosition="center" />
          <NumberInput
            name="percentage"
            label="Percentage [%]"
            placeholder="Enter beer's percentage (alcohol by volume)"
            value={form.values.percentage}
            onChange={(value) => form.setFieldValue("percentage", value)}
            precision={1}
            step={0.1}
            min={0}
            max={40}
            required
          />
          <NumberInput
            name="volume_ml"
            label="Volume [ml]"
            placeholder="Enter beer's volume in milliliters"
            value={form.values.volume_ml}
            onChange={(value) => form.setFieldValue("volume_ml", value)}
            step={10}
            min={100}
            max={5000}
            required
          />
          <NumberInput
            name="hop_rate"
            label="Hop rate [g/L]"
            placeholder="Enter beer's hop rate in grams per liter"
            value={form.values.hop_rate}
            onChange={(value) => form.setFieldValue("hop_rate", value)}
            min={1}
            max={100}
          />
          <NumberInput
            name="extract"
            label="Extract [°BLG]"
            placeholder="Enter beer's extract in degrees Plato/Balling or percents"
            value={form.values.extract}
            onChange={(value) => form.setFieldValue("extract", value)}
            min={1}
            max={100}
          />
          <NumberInput
            name="IBU"
            label="IBU [°BLG]"
            placeholder="Enter beer's bitterness measured in degrees Plato/Balling or percents"
            value={form.values.IBU}
            onChange={(value) => form.setFieldValue("IBU", value)}
            min={1}
            max={100}
          />
        </Stack>
        <Group position="apart">
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
        </Group>
      </form>
    </Modal>
  );
}
