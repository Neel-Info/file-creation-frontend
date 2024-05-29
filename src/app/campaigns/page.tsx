"use client";
import { Box, Button, Flex, Select, useToast } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    try {
      setLoading(true);
      const fetchCampaigns = async () => {
        const response = await fetch("/api/campaign_names");
        const data = await response.json();
        setCampaigns(data.data);
      };

      fetchCampaigns();
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
  }, []);

  const handleClick = () => {
    if (selectedCampaign) {
      router.push(`/campaign_details_rest/${selectedCampaign}`);
    } else {
      toast({
        title: "Select a campaign.",
        description: "Please select a campaign to proceed.",
        status: "warning",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <Box className="min-h-screen overflow-hidden flex justify-center items-center">
      <Box className="max-w-5xl mx-auto m-4">
        <Flex direction={"column"} gap={4}>
          <h1 className="text-2xl font-bold">Select Campaigns</h1>
          <Select
            disabled={loading}
            placeholder="Select a Campaign"
            onChange={(event) => setSelectedCampaign(event.target.value)}
          >
            {campaigns.map((campaign) => (
              <option key={campaign} value={campaign}>
                {campaign}
              </option>
            ))}
          </Select>
          <Button
            colorScheme="blue"
            disabled={loading}
            isLoading={loading}
            onClick={handleClick}
          >
            Load Campaign
          </Button>
        </Flex>
      </Box>
    </Box>
  );
}
