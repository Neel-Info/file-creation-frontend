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
import { MultiSelect, SelectLabel } from "chakra-multiselect";
import { Select } from "chakra-react-select";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { BiRefresh } from "react-icons/bi";
import Spreadsheet from "react-spreadsheet";

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

  const [data, setData] = useState<Record<string, string>[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, any>>(
    {}
  );
  const [showNonMandatory, setShowNonMandatory] = useState<string[]>([]);

  const [refresh, setRefresh] = useState(false);

  // [
  //   [{ value: "Vanilla" }, { value: "Chocolate" }],
  //   [{ value: "Strawberry" }, { value: "Cookies" }],
  // ];

  const formInputs = useMemo(() => {
    if (data.length === 0) {
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

  const filteredData = useMemo(() => {
    if (data.length === 0) {
      return [];
    }

    const filteredData = data.filter((item) => {
      return Object.keys(selectedFilters).every((key) => {
        if (!selectedFilters[key] || selectedFilters[key].length === 0) {
          return true;
        }
        return selectedFilters[key]
          .map((item: any) => item.value)
          .includes(item[key]);
      });
    });

    return filteredData;
  }, [refresh]);

  const excelData = useMemo(() => {
    if (filteredData.length === 0) {
      return [];
    }

    const keys = Object.keys(filteredData[0]);
    const excelData: any = [];

    filteredData.forEach((item) => {
      const row = keys.map((key) => ({ value: item[key] }));
      excelData.push(row);
    });

    return excelData;
  }, [filteredData]);

  const excelColumns = useMemo(() => {
    if (filteredData.length === 0) {
      return [];
    }

    return Object.keys(filteredData[0]).map((key) => {
      return transformText(key);
    });
  }, [filteredData]);

  const filteredInputs = useMemo(() => {
    let filteredInputs: any = {};
    data.forEach((item) => {
      Object.keys(item).forEach((key) => {
        if (!filteredInputs[key]) {
          filteredInputs[key] = [];
        }

        if (!filteredInputs[key].includes(item[key])) {
          filteredInputs[key].push(item[key]);
        }
      });
    });

    return filteredInputs;
  }, [data, selectedFilters]);

  useEffect(() => {
    try {
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
    }
  }, [name]);

  const hasSelectedFilters = useMemo(
    () =>
      Object.keys(selectedFilters).some(
        (key) => selectedFilters[key].length > 0
      ),
    [selectedFilters]
  );

  return (
    <Box className="flex justify-between items-start relative">
      <Box className="w-[30%] h-screen overflow-scroll border-r-2">
        <h1 className="w-[90%] mx-auto pt-4 text-2xl font-bold">
          Campaign Details
        </h1>
        <Box className="w-[90%] mx-auto">
          {formInputs.map((input) => {
            if (input.options.length === 0) {
              return null;
            }

            // let Content = <></>;
            // if (!input.required) {
            //   Content = (
            //     <Box key={"radioinput" + input.label} className="flex gap-1">
            //       <FormLabel
            //         htmlFor={"non-mandatory-switch" + input.label + "label"}
            //       >
            //         {transformText(input.label)}
            //       </FormLabel>
            //       <Checkbox
            //         onChange={(event) =>
            //           setShowNonMandatory((prev) => {
            //             if (event.target.checked) {
            //               return [...prev, input.label];
            //             } else {
            //               return prev.filter((item) => item !== input.label);
            //             }
            //           })
            //         }
            //       />
            //     </Box>
            //   );
            // }

            // if (!showNonMandatory.includes(input.label) && !input.required) {
            //   return Content;
            // }

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
        Rows Count: <Switch />
        <span className="font-bold text-xl">{filteredData.length}</span>
        {/* {filteredData.length !== 0 && (
          <Spreadsheet data={excelData} columnLabels={excelColumns} />
        )} */}
      </Box>
      <Box className="absolute bottom-2 right-2">
        <Tooltip label="Refresh Data" aria-label="Refresh Data">
          <IconButton
            borderRadius={"999"}
            colorScheme="teal"
            icon={<Icon boxSize={8} as={BiRefresh} />}
            onClick={() => setRefresh((prev) => !prev)}
            aria-label="refresh"
          />
        </Tooltip>
      </Box>
    </Box>
  );
}
