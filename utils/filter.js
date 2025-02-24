// ✅ Updated Filter Component
import { useState, useEffect } from "react";
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import axios from "axios";
import styles from "../src/styles/Attest.module.css";

const Filter = ({ searchQuery, setFilteredAttestations, setCourseAttestations }) => {
  const [loading, setLoading] = useState(false);
  const baseURL = "https://arbitrum.easscan.org";
  // const CUSTOM_SCHEMA_UID = "0xadc627b3baae8680c1e7d1f080ea5e50738e7efcc93e95a35269e6841116fffe";
  const CUSTOM_SCHEMA_UID = [
    {
      uid: "0xadc627b3baae8680c1e7d1f080ea5e50738e7efcc93e95a35269e6841116fffe",
      decoder: new SchemaEncoder("string Name,string Onboarding_Event,uint256 Score,string Issuer"),
      searchField: "Onboarding_Event",
    },
    {
      uid: "0xe9a059a2f6cf3a119b0f8c1d5dc022711a447c7fbb94baf6ce670ca2e6faeaeb",
      decoder: new SchemaEncoder("string Name,string Course,uint256 Score,string Issuer"),
      searchField: "Course",
    },
  ];

  const onboardSchemaDecoder = new SchemaEncoder(
    "string Name,string Onboarding_Event,uint256 Score,string Issuer"
  );
  const courseSchemaDecoder = new SchemaEncoder(
    "string Name,string Course,uint256 Score,string Issuer"
  );

  function decodeAttestationData(encodedData, field) {
    try {
      if (field == "Onboarding_Event"){
        const decodedFields = onboardSchemaDecoder.decodeData(encodedData);
        return decodedFields.reduce((acc, field) => {
          acc[field.name] = field.value;
          return acc;
        }, {});
      }
      if (field == "Course"){
        const decodedFields = courseSchemaDecoder.decodeData(encodedData);
        return decodedFields.reduce((acc, field) => {
          acc[field.name] = field.value;
          return acc;
        }, {});
      }

      
    } catch (error) {
      console.error("❌ Error decoding attestation data:", error);
      return {};
    }
  }

  function decodeAllAttestations(attestations, field) {
    return attestations.map((attestation) => ({
      id: attestation.id,
      attester: attestation.attester,
      recipient: attestation.recipient,
      time: new Date(attestation.time * 1000).toLocaleString(),
      decodedData: decodeAttestationData(attestation.data, field),
    }));
  }

  function filterAttestations(decodedArray, fieldValue, fieldName) {
    let value;
    if (fieldName == "Onboarding_Event"){
      value = decodedArray.filter((attestation) =>
        attestation?.decodedData?.Onboarding_Event.value
          .toLowerCase()
          .includes(fieldValue.toLowerCase())
      );
      return value;
    }
    if (fieldName == "Course"){
      value = decodedArray.filter((attestation) =>
        attestation?.decodedData?.Course?.value
          .toLowerCase()
          .includes(fieldValue.toLowerCase())
      );
      return value;
    }
    
  }

  const fetchAndFilterAttestations = async (Uid, fieldName) => {
    if (!searchQuery) {
      setFilteredAttestations([]);
      setCourseAttestations([]);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${baseURL}/graphql`,
        {
          query: `
            query Attestations($schemaId: String!) {
              attestations(
                where: { schemaId: { equals: $schemaId } }
                orderBy: [{ time: desc }]
              ) {
                attester
                revocationTime
                expirationTime
                time
                recipient
                id
                data
                schemaId
              }
            }
          `,
          variables: {
            schemaId: Uid,
          },
        },
        { headers: { "content-type": "application/json" } }
      );

      let decoded;
      let filtered;
      if (fieldName == "Course"){
        decoded = decodeAllAttestations(response.data.data.attestations, "Course");
        filtered = filterAttestations(decoded, searchQuery, "Course");
        console.log(`Filtered name: ${fieldName}`);
        console.log(`Filtered value: ${decoded}`);
        setCourseAttestations(filtered);
      }
      if (fieldName == "Onboarding_Event"){
        decoded = decodeAllAttestations(response.data.data.attestations, "Onboarding_Event");
        filtered = filterAttestations(decoded, searchQuery, "Onboarding_Event");
        console.log(`Filtered name: ${fieldName}`);
        console.log(`Filtered value: ${decoded}`);
        setFilteredAttestations(filtered);
      }
      
      console.error("Decoded attestations:", decoded);
    } catch (error) {
      console.error("❌ Error fetching attestations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      for (let i = 0; CUSTOM_SCHEMA_UID[i] != null; i++){
        fetchAndFilterAttestations(CUSTOM_SCHEMA_UID[i].uid, CUSTOM_SCHEMA_UID[i].searchField);
      }
      
    }, 500);

    return () => clearTimeout(debounceTimeout);
  }, [searchQuery]);

  return;
};

export default Filter;
