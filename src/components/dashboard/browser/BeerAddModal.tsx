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
import {
  Dropzone,
  IMAGE_MIME_TYPE,
  type FileWithPath,
} from "@mantine/dropzone";
import { useForm, zodResolver } from "@mantine/form";
import { useDebouncedValue } from "@mantine/hooks";
import { IconUpload } from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import type { BeerCreatePayload } from "~/api/beers";
import { FileInputPreviewValueComponent } from "~/components/FileInputValue";
import { useBeerStylesPage, useBreweriesPage, useHopsPage } from "~/hooks/api";
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

const beerAddSchema = z.object({
  name: z.string(),
  brewery: z.number({ coerce: true }),
  style: z.number({ coerce: true }),
  percentage: z.number({ coerce: true }),
  volume_ml: z.number({ coerce: true }),
  hop_rate: z.number({ coerce: true }).nullable(),
  extract: z.number({ coerce: true }).nullable(),
  IBU: z.number({ coerce: true }).nullable(),
  image: z.instanceof(File).nullable(),
  description: z.string(),
  hops: z.array(z.number({ coerce: true })),
});

const IMAGE_FORMAT_MESSAGE =
  "Expected an image. Accepted formats: png, jpg, jpeg, webp, avif, gif.";

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
    validate: zodResolver(beerAddSchema),
  });

  const [breweriesSearch, setBreweriesSearch] = useState("");
  const [beerStylesSearch, setBeerStylesSearch] = useState("");
  const [hopsSearch, setHopsSearch] = useState("");

  const [debouncedBreweriesSearch] = useDebouncedValue(breweriesSearch, 500);
  const [debouncedBeerStylesSearch] = useDebouncedValue(beerStylesSearch, 500);
  const [debouncedHopsSearch] = useDebouncedValue(hopsSearch, 500);

  const { data: dataBreweries, isLoading: isLoadingBreweries } =
    useBreweriesPage({
      params: {
        search: debouncedBreweriesSearch,
        page_size: 50,
      },
      staleTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      enabled: opened,
    });

  const { data: dataBeerStyles, isLoading: isLoadingBeerStyles } =
    useBeerStylesPage({
      params: {
        name__icontains: debouncedBeerStylesSearch,
        page_size: 50,
      },
      staleTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      enabled: opened,
    });

  const { data: dataHops, isLoading: isLoadingHops } = useHopsPage({
    params: {
      name__icontains: debouncedHopsSearch,
      page_size: 50,
    },
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: opened,
  });

  const breweriesOptions = useMemo(() => {
    if (!dataBreweries) return [];
    return dataBreweries.results.map((brewery) => ({
      value: String(brewery.id),
      label: brewery.name,
    }));
  }, [dataBreweries]);

  const beerStylesOptions = useMemo(() => {
    if (!dataBeerStyles) return [];
    return dataBeerStyles.results.map((style) => ({
      value: String(style.id),
      label: style.name,
    }));
  }, [dataBeerStyles]);

  const hopsOptions = useMemo(() => {
    if (!dataHops) return [];
    return dataHops.results.map((hop) => ({
      value: String(hop.id),
      label: hop.name,
    }));
  }, [dataHops]);

  const handleSubmit = async (values: BeerAddForm) => {
    const result = beerAddSchema.safeParse(values);
    if (!result.success) return;
    const { image, ...payload } = result.data;
    const imageBase64 = image ? await fileToBase64(image) : null;
    onSubmit({ image: imageBase64, ...payload });
  };

  useEffect(() => {
    if (opened) return;
    // reset values when modal is closed
    form.reset();
    setBreweriesSearch("");
    setBeerStylesSearch("");
    setHopsSearch("");
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
            {...form.getInputProps("name")}
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
            {...form.getInputProps("brewery")}
            searchValue={breweriesSearch}
            onSearchChange={setBreweriesSearch}
            data={breweriesOptions}
            name="brewery"
            label="Brewery"
            placeholder="Select brewery"
            nothingFound="No breweries found"
            filter={() => true}
            limit={50}
            disabled={isLoadingBreweries}
            searchable
            clearable
            required
          />
          <Select
            {...form.getInputProps("style")}
            searchValue={beerStylesSearch}
            onSearchChange={setBeerStylesSearch}
            data={beerStylesOptions}
            name="beer_style"
            label="Beer style"
            placeholder="Select beer style"
            nothingFound="No beer styles found"
            filter={() => true}
            limit={50}
            disabled={isLoadingBeerStyles}
            searchable
            clearable
            required
          />
          <MultiSelect
            {...form.getInputProps("hops")}
            searchValue={hopsSearch}
            onSearchChange={setHopsSearch}
            data={hopsOptions}
            name="hops"
            label="Hops"
            placeholder="Select hops"
            nothingFound="No hops found"
            filter={() => true}
            limit={50}
            disabled={isLoadingHops}
            searchable
            clearable
          />
          <Divider label="Description" labelPosition="center" />
          <FileInput
            {...form.getInputProps("image")}
            name="image"
            label="Image"
            // @ts-expect-error FileInput is incorrectly typed, placeholder works as it should
            placeholder="Drag image here or click to select file"
            icon={<IconUpload size={rem(14)} />}
            valueComponent={FileInputPreviewValueComponent}
            onChange={(file) => {
              if (file && !IMAGE_MIME_TYPE.some((type) => type == file.type)) {
                form.setFieldError("image", IMAGE_FORMAT_MESSAGE);
                return;
              }
              form.setFieldValue("image", file);
            }}
            accept={IMAGE_MIME_TYPE.join(",")}
            inputContainer={(children) => (
              <Dropzone
                activateOnDrag
                activateOnClick={false}
                activateOnKeyboard={false}
                accept={IMAGE_MIME_TYPE}
                multiple={false}
                onDrop={(files) => {
                  const file = (files as [FileWithPath])[0];
                  form.setFieldValue("image", file);
                }}
                onReject={(_rejections) => {
                  form.setFieldError("image", IMAGE_FORMAT_MESSAGE);
                }}
                sx={{
                  padding: 0,
                  border: 0,
                }}
                styles={{
                  // needed to clear FileInput by clicking an X button
                  inner: { pointerEvents: "all" },
                }}
              >
                {children}
              </Dropzone>
            )}
            clearable
          />
          <Textarea
            {...form.getInputProps("description")}
            name="description"
            label="Description"
            placeholder="Enter beer's description e.g. from bottle's label or website"
            required
          />
          <Divider label="Parameters" labelPosition="center" />
          <NumberInput
            {...form.getInputProps("percentage")}
            name="percentage"
            label="Percentage [%]"
            placeholder="Enter beer's percentage (alcohol by volume)"
            precision={1}
            step={0.1}
            min={0}
            max={40}
            required
          />
          <NumberInput
            {...form.getInputProps("volume_ml")}
            name="volume_ml"
            label="Volume [ml]"
            placeholder="Enter beer's volume in milliliters"
            step={10}
            min={100}
            max={5000}
            required
          />
          <NumberInput
            {...form.getInputProps("hop_rate")}
            name="hop_rate"
            label="Hop rate [g/L]"
            placeholder="Enter beer's hop rate in grams per liter"
            min={1}
            max={100}
          />
          <NumberInput
            {...form.getInputProps("extract")}
            name="extract"
            label="Extract [°BLG]"
            placeholder="Enter beer's extract in degrees Plato/Balling or percents"
            min={1}
            max={100}
          />
          <NumberInput
            {...form.getInputProps("IBU")}
            name="IBU"
            label="IBU [°BLG]"
            placeholder="Enter beer's bitterness measured in degrees Plato/Balling or percents"
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
