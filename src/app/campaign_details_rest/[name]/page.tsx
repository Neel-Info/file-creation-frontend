"use client";
import VirtualizedSelect from "@/app/test/components/Select";
import { transformText } from "@/lib/helper";
import {
  Box,
  Checkbox,
  FormLabel,
  Icon,
  IconButton,
  Switch,
  TagLabel,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { BiFilter, BiRefresh } from "react-icons/bi";
import Spreadsheet from "react-spreadsheet";
import {
  SheetsDirective,
  SheetDirective,
  RangesDirective,
  RangeDirective,
  SpreadsheetComponent,
} from "@syncfusion/ej2-react-spreadsheet";
import "./../../../app/globals.css";
import { registerLicense } from "@syncfusion/ej2-base";

const MANDATORY_FIELDS = [
  "last_updated_churn",
  "last_updated_disposition",
  "last_updated_group",
  "last_updated_date",
  "last_updated_group1",
];

type FormInput = {
  label: string;
  value: string;
  type: string;
  options: string[];
  required: boolean;
};

export default function CampaignDetailsPage() {
  const { name } = useParams();
  const toast = useToast();
  registerLicense(
    "Ngo9BigBOggjHTQxAR8/V1NBaF1cXmhPYVJ/WmFZfVpgfF9FaFZTRmYuP1ZhSXxXdkBhWX9Wc31XRGhbV0Y="
  );
  const [data, setData] = useState<Record<string, string>[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<{
    [key: string]: any;
  }>({});
  const spreadsheetRef = useRef<SpreadsheetComponent>(null);
  const [loading, setLoading] = useState(false);

  const formInputs = useMemo(() => {
    if (!data || data.length === 0) {
      return [];
    }
    const keys = Object.keys(data[0]);
    const formInputs: FormInput[] = keys.map((key) => {
      return {
        label: key,
        value: key,
        type: "multiselect",
        options: Array.from(new Set(data.map((item: any) => item[key]))),
        required: MANDATORY_FIELDS.includes(key),
      };
    });

    return formInputs;
  }, [data]);

  useEffect(() => {
    try {
      setLoading(true);
      if (!name) {
        throw new Error("Name parameter is required");
      }

      const fetchCampaignDetails = async () => {
        const response = await fetch(`/api/campaign_details/${name}`);
        const data = await response.json();
        setData(data.data);
      };

      fetchCampaignDetails();
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Unable to fetch campaign details.",
        description: error.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [name]);

  const handleUpdateFilter = async () => {
    try {
      setLoading(true);
      // console.log(JSON.stringify(selectedFilters));
      const response = await fetch(`/api/campaign_details/${name}`, {
        method: "POST",
        body: JSON.stringify(selectedFilters),
      });

      const data = await response.json();

      if (spreadsheetRef.current) {
        // @ts-ignore
        spreadsheetRef.current.sheets[0].ranges[0].dataSource = data.data;
      }
      // toast({
      //   title: "Data updated.",
      //   description: "Campaign details have been updated.",
      //   status: "info",
      //   duration: 9000,
      //   isClosable: true,
      // });
      setData(data.data);
    } catch (error) {
      console.error(error);
      toast({
        title: "An error occurred.",
        description: "Unable to fetch campaigns.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="flex justify-between items-start relative">
      <Box className="w-[30%] h-screen overflow-scroll border-r-2">
        <h1 className="w-[90%] mx-auto pt-4 text-2xl font-bold">
          Campaign Details
        </h1>
        <Box className="w-[90%] mx-auto flex flex-col gap-8 mt-4">
          {formInputs.map((input, i) => {
            if (input.options.length === 0) {
              return null;
            }

            return (
              <Box key={input.label} className="flex flex-col">
                <FormLabel htmlFor={input.label}>
                  {transformText(input.label)}
                </FormLabel>
                <VirtualizedSelect
                  key={input.label}
                  value={selectedFilters[input.label]}
                  options={input.options.map((option) => ({
                    label: option,
                    value: option,
                  }))}
                  onChange={(value) => {
                    setSelectedFilters((prev) => ({
                      ...prev,
                      [input.label]: value,
                    }));
                  }}
                  isMulti
                />
              </Box>
            );
          })}
        </Box>
      </Box>
      <Box className="w-[70%] h-screen overflow-scroll">
        {data?.length && (
          <SpreadsheetComponent ref={spreadsheetRef}>
            <SheetsDirective>
              <SheetDirective>
                <RangesDirective>
                  <RangeDirective dataSource={data}></RangeDirective>
                </RangesDirective>
              </SheetDirective>
            </SheetsDirective>
          </SpreadsheetComponent>
        )}
      </Box>
      <Box className="absolute bottom-2 right-2">
        <Tooltip label="Refresh Data" aria-label="Refresh Data">
          <IconButton
            isLoading={loading}
            zIndex={10}
            borderRadius={"999"}
            colorScheme="teal"
            icon={<Icon boxSize={8} as={BiFilter} />}
            onClick={handleUpdateFilter}
            aria-label="refresh"
          />
        </Tooltip>
      </Box>
    </Box>
  );
}
