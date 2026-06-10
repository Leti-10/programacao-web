import { api } from "./apiService";
import type { RecordData, RestCountryOption } from "../types/entities";

type CountryApiItem = {
  name?: { common?: string };
  translations?: { por?: { common?: string } };
};

type CitiesNowResponse = {
  error: boolean;
  msg: string;
  data: string[];
};

type CityPopulationResponse = {
  error: boolean;
  msg: string;
  data?: {
    populationCounts?: {
      year: string;
      value: string;
      sex?: string;
      reliability?: string;
    }[];
  };
};

export async function listExternalCountries(): Promise<RestCountryOption[]> {
  const response = await fetch("https://restcountries.com/v3.1/all?fields=name,translations");

  if (!response.ok) {
    throw new Error("Não foi possível carregar a lista de países.");
  }

  const countries = (await response.json()) as CountryApiItem[];

  return countries
    .map((country) => ({
      nomeEn: country.name?.common ?? "",
      nomePt: country.translations?.por?.common ?? country.name?.common ?? "",
    }))
    .filter((country) => country.nomeEn && country.nomePt)
    .sort((a, b) => a.nomePt.localeCompare(b.nomePt, "pt-BR"));
}

export async function listCitiesByCountry(countryName: string): Promise<string[]> {
  const response = await fetch("https://countriesnow.space/api/v0.1/countries/cities", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ country: countryName }),
  });

  if (!response.ok) {
    throw new Error("Não foi possível carregar as cidades desse país.");
  }

  const result = (await response.json()) as CitiesNowResponse;

  if (result.error) {
    throw new Error(result.msg || "Não foi possível carregar as cidades.");
  }

  return result.data.sort((a, b) => a.localeCompare(b, "pt-BR"));
}

export function getCountryDetails(countryName: string) {
  return api<RecordData>(`/external/country?name=${encodeURIComponent(countryName)}`);
}

export function getCityCoordinates(city: string, country: string) {
  return api<{ latitude: number; longitude: number }>(
    `/external/geocode?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}`,
  );
}

export async function getCityPopulation(
  city: string,
  country: string,
): Promise<number | null> {
  const response = await fetch(
    "https://countriesnow.space/api/v0.1/countries/population/cities",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ city, country }),
    },
  );

  if (!response.ok) {
    return null;
  }

  const result = (await response.json()) as CityPopulationResponse;

  if (result.error || !result.data?.populationCounts?.length) {
    return null;
  }

  const latestPopulation =
    result.data.populationCounts[result.data.populationCounts.length - 1];

  return latestPopulation?.value ? Number(latestPopulation.value) : null;
}